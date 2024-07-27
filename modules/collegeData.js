
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
