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
const fs = require("fs");

let students = [];
let courses = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            students = JSON.parse(fs.readFileSync("./Data/students.json"));
            courses = JSON.parse(fs.readFileSync("./Data/courses.json"));
            resolve();
        } catch (err) {
            reject("Unable to read the data files");
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
            reject("No students found for the given course");
        } else {
            resolve(filteredStudents);
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        const student = students.find(student => student.studentNum == num);
        if (student) {
            resolve(student);
        } else {
            reject("No student found for the given student number");
        }
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        studentData.studentNum = students.length + 1;
        students.push(studentData);
        resolve();
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        const studentIndex = students.findIndex(student => student.studentNum == studentData.studentNum);
        if (studentIndex !== -1) {
            students[studentIndex] = studentData;
            resolve();
        } else {
            reject("No student found for the given student number");
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
        if (course) {
            resolve(course);
        } else {
            reject("No course found for the given course ID");
        }
    });
}

module.exports = {
    initialize,
    getAllStudents,
    getStudentsByCourse,
    getStudentByNum,
    addStudent,
    updateStudent,
    getCourses,
    getCourseById
};
