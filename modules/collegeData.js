/**const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {

        studentData.TA = (studentData.TA) ? true : false;
        studentData.studentNum = dataCollection.students.length + 1;
        dataCollection.students.push(studentData);

        resolve();
    });

}; 
**/
const fs = require('fs');

let students = [];
let courses = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile('./data/students.json', (err, data) => {
                if (err) throw err;
                students = JSON.parse(data);
            });
            fs.readFile('./data/courses.json', (err, data) => {
                if (err) throw err;
                courses = JSON.parse(data);
            });
            resolve();
        } catch (err) {
            reject("Unable to read files");
        }
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (students.length === 0) {
            reject("No students found");
        } else {
            resolve(students);
        }
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = students.filter(student => student.course == course);
        if (filteredStudents.length === 0) {
            reject("No students found for this course");
        } else {
            resolve(filteredStudents);
        }
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (courses.length === 0) {
            reject("No courses found");
        } else {
            resolve(courses);
        }
    });
}

function getCourseById(id) {
    return new Promise((resolve, reject) => {
        const course = courses.find(course => course.courseId == id);
        if (!course) {
            reject("No course found");
        } else {
            resolve(course);
        }
    });
}

function addStudent(student) {
    return new Promise((resolve, reject) => {
        students.push(student);
        fs.writeFile('./data/students.json', JSON.stringify(students, null, 2), (err) => {
            if (err) {
                reject("Unable to add student");
            } else {
                resolve();
            }
        });
    });
}

function updateStudent(student) {
    return new Promise((resolve, reject) => {
        const index = students.findIndex(s => s.studentNum == student.studentNum);
        if (index !== -1) {
            students[index] = student;
            fs.writeFile('./data/students.json', JSON.stringify(students, null, 2), (err) => {
                if (err) {
                    reject("Unable to update student");
                } else {
                    resolve();
                }
            });
        } else {
            reject("Student not found");
        }
    });
}

module.exports = {
    initialize,
    getAllStudents,
    getStudentsByCourse,
    getCourses,
    getCourseById,
    addStudent,
    updateStudent
};
