from app import db
from app.models.User import User, UserType
from app.models.Course import Course
from app.models.Term import Term
from app.models.TermMark import TermMark
from app.models.CourseRegistration import CourseRegistration
from flask import Blueprint, abort, jsonify, request, session
from sqlalchemy.exc import IntegrityError
from app.blueprints.user_util import user_auth, need_user_logged


course_endpoint = Blueprint("course_endpoint", __name__)


def abort_bad_json():
    abort(400, description="Missing fields in JSON data")


@course_endpoint.errorhandler(400)
def bad_request(e):
    return jsonify(message=f"{e.description}"), 400


@course_endpoint.errorhandler(404)
def not_found(e):
    return jsonify(message=f"{e.description}"), 404


@course_endpoint.errorhandler(403)
def forbidden(e):
    return jsonify(message=f"{e.description}"), 403


@course_endpoint.route('/list/notregistered', methods=["GET"])
@need_user_logged
def list_not_registered(user):
    ret = []
    for course in Course.query.filter(Course.uuid.not_in([course.uuid for course in user.registered_courses]),
                                      Course.isApproved==True).all():
        ret.append({
            "id": course.uuid,
            "shortcut": course.short_name,
            "fullname": course.name,
            "credist": course.credits
        })
    return jsonify(ret), 200


@course_endpoint.route('/list/registered', methods=['GET'])
@need_user_logged
def list_registered(user):
    ret = []
    for course in user.registered_courses:
        total_mark = 0
        for mark in TermMark.query.filter(TermMark.course.has(uuid=course.uuid), TermMark.student.has(uuid=user.uuid)):
            total_mark += mark.mark
        ret.append({
            'id': course.uuid,
            'shortcut': course.short_name,
            'fullname': course.name,
            'credits': course.credits,
            'points': total_mark
        })
    return jsonify(ret), 200


@course_endpoint.route('/list/taught', methods=["GET"])
@need_user_logged
def list_taught(user):
    ret = []
    for course in user.taught_courses:
        ret.append({
            'id': course.uuid,
            'shortcut': course.short_name,
            'fullname': course.name,
            'garant': f"{course.garant.name} {course.garant.surname}"
        })
    return jsonify(ret), 200


@course_endpoint.route('/register', methods=['POST'])
@need_user_logged
def register_course(user):
    data = request.get_json()
    try:
        course = Course.query.filter_by(uuid=data["id"]).first()
        if len(course.registered_students) == course.student_limit:
            abort(409, description="Student limit reached")
        registration = CourseRegistration(user, course)
        registration.isApproved = False
        db.session.add(registration)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@course_endpoint.route('/detail/terms/<course_id>', methods=["GET"])
@need_user_logged
def terms_detail(user, course_id):
    ret = []
    Course.query.filter_by(uuid=course_id).first_or_404(description="Course not found")
    for mark in TermMark.query.filter(TermMark.course.has(uuid=course_id), TermMark.student.has(uuid=user.uuid)).all():
        lastmodifiedby = mark.lastModifiedBy
        name, surname = "", ""
        if lastmodifiedby is not None:
            name, surname = lastmodifiedby.name, lastmodifiedby.surname
        ret.append({
            'id': mark.uuid,
            'course': mark.term.title,  # AKA term title, ale mokne je 5IQ a nechce se mu to menit
            'date': mark.lastModified,
            'lecturer': f"{name} {surname}",
            'points': mark.mark
        })
    return jsonify(ret), 200


@course_endpoint.route('/list', methods=["GET"])
def list_courses():
    ret = []
    for course in Course.query.all():
        if not course.isApproved:
            continue
        ret.append({
            'id': course.uuid,
            'description': course.description,
            'name': course.name,
            'shortcut': course.short_name
        })
    return jsonify(ret), 200


@course_endpoint.route('/list/garanted', methods=["GET"])
@user_auth(UserType.USER)
@need_user_logged
def list_garanted(user):
    ret = []
    for course in user.garanted_courses:
        ret.append({
            'id': course.uuid,
            'shortcut': course.short_name,
            'name': course.name,
            'description': course.description,
            'credits': course.credits,
            'isApproved': course.isApproved,
            'studentLimit': course.student_limit
        })
    return jsonify(ret), 200


