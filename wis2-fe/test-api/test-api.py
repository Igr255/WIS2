
import json
import time
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/regTable')
def set_reg_table_data():
    return (
        
        [
            {
                "id": 22,
                "shortcut": "jebem",
                "fullname": "toto je elektro",
                "points": "si"
            },
            {
                "id": 23,
                "shortcut": "na",
                "fullname": "ty",
                "points": "len"
            },
            {
                "id": 24,
                "shortcut": "to",
                "fullname": "omezeny",
                "points": "vyjebana"
            },
            {
                "id": 25,
                "shortcut": "whoop whoop",
                "fullname": "ko ko tko",
                "points": "zlatokopka"
            }
        ]
        )

@app.route('/regTableRes', methods = ['POST'])
def get_reg_table_data():
    tableData = request.json
    print(tableData)

    return jsonify({"message":"user not available"})

@app.route('/detailsTable')
def set_detail_table_data():
    return (
        
        [
            {
                "id": 22,
                "shortcut": "IPK",
                "fullname": "sietky",
                "credits": "3",
                "detailsLink": "/registeredSubjectsDetails",
                "visible":"true"
            },
            {
                "id": 23,
                "shortcut": "ISA",
                "fullname": "sietky zas",
                "credits": "1",
                "detailsLink": "/registeredSubjectsDetails",
                "visible":"true"
            },
            {
                "id": 24,
                "shortcut": "IIS",
                "fullname": "meh",
                "credits": "6",
                "detailsLink": "/registeredSubjectsDetails",
                "visible":"true"
            },
            {
                "id": 25,
                "shortcut": "ITU",
                "fullname": "radost",
                "credits": "5",
                "detailsLink": "/registeredSubjectsDetails",
                "visible":"true"
            }
        ]
    )

@app.route('/year')
def set_year():
    return {"year": "2022/2023"}


@app.route('/getDetail', methods = ['POST'])
def get_subject_details():
    subject_id =  request.json['id']
    print(subject_id)
    if (subject_id == '22'):
        return (
            [
                {
                    "id": 1,
                    "course": "Lab cviko 1",
                    "date": "11-02-2022",
                    "lecturer": "Vlado",
                    "points": "100"
                },
                {
                    "id": 2,
                    "course": "Skuska 1",
                    "date": "11-69-2023",
                    "lecturer": "Vlado zase",
                    "points": "1300"
                }
            ]
        )
    elif (subject_id == "23"):
        return (
            [
                {
                    "id": 1,
                    "course": "Sietocky cviko 1",
                    "date": "11-45-2022",
                    "lecturer": "Peter",
                    "points": "1.2"
                },
                {
                    "id": 2,
                    "course": "Sietocky cviko 2",
                    "date": "11-45-2022",
                    "lecturer": "Gregerl",
                    "points": "40"
                },
                {
                    "id": 3,
                    "course": "Skuska 1",
                    "date": "11-11-2022",
                    "lecturer": "Peter",
                    "points": "1"
                }
            ]
        )
    elif (subject_id == "24"):
        return (
            [
                {
                    "id": 1,
                    "course": "prednaska bonus",
                    "date": "11-45-2022",
                    "lecturer": "Miro",
                    "points": "1"
                },
                {
                    "id": 2,
                    "course": "Skuska 1",
                    "date": "11-01-2022",
                    "lecturer": "Jano",
                    "points": "1"
                },
                {
                    "id": 3,
                    "course": "Skuska 2",
                    "date": "11-04-2022",
                    "lecturer": "Michal",
                    "points": "100"
                }
            ]
        )
    elif (subject_id == "25"):
        return (
            [
                {
                    "id": 1,
                    "course": "Lab 1",
                    "date": "10-04-2022",
                    "lecturer": "Idk",
                    "points": "4"
                },
                {
                    "id": 1,
                    "course": "Lab 5",
                    "date": "Ako BY sI tAm DaL ApI??",
                    "lecturer": "Spatny typek",
                    "points": "4"
                },
                {
                    "id": 2,
                    "course": "Prezentacia",
                    "date": "11-11-2022",
                    "lecturer": "Vita <3",
                    "points": "1000"
                }
            ]
        )
    
    return jsonify({"message":"user not available"})


