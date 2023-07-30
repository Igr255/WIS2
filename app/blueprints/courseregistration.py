from app import db
from app.models.User import User, UserType
from app.models.Course import Course
from app.models.Term import Term
from app.models.TermMark import TermMark
from app.models.CourseRegistration import CourseRegistration
from flask import Blueprint, abort, jsonify, request, session
from sqlalchemy.exc import IntegrityError
from app.blueprints.user_util import user_auth, need_user_logged


courseregistration_endpoint = Blueprint("courseregistration_endpoint", __name__)


def abort_bad_json():
    abort(400, description="Missing fields in JSON data")


@courseregistration_endpoint.errorhandler(400)
def bad_request(e):
    return jsonify(message=f"{e.description}"), 400


@courseregistration_endpoint.errorhandler(404)
def not_found(e):
    return jsonify(message=f"{e.description}"), 404


@courseregistration_endpoint.errorhandler(403)
def forbidden(e):
    return jsonify(message=f"{e.description}"), 403


@courseregistration_endpoint.route('/approve', methods=["POST"])
@need_user_logged
def approve_registration(user):
    data = request.get_json()
    try:
        reg = CourseRegistration.query.filter_by(uuid=data["id"]).first_or_404()
        if user.uuid != reg.course.garant.uuid:
            abort(403)
        reg.isApproved = True
        db.session.add(reg)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@courseregistration_endpoint.route('/deny', methods=["POST"])
@need_user_logged
def deny_registration(user):
    data = request.get_json()
    try:
        reg = CourseRegistration.query.filter_by(uuid=data["id"]).first_or_404()
        if user.uuid != reg.course.garant.uuid:
            abort(403)
        db.session.delete(reg)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()