@course_endpoint.route('/list/notapproved', methods=["GET"])
@user_auth(UserType.ADMIN)
def list_not_approved():
    unapproved_courses = Course.query.filter_by(isApproved=False).all()
    ret = []
    for course in unapproved_courses:
        ret.append({
            'id': course.uuid,
            'userLogin': course.garant.login,
            'userName': course.garant.name,
            'userSurname': course.garant.surname,
            'courseName': course.name,
            'courseShortcut': course.short_name
        })
    return jsonify(ret), 200


@course_endpoint.route('/approve', methods=["POST"])
@user_auth(UserType.ADMIN)
def approve_course():
    data = request.get_json()
    try:
        course = Course.query.filter_by(uuid=data["id"]).first_or_404()
        course.isApproved = True
        db.session.add(course)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@course_endpoint.route('/delete', methods=["DELETE"])
@need_user_logged
def delete_course(user):
    data = request.get_json()
    try:
        course = Course.query.filter_by(uuid=data["id"]).first_or_404()
        if not (user.uuid == course.garant.uuid or user.user_type == UserType.ADMIN):
            abort(403, description="Insufficient permissions")
        db.session.delete(course)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@course_endpoint.route('/list/lecturers/<course_id>', methods=["GET"])
@user_auth(UserType.USER)
def list_lecturers(course_id):
    course = Course.query.filter_by(uuid=course_id).first_or_404()
    ret = []
    for lecturer in course.registered_lecturers:
        ret.append({
            'id': lecturer.uuid,
            'name': lecturer.name,
            'surname': lecturer.surname,
            'login': lecturer.login
        })
    return jsonify(ret), 200


@course_endpoint.route('/addlecturer', methods=["POST"])
@user_auth(UserType.USER)
@need_user_logged
def add_lecturer(user):
    data = request.get_json()
    try:
        course = Course.query.filter_by(uuid=data["courseid"]).first_or_404()
        if not user.uuid == course.garant.uuid:
            abort(403, description="Unauthorized")
        course.registered_lecturers.append(User.query.filter_by(uuid=data["id"]).first_or_404())
        db.session.add(course)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@course_endpoint.route('/deletelecturer', methods=["POST"])
@user_auth(UserType.USER)
@need_user_logged
def delete_lecturer(user):
    data = request.get_json()
    try:
        course = Course.query.filter_by(uuid=data["courseid"]).first_or_404()
        if not user.uuid == course.garant.uuid:
            abort(403, description="Unauthorized")
        course.registered_lecturers.remove(User.query.filter_by(uuid=data["id"]).first_or_404())
        db.session.add(course)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@course_endpoint.route('/list/students/<course_id>', methods=["GET"])
@user_auth(UserType.USER)
def list_studetns_in_course(course_id):
    course = Course.query.filter_by(uuid=course_id).first_or_404()
    ret = []
    for student in course.registered_students:
        ret.append({
            'id': student.uuid,
            'name': student.name,
            'surname': student.surname,
            'login': student.login
        })
    return jsonify(ret), 200


@course_endpoint.route('/list/unapproverregistrations/<course_id>', methods=["GET"])
@need_user_logged
def list_unapproved_students(user, course_id):
    course = Course.query.filter_by(uuid=course_id).first_or_404()
    if user.uuid != course.garant.uuid:
        abort(403)
    ret = []
    for registration in course.user_registrations:
        if registration.isApproved:
            continue
        ret.append({
            'id': registration.uuid,
            'name': registration.student.name,
            'surname': registration.student.surname,
            'login': registration.student.login
        })
    return jsonify(ret), 200


@course_endpoint.route('/create', methods=["POST"])
@need_user_logged
def create_course(user):
    data = request.get_json()
    try:
        course = Course(data["shortcut"], data["name"], data["studentLimit"], user, data["credits"])
        db.session.add(course)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()
    except IntegrityError:
        abort(409, description="Already exists")


@course_endpoint.route('/setdescription', methods=['POST'])
@need_user_logged
def set_course_description(user):
    data = request.get_json()
    try:
        course = Course.query.filter_by(uuid=data["id"]).first_or_404()
        if not user.uuid == course.garant.uuid:
            abort(403)
        course.description = data["description"]
        db.session.add(course)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()
