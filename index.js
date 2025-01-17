const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  //validation logic
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found.");
  res.send(course);
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.put("/api/courses/:id", (req, res) => {
  //LOGIC IMPLIMENTED IN THIS REQUEST
  //look up the course
  //if not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found.");
  // Validate the course
  // if invalid, return 404
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  //Update the course
  //Return the updated course to client
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  //look up the course with the given id
  //If it doesnt exist then return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found.");

  //If found delete it
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //Return the same course
  res.send(course);
});
