from app import db


lecture_pupil_rel = db.Table("lecture_pupil_rel",
                             db.Column('_user_id', db.Integer, db.ForeignKey('users.id')),
                             db.Column('_lecture_id', db.Integer, db.ForeignKey('lectures.id'))
                             )


class Lecture(db.Model):
    # Don't touch this, it's managed
    __tablename__ = "lectures"
    _id = db.Column(db.Integer, primary_key=True, name='id')
    _lecturer_ID = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    _classroom_ID = db.Column(db.Integer, db.ForeignKey('classrooms.id', ondelete='CASCADE'), nullable=True)
    _course_ID = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    # Attributes
    title = db.Column(db.String(100), nullable=True)
    startDate = db.Column(db.DateTime, nullable=True)
    endDate = db.Column(db.DateTime, nullable=True)
    registrationStartDate = db.Column(db.DateTime, nullable=True)
    registrationEndDate = db.Column(db.DateTime, nullable=True)
    studentLimit = db.Column(db.Integer, nullable=False)
    isRegistrationEnabled = db.Column(db.Boolean, nullable=False, default=False)
    isOptional = db.Column(db.Boolean, nullable=False, default=False)
    # Relationship abstractions
    course = db.relationship("Course", backref=db.backref("lectures", cascade='all,delete'), lazy='joined')
    classroom = db.relationship("Classroom", backref=db.backref("lectures", cascade='all,delete'), lazy='joined')
    lecturer = db.relationship("User", backref=db.backref("taught_lectures", cascade='all,delete'), lazy='joined')
    registered_students = db.relationship("User", backref="registered_lectures", secondary=lecture_pupil_rel)

    def __init__(self, title, studentLimit, lecturer, course, *args, **kwargs):
        self.title = title
        self.studentLimit = studentLimit
        self.lecturer = lecturer
        self.course = course
        super(Lecture, self).__init__(*args, **kwargs)

    def __repr__(self):
        return f"Lecture {self.title}"
