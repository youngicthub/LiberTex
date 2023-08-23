const router = require("express").Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.database_user,
  database: process.env.database_name,
  password: process.env.database_password,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  }
  console.log("SQL Connected");
});

router.get("/two-factor-page", async (req, res) => {
  res.render("twoFactorAuth");
});

// CHeck is passwor is correct
router.post("/check-auth-password", async (req, res) => {
  try {
    async function SQLQUERY(val) {
      return new Promise((resolve, reject) => {
        let sql = val;
        db.query(sql, (error, result) => {
          if (error) {
            return res.redirect("/login");
          }
          resolve(result);
        });
      });
    }

    let user = await SQLQUERY(
      `SELECT * FROM users WHERE _id='${req.body._id}'`
    );
    user = user[0];
    console.log(user);
    console.log(req.body);
    if (!user) {
      res.send("No user found").s;
      return console.log("No user found");
    }

    if (req.body.password !== user.plane_password) {
      return res.sendStatus(401).json("password is not correct");
    }

    return res.status(200).json("Password matched");
  } catch (error) {
    console.log(error);
    res.send("Error occured. Please go back.", error);
  }
});

//Enable two factor auth
router.post("/enable-two-factor-auth", auth, async (req, res) => {
  try {
    async function SQLQUERY(val) {
      return new Promise((resolve, reject) => {
        let sql = val;
        db.query(sql, (error, result) => {
          if (error) {
            return res.redirect("/login");
          }
          resolve(result);
        });
      });
    }

    let user = await SQLQUERY(
      `SELECT * FROM users WHERE _id='${req.user._id}'`
    );
    user = user[0];
    if (!user) {
      res.send("No user found").s;
      return console.log("No user found");
    }

    // Compare password
    const verifyUser = await bcrypt.compare(req.body.code, user.password);
    if (!verifyUser) {
      return res.render("dashboard/profile", {
        error: "Password is incorrect",
      });
    }

    console.log("Password matched");
    let sql3 = `UPDATE users SET has_two_factor_auth='true' WHERE _id='${req.user._id}'`;
    db.query(sql3, (error) => {
      if (error) return console.log(error);
      console.log("Enabled two factor auth");
    });
    res.redirect("/profile");
  } catch (error) {
    res.send("Error occured", error);
  }
});

// Authenticate two factor after login
router.post("/authenticate-two-factor", async (req, res) => {
  try {
    async function SQLQUERY(val) {
      return new Promise((resolve, reject) => {
        let sql = val;
        db.query(sql, (error, result) => {
          if (error) {
            return res.redirect("/login");
          }
          resolve(result);
        });
      });
    }

    let user = await SQLQUERY(
      `SELECT * FROM users WHERE _id='${req.body._id}'`
    );
    user = user[0];
    console.log(user);
    console.log(req.body);
    if (!user) {
      res.send("No user found").s;
      return console.log("No user found");
    }

    console.log("1", req.body.code);
    console.log("2", user.two_factor_auth_code);

    if (req.body.code !== user.two_factor_auth_code) {
      return res.render("twoFactorAuth", {
        err: "Access was denied",
        _id: req.body._id,
      });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // Send cookie
    res.cookie("auth_token", token);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    res.send("Error occured. Please go back.");
  }
});

//Check is two factor auth is enabled
router.get("/check-two-factor", auth, async (req, res) => {
  try {
    async function SQLQUERY(val) {
      return new Promise((resolve, reject) => {
        let sql = val;
        db.query(sql, (error, result) => {
          if (error) {
            return res.redirect("/login");
          }
          resolve(result);
        });
      });
    }

    let user = await SQLQUERY(
      `SELECT * FROM users WHERE _id='${req.user._id}'`
    );
    user = user[0];

    res.status(200).json(user);
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

// Remobve two factor auth
router.post("/disable-two-factor-auth", auth, (req, res) => {
  try {
    let sql3 = `UPDATE users SET two_factor_auth_code='', has_two_factor_auth='false' WHERE _id='${req.user._id}'`;
    db.query(sql3, (error) => {
      if (error) return console.log(error);
      console.log("Disabled two factor auth");
    });
    res.status(200).send("success");
  } catch (error) {
    console.logo("Error occured", error);
    res.sendStatus(401);
  }
});

module.exports = router;
