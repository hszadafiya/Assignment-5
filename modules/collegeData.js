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

}; **/
const fs = require('fs');
const path = require('path');

// Paths to JSON files
const studentsPath = path.join(__dirname, '../data/students.json');
const coursesPath = path.join(__dirname, '../data/courses.json');

let students = [];
let courses = [];

// Initialize function to read data from JSON files
const initialize = () => {
    return new Promise((resolve, reject) => {
        try {
            students = JSON.parse(fs.readFileSync(studentsPath, 'utf-8'));
            courses = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));
            console.log('Students:', students);
            console.log('Courses:', courses);
            resolve();
        } catch (err) {
            reject("Unable to read data files");
        }
    });
};

// Get all students
const getAllStudents = () => {
    return new Promise((resolve, reject) => {
        if (students.length === 0) {
            reject("No students found");
        } else {
            resolve(students);
        }
    });
};

// Get students by course
const getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        const filteredStudents = students.filter(student => student.course == course);
        if (filteredStudents.length === 0) {
            reject("No students found for the given course");
        } else {
            resolve(filteredStudents);
        }
    });
};

// Add a new student
const addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        studentData.studentNum = students.length + 1;
        students.push(studentData);
        fs.writeFileSync(studentsPath, JSON.stringify(students, null, 4));
        resolve();
    });
};

// Get a student by student number
const getStudentByNum = (studentNum) => {
    return new Promise((resolve, reject) => {
        const student = students.find(student => student.studentNum == studentNum);
        if (student) {
            resolve(student);
        } else {
            reject("Student not found");
        }
    });
};

// Update student details
const updateStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        const index = students.findIndex(student => student.studentNum == studentData.studentNum);
        if (index !== -1) {
            students[index] = studentData;
            fs.writeFileSync(studentsPath, JSON.stringify(students, null, 4));
            resolve();
        } else {
            reject("Student not found");
        }
    });
};

// Get all courses
const getCourses = () => {
    return new Promise((resolve, reject) => {
        if (courses.length === 0) {
            reject("No courses found");
        } else {
            resolve(courses);
        }
    });
};

// Get a course by course ID
const getCourseById = (courseId) => {
    return new Promise((resolve, reject) => {
        const course = courses.find(course => course.courseId == courseId);
        if (course) {
            resolve(course);
        } else {
            reject("Course not found");
        }
    });
};

module.exports = {
    initialize,
    getAllStudents,
    getStudentsByCourse,
    addStudent,
    getStudentByNum,
    updateStudent,
    getCourses,
    getCourseById
};
