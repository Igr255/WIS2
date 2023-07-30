from app import db
from app.models.User import User, UserType
from flask import Blueprint, abort, jsonify, request, session
from sqlalchemy.exc import IntegrityError
from app.blueprints.user_util import user_auth, need_user_logged

user_endpoint = Blueprint("user_endpoint", __name__)


def abort_bad_json():
    abort(400, description="Missing fields in JSON data")


@user_endpoint.errorhandler(400)
def bad_request(e):
    return jsonify(message=f"{e.description}"), 400


@user_endpoint.errorhandler(404)
def not_found(e):
    return jsonify(message=f"{e.description}"), 404


@user_endpoint.errorhandler(403)
def forbidden(e):
    return jsonify(message=f"{e.description}"), 403


@user_endpoint.route("/register", methods=["POST"])
@user_auth(UserType.ADMIN)
def register_user():
    """JSON data required:

    """
    data = request.get_json()
    try:
        new_user = User(data["login"], data["name"], data["surname"], data["email"],
                        UserType.USER, data["password"])
        db.session.add(new_user)
        db.session.commit()
    except KeyError:
        abort(400, description="Missing keys in JSON data")
    except IntegrityError:
        return jsonify(message="User already exists"), 409

    return jsonify(status="OK"), 200


@user_endpoint.route("/login", methods=["POST"])
def login():
    """JSON data required:
        login - users login
        password - users password
    """
    data = request.get_json()
    try:
        user = User.query.filter_by(login=data["login"]).first_or_404(description="User not found")
        if user.check_password(data["password"]):
            session["user"] = user.uuid
            return jsonify(status="OK"), 200
        else:
            return jsonify(message="Bad password"), 403
    except KeyError:
        abort(400, description="Missing keys in JSON data")


@user_endpoint.route("/auth/<string:level>", methods=["GET"])
def check_auth(level: str):
    if "user" not in session:
        abort(403, description="No user logged in")
    user = User.query.filter_by(uuid=session["user"]).first_or_404(description="Logged in user not found (DAFUQ?)")
    try:
        req_level = UserType[level.upper()]
        if not user.user_type.value >= req_level.value:
            return jsonify(level=False), 403
        else:
            return jsonify(level=True), 200
    except KeyError:
        abort(400, description=f"Unknown user authorisation level {level}")


@user_endpoint.route("/logout", methods=["GET"])
def logout():
    if "user" in session:
        del session["user"]
    return jsonify(status="OK"), 200


@user_endpoint.route("/change-passwd", methods=["POST"])
@need_user_logged
def change_passwd(user):
    data = request.get_json()
    try:
        if user.check_password(data["oldPwd"]):
            user.set_password(data["newPwd"])
            db.session.add(user)
            db.session.commit()
        else:
            abort(403, description="Bad password")
    except KeyError:
        abort(400, description="Missing keys in JSON data")
    return jsonify(status="OK"), 200


@user_endpoint.route("/list/admin/all/<int:page>", methods=["GET"])
@user_auth(UserType.ADMIN)
def list_all_users(page):
    users_paged = db.paginate(db.select(User).order_by(User.surname), page=page, per_page=10)
    ret = {
        "totalPages": users_paged.pages,
        "currentPage": users_paged.page,
        "users": []
    }
    for user in users_paged:
        ret["users"].append({
            "id": user.uuid,
            "login": user.login,
            "name": user.name,
            "surname": user.surname,
            "email": user.e_mail
        })
    return jsonify(ret), 200


@user_endpoint.route("/edit/admin", methods=["POST"])
@user_auth(UserType.ADMIN)
def admin_edit_user():
    data = request.get_json()
    try:
        target_user: User = User.query.filter_by(uuid=data["id"]).first_or_404(description="Target user not found")
        target_user.name = data["name"]
        target_user.surname = data["surname"]
        target_user.login = data["login"]
        target_user.e_mail = data["email"]
        if not data["password"] == "":
            target_user.set_password(data["password"])
        db.session.add(target_user)
        db.session.commit()
        return jsonify(stat="OK"), 200
    except ValueError:
        abort_bad_json()
    except KeyError:
        abort_bad_json()
    except IntegrityError:
        return jsonify(message=f"Login {data['login']} is already taken"), 409


@user_endpoint.route("/remove", methods=["DELETE"])
@user_auth(UserType.ADMIN)
@need_user_logged
def remove_user(user):
    data = request.get_json()
    try:
        if user.uuid == data["id"]:
            abort(400, description="User can not delete himself")
        deleted_user = User.query.filter_by(uuid=data["id"]).first_or_404(description="Designated user not found")
        db.session.delete(deleted_user)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@user_endpoint.route('/list/all', methods=["GET"])
@user_auth(UserType.USER)
@need_user_logged
def list_users(user):
    ret = []
    for other_user in User.query.all():
        if user.uuid == other_user.uuid:
            continue
        ret.append({
            'id': other_user.uuid,
            'name': other_user.name,
            'surname': other_user.surname,
            'login': other_user.login
        })
    return jsonify(ret), 200