@app.route('/getSubjectData')
def get_subject_data():
    return (
        
        [
            {
                "id": 1,
                "shortcut": "IPK",
                "fullname": "cviko",
                "credits": "20",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true"
            },
            {
                "id": 2,
                "shortcut": "IPK",
                "fullname": "prednaska",
                "credits": "321",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true"
            },
            {
                "id": 4,
                "shortcut": "ISA",
                "fullname": "cviko 1",
                "credits": "15",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true",
            },
            {
                "id": 5,
                "shortcut": "ISA",
                "fullname": "cviko 2",
                "credits": "15",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true",
            },
            {
                "id": 6,
                "shortcut": "ISA",
                "fullname": "cviko 3",
                "credits": "15",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true",
            },
            {
                "id": 33,
                "shortcut": "IIS",
                "fullname": "meh",
                "credits": "6",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true"
            },
            {
                "id": 51,
                "shortcut": "ITU",
                "fullname": "prezentacia skupina c.1",
                "credits": "25",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true"
            },
            {
                "id": 231,
                "shortcut": "ITU",
                "fullname": "prezentacia skupina c.22",
                "credits": "25",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true"
            },
            {
                "id": 7,
                "shortcut": "ITU",
                "fullname": "prednaska 1",
                "credits": "252",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true"
            },
            {
                "id": 8,
                "shortcut": "ITU",
                "fullname": "prednaska 2",
                "credits": "252",
                "detailsLink": "/lecturedCourseDetail",
                "visible":"true"
            }
        ]
    )


@app.route('/getDropDownData')
def get_drop_down_data():
    return (

        [
            {
              "id": 0,
              "value": "All",
              "text": "All"
            },
            {
              "id": 1,
              "value": "IPK",
              "text": "IPK"
            },
            {
              "id": 2,
              "value": "ISA",
              "text": "ISA"
            },
            {
              "id": 3,
              "value": "IIS",
              "text": "IIS"
            },
            {
              "id": 4,
              "value": "ITU",
              "text": "ITU"
            }
        ]
    )

@app.route('/lecturedCourseDetail')
def get_course_detail_data():
    return (

        [
            {
              "id": 0,
              "value": "All",
              "text": "All"
            },
            {
              "id": 1,
              "value": "IPK",
              "text": "IPK"
            },
            {
              "id": 2,
              "value": "ISA",
              "text": "ISA"
            },
            {
              "id": 3,
              "value": "IIS",
              "text": "IIS"
            },
            {
              "id": 4,
              "value": "ITU",
              "text": "ITU"
            }
        ]
    )

@app.route('/setLecturedCourseDetail', methods = ['POST'])
def set_lectured_course_detail():
    tableData = request.json
    print(tableData)

    return jsonify({"message":"accepted"})


@app.route('/setNewPwd', methods = ['POST'])
def set_new_pwd():
    tableData = request.json
    print(tableData)

    return jsonify({"message":"accepted"})


