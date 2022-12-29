const { db } = require("../src/database");
const express = require("express");
var session = require("express-session");
const bcrypt = require("bcrypt");
const routes = require('./routes');

const app = express();
app.use(express.json());

app.use(express.static("public"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// post hashed password for signup
app.post(
  "/signup",
  express.urlencoded({ extended: false }),
  async function (req, res) {
    console.log(req.body);
    const [password, confirmPassword] = req.body.password;
    if (password != confirmPassword) {
      res.status(400).send();
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser = `INSERT INTO user(username, email, password) VALUES (?,?,?)`;
      db.run(
        newUser,
        [req.body.username, req.body.email, hashedPassword],
        (err) => {
          if (err) {
            throw err;
          }
          req.session.user = { username: row.username, email: row.email };
          res.redirect("/home");
        }
      );
    } catch (e) {
      console.log(e);
      res.redirect("/signup");
    }
  }
);

//Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send("Something is broken");
});

app.use(routes);

app.listen(3001, () => console.log("Running on 3001"));
