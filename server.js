/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
* Name: Heet Zadafiya
* Student ID: 140255233  Date: 26 Jun 2024
*
* Online (vercel) Link: 
*
********************************************************************************/
/**  
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const data = require("./modules/collegeData.js");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Configure Handlebars
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function(url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

// Middleware to serve static files and parse form data
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Middleware to set the active route
app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course).then((data) => {
            res.render("students", { students: data });
        }).catch((err) => {
            res.render("students", { message: "no results" });
        });
    } else {
        data.getAllStudents().then((data) => {
            res.render("students", { students: data });
        }).catch((err) => {
            res.render("students", { message: "no results" });
        });
    }
});

app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

app.post("/students/add", (req, res) => {
    data.addStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch((err) => {
        res.status(500).send("Unable to add student");
    });
});

app.get("/student/:studentNum", (req, res) => {
    data.getStudentByNum(req.params.studentNum).then((data) => {
        res.render("student", { student: data });
    }).catch((err) => {
        res.render("student", { message: "no results" });
    });
});

app.post("/student/update", (req, res) => {
    data.updateStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch((err) => {
        res.status(500).send("Unable to update student");
    });
});

app.get("/courses", (req, res) => {
    data.getCourses().then((data) => {
        res.render("courses", { courses: data });
    }).catch((err) => {
        res.render("courses", { message: "no results" });
    });
});

app.get("/course/:id", (req, res) => {
    data.getCourseById(req.params.id).then((data) => {
        res.render("course", { course: data });
    }).catch((err) => {
        res.render("course", { message: "no results" });
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize data and start server
data.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("app listening on: " + HTTP_PORT);
    });
}).catch((err) => {
    console.log("unable to start server: " + err);
});

module.exports = app **/
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Function to read JSON data
const readData = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Students route
app.get('/students', async (req, res) => {
  try {
    const students = await readData('./data/students.json');
    res.render('students', { students });
  } catch (err) {
    res.status(500).send('Error reading students data');
  }
});

// Student details route
app.get('/student/:studentNum', async (req, res) => {
  try {
    const students = await readData('./data/students.json');
    const student = students.find(s => s.studentNum == req.params.studentNum);
    if (student) {
      res.render('student', { student });
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    res.status(500).send('Error reading student data');
  }
});

// Update student route
app.post('/student/update', async (req, res) => {
  try {
    const students = await readData('./data/students.json');
    const studentIndex = students.findIndex(s => s.studentNum == req.body.studentNum);
    if (studentIndex !== -1) {
      students[studentIndex] = { ...students[studentIndex], ...req.body };
      fs.writeFile('./data/students.json', JSON.stringify(students, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error saving student data');
        } else {
          res.redirect(`/student/${req.body.studentNum}`);
        }
      });
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    res.status(500).send('Error updating student data');
  }
});

// Courses route
app.get('/courses', async (req, res) => {
  try {
    const courses = await readData('./data/courses.json');
    res.render('courses', { courses });
  } catch (err) {
    res.status(500).send('Error reading courses data');
  }
});

// Course details route
app.get('/course/:id', async (req, res) => {
  try {
    const courses = await readData('./data/courses.json');
    const course = courses.find(c => c.courseId == req.params.id);
    if (course) {
      res.render('course', { course });
    } else {
      res.status(404).send('Course not found');
    }
  } catch (err) {
    res.status(500).send('Error reading course data');
  }
});

// 404 route
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
