from app import db
from . import Utils
from sqlalchemy.ext.associationproxy import association_proxy


class Term(db.Model):
    # Don't touch this, it's managed
    __tablename__ = "terms"
    _id = db.Column(db.Integer, primary_key=True, name='id')
    _course_ID = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    _lecturer_ID = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    _classroom_ID = db.Column(db.Integer, db.ForeignKey('classrooms.id', ondelete='SET NULL'))
    # Attributes
    uuid = db.Column(db.String(40), nullable=False, default=Utils.str_uuid4)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)
    registrationStartDate = db.Column(db.DateTime, nullable=True)
    registrationEndDate = db.Column(db.DateTime, nullable=True)
    maxMark = db.Column(db.Integer, nullable=False, default=0)
    studentLimit = db.Column(db.Integer, nullable=False)
    isRegistrationEnabled = db.Column(db.Boolean, nullable=False, default=False)
    isOptional = db.Column(db.Boolean, nullable=False, default=False)
    # Relationship abstractions
    course = db.relationship("Course", backref=db.backref("terms", cascade='all,delete'), lazy='joined')
    lecturer = db.relationship("User", backref=db.backref("taught_terms"), lazy='joined')
    classroom = db.relationship("Classroom", backref=db.backref("terms_here"))
    # Proxies
    registered_students = association_proxy("marks", "student")

    @db.validates("uuid")
    def uuid_edit_block(self, key, value):
        if self.uuid:  # Already exists
            raise ValueError("UUID is autogenerated and can not be modified!")
        return value

    def __init__(self, title, maxMark, studentLimit, course, *args, **kwargs):
        self.title = title
        self.maxMark = maxMark
        self.studentLimit = studentLimit
        self.course = course
        super(Term, self).__init__(*args, **kwargs)

    def __repr__(self):
        return f"Term[{self._id}] {self.title}"
