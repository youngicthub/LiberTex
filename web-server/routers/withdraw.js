const router = require("express").Router();
const auth = require("./auth");
const mysql = require("mysql");
const crypto = require("crypto");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.database_user,
  database: process.env.database_name,
  password: process.env.database_password,
});
console.log(process.env.database_name);
db.connect((error) => {
  if (error) {
    console.log(error);
  }
  console.log("SQL Connected");
});

// @deposite  / withdraw
router.get("/withdraw", auth, async (req, res) => {
  try {
    async function SQLQUERY(val) {
      return new Promise((resolve, reject) => {
        let sql = val;
        db.query(sql, (error, result) => {
          if (error) {
            console.log(error);
            return res.redirect("/login");
          }
          resolve(result);
        });
      });
    }

    let user = await SQLQUERY(
      `SELECT * FROM users WHERE _id='${req.user._id}'`
    );
    let transaction = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='withdraw' AND owner='${req.user._id}' ORDER BY id DESC`
    );

    res.render("dashboard/withdraw", {
      user: user[0],
      transaction,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error-page?error=" + error.message);
  }
});

// @ withdraw router
router.post("/withdraw", auth, async (req, res) => {
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

    if (parseInt(req.body.amount) > parseInt(user.balance)) {
      console.log("Insufficient balance");
      return res.redirect("/withdraw?status=insufficient-balance");
    }

    const _id = crypto.randomBytes(6).toString("hex");

    let transaction = {
      _id,
      owner: req.user._id,
      date: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
      email: user.email,
      amount: req.body.amount,
      method: req.body.method,
      wallet_account_number: req.body.wallet,
      type: "withdraw",
      status: "pending",
    };


    db.query("INSERT INTO transaction SET ?", transaction, (error) => {
      if (error) {
        return console.log(error);
      }
    });

    res.redirect("/withdraw?status=pending");

  } catch (error) {
    console.log(error);
    res.redirect("/error-page?error=" + error.message);
  }
});

module.exports = router;
