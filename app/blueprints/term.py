from app import db
from app.models.User import User, UserType
from app.models.Course import Course
from app.models.Term import Term
from app.models.TermMark import TermMark
from app.models.CourseRegistration import CourseRegistration
from flask import Blueprint, abort, jsonify, request, session
from sqlalchemy.exc import IntegrityError
from app.blueprints.user_util import user_auth, need_user_logged
from dateutil import parser as dateparse


term_endpoint = Blueprint("term_endpoint", __name__)


def abort_bad_json():
    abort(400, description="Missing fields in JSON data")


@term_endpoint.errorhandler(400)
def bad_request(e):
    return jsonify(message=f"{e.description}"), 400


@term_endpoint.errorhandler(404)
def not_found(e):
    return jsonify(message=f"{e.description}"), 404


@term_endpoint.errorhandler(403)
def forbidden(e):
    return jsonify(message=f"{e.description}"), 403


@term_endpoint.route('/teacher/list/bycourse/<course_id>', methods=["GET"])
@user_auth(UserType.USER)
def list_terms_for_taught_course(course_id):
    course = Course.query.filter_by(uuid=course_id).first_or_404()
    ret = []
    for term in course.terms:
        ret.append({
            'id': term.uuid,
            'classname': term.title,
            'students': len(term.registered_students),
            'maxstudents': term.studentLimit,
            'descritpion': term.description,
            'startDate': term.start_date.isoformat() if term.start_date else term.start_date,
            'endDate': term.end_date.isoformat() if term.end_date else term.end_date,
            'registrationEndDate': term.registrationEndDate.isoformat() if term.registrationEndDate else term.registrationEndDate,
            'registrationStartDate': term.registrationStartDate.isoformat() if term.registrationStartDate else term.registrationStartDate,
            'maxMark': term.maxMark,
            'studentLimit': term.studentLimit,
            'isRegistrationEnabled': term.isRegistrationEnabled,
            'isOptional': term.isOptional
        })
    return jsonify(ret), 200


@term_endpoint.route('/teacher/detail/<term_id>/<int:page>', methods=["GET"])
@user_auth(UserType.USER)
def term_detail_teacher(term_id, page):
    term = Term.query.filter_by(uuid=term_id).first_or_404()
    marks_paged = db.paginate(db.select(TermMark).filter(TermMark.term.has(uuid=term.uuid)),
                              per_page=1, page=page)
    ret = {
        'totalPages': marks_paged.pages,
        'currentPage': marks_paged.page,
        'marks': []
    }
    for mark in marks_paged:
        ret["marks"].append({
            'mark_id': mark.uuid,
            'name': mark.student.name,
            'surname': mark.student.surname,
            'points': mark.mark,
            'maxpoints': term.maxMark
        })
    return jsonify(ret), 200


@term_endpoint.route('/teacher/edit', methods=["POST"])
@user_auth(UserType.USER)
@need_user_logged
def edit_mark(user):
    data = request.get_json()
    try:
        mark: TermMark = TermMark.query.filter_by(uuid=data["mark_id"]).first_or_404()
        if int(data["points"]) > mark.term.maxMark:
            abort_bad_json()
        mark.modify(int(data["points"]), user)
        db.session.add(mark)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()


@term_endpoint.route('/create', methods=['POST'])
@need_user_logged
def create_term(user):
    data = request.get_json()
    try:
        course = Course.query.filter_by(uuid=data["courseid"]).first_or_404()
        if not user.uuid == course.garant.uuid:
            abort(403)
        term = Term(
            course=course,
            title=data["classname"],
            maxMark=data["maxMark"],
            studentLimit=data["studentLimit"]
        )
        term.start_date = dateparse.parse(data["startDate"])
        term.end_date = dateparse.parse(data["endDate"])
        term.registrationEndDate = dateparse.parse(data["registrationEndDate"])
        term.registrationStartDate = dateparse.parse(data["registrationEndDate"])
        term.isOptional = data["isOptional"]
        term.isRegistrationEnabled = data["isRegistrationEnabled"]
        db.session.add(term)
        db.session.commit()
        return jsonify(status='OK'), 200
    except KeyError:
        abort_bad_json()
    except dateparse.ParserError:
        abort_bad_json()
