from app import db
from app.models.User import UserType
from flask import Blueprint, abort, jsonify, request, session
from app.models.Classroom import Classroom
from sqlalchemy.exc import IntegrityError
from app.blueprints.user_util import user_auth, need_user_logged


classroom_endpoint = Blueprint("classroom_endpoint", __name__)


def abort_bad_json():
    abort(400, description="Missing fields in JSON data")


@classroom_endpoint.errorhandler(400)
def bad_request(e):
    return jsonify(message=f"{e.description}"), 400


@classroom_endpoint.errorhandler(404)
def not_found(e):
    return jsonify(message=f"{e.description}"), 404


@classroom_endpoint.errorhandler(403)
def forbidden(e):
    return jsonify(message=f"{e.description}"), 403


@classroom_endpoint.route('/list/<int:page>')
@user_auth(UserType.USER)
def list_classrooms(page):
    classrooms_paged = db.paginate(db.select(Classroom).order_by(Classroom.name), page=page, per_page=20)
    ret = {
        "totalPages": classrooms_paged.pages,
        "currentPage": classrooms_paged.page,
        "rooms": []
    }
    for classroom in classrooms_paged:
        ret["rooms"].append({
            'id': classroom.uuid,
            'name': classroom.name,
            'building': classroom.building
        })
    return jsonify(ret), 200


@classroom_endpoint.route('/edit', methods=["POST"])
@user_auth(UserType.ADMIN)
def edit_classroom():
    data = request.get_json()
    try:
        classroom = Classroom.query.filter_by(uuid=data["id"]).first_or_404()
        classroom.name = data["name"]
        classroom.building = data["building"]
        db.session.add(classroom)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@classroom_endpoint.route('/create', methods=["POST"])
@user_auth(UserType.ADMIN)
def create_classroom():
    data = request.get_json()
    try:
        classroom = Classroom(data["name"], building=data["building"])
        db.session.add(classroom)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@classroom_endpoint.route('/delete', methods=["DELETE"])
@user_auth(UserType.ADMIN)
def delete_classroom():
    data = request.get_json()
    try:
        classroom = Classroom.query.filter_by(uuid=data["id"]).first_or_404()
        db.session.delete(classroom)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()