@app.route('/getAllCourses')
def get_all_courses():
    return (
            [
                {
                    "id": 1,
                    "name": "IPK",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tincidunt dui ut ornare. Viverra ipsum nunc aliquet bibendum. Nec tincidunt praesent semper feugiat nibh sed. Non blandit massa enim nec dui nunc mattis. Erat pellentesque adipiscing commodo elit at imperdiet dui. Tortor pretium viverra suspendisse potenti nullam. Condimentum mattis pellentesque id nibh tortor. Feugiat nibh sed pulvinar proin gravida hendrerit. Urna porttitor rhoncus dolor purus non enim praesent. Id semper risus in hendrerit gravida. Adipiscing diam donec adipiscing tristique risus. Adipiscing elit pellentesque habitant morbi. Non enim praesent elementum facilisis leo vel. Purus semper eget duis at tellus at urna condimentum. Nisi lacus sed viverra tellus in hac habitasse. Urna neque viverra justo nec. Consectetur adipiscing elit ut aliquam purus. Integer quis auctor elit sed. Ac auctor augue mauris augue neque gravida in fermentum."
                },
                {
                    "id": 2,
                    "name": "IMP",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tincidunt dui ut ornare. Viverra ipsum nunc aliquet bibendum. Nec tincidunt praesent semper feugiat nibh sed. Non blandit massa enim nec dui nunc mattis. Erat pellentesque adipiscing commodo elit at imperdiet dui. Tortor pretium viverra suspendisse potenti nullam. Condimentum mattis pellentesque id nibh tortor. Feugiat nibh sed pulvinar proin gravida hendrerit. Urna porttitor rhoncus dolor purus non enim praesent. Id semper risus in hendrerit gravida. Adipiscing diam donec adipiscing tristique risus. Adipiscing elit pellentesque habitant morbi. Non enim praesent elementum facilisis leo vel. Purus semper eget duis at tellus at urna condimentum. Nisi lacus sed viverra tellus in hac habitasse. Urna neque viverra justo nec. Consectetur adipiscing elit ut aliquam purus. Integer quis auctor elit sed. Ac auctor augue mauris augue neque gravida in fermentum."
                },
                {
                    "id": 3,
                    "name": "INC",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tincidunt dui ut ornare. Viverra ipsum nunc aliquet bibendum. Nec tincidunt praesent semper feugiat nibh sed. Non blandit massa enim nec dui nunc mattis. Erat pellentesque adipiscing commodo elit at imperdiet dui. Tortor pretium viverra suspendisse potenti nullam. Condimentum mattis pellentesque id nibh tortor. Feugiat nibh sed pulvinar proin gravida hendrerit. Urna porttitor rhoncus dolor purus non enim praesent. Id semper risus in hendrerit gravida. Adipiscing diam donec adipiscing tristique risus. Adipiscing elit pellentesque habitant morbi. Non enim praesent elementum facilisis leo vel. Purus semper eget duis at tellus at urna condimentum. Nisi lacus sed viverra tellus in hac habitasse. Urna neque viverra justo nec. Consectetur adipiscing elit ut aliquam purus. Integer quis auctor elit sed. Ac auctor augue mauris augue neque gravida in fermentum."
                },
                {
                    "id": 4,
                    "name": "INP",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tincidunt dui ut ornare. Viverra ipsum nunc aliquet bibendum. Nec tincidunt praesent semper feugiat nibh sed. Non blandit massa enim nec dui nunc mattis. Erat pellentesque adipiscing commodo elit at imperdiet dui. Tortor pretium viverra suspendisse potenti nullam. Condimentum mattis pellentesque id nibh tortor. Feugiat nibh sed pulvinar proin gravida hendrerit. Urna porttitor rhoncus dolor purus non enim praesent. Id semper risus in hendrerit gravida. Adipiscing diam donec adipiscing tristique risus. Adipiscing elit pellentesque habitant morbi. Non enim praesent elementum facilisis leo vel. Purus semper eget duis at tellus at urna condimentum. Nisi lacus sed viverra tellus in hac habitasse. Urna neque viverra justo nec. Consectetur adipiscing elit ut aliquam purus. Integer quis auctor elit sed. Ac auctor augue mauris augue neque gravida in fermentum."
                },
                {
                    "id": 5,
                    "name": "RET",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tincidunt dui ut ornare. Viverra ipsum nunc aliquet bibendum. Nec tincidunt praesent semper feugiat nibh sed. Non blandit massa enim nec dui nunc mattis. Erat pellentesque adipiscing commodo elit at imperdiet dui. Tortor pretium viverra suspendisse potenti nullam. Condimentum mattis pellentesque id nibh tortor. Feugiat nibh sed pulvinar proin gravida hendrerit. Urna porttitor rhoncus dolor purus non enim praesent. Id semper risus in hendrerit gravida. Adipiscing diam donec adipiscing tristique risus. Adipiscing elit pellentesque habitant morbi. Non enim praesent elementum facilisis leo vel. Purus semper eget duis at tellus at urna condimentum. Nisi lacus sed viverra tellus in hac habitasse. Urna neque viverra justo nec. Consectetur adipiscing elit ut aliquam purus. Integer quis auctor elit sed. Ac auctor augue mauris augue neque gravida in fermentum."
                }
            ]
        )





