const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminAuth = require("./adminAuth");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const os = require("os");

const db = mysql.createConnection({
  host: "localhost",
  user: process.env.database_user,
  database: process.env.database_name,
  password: process.env.database_password,
});

// Bitcoin 1LoofSzsnnbf2vMzuQ1Y­dNj7AcXm8W3uKL
// Theruem 0xF1255128Bd78a2c45A­B82D8129a4E0D41d043F­4c

db.connect((error) => {
  if (error) {
    console.log(error);
  }
  console.log("SQL Connected");
});

// @ set up validation for image upload
const storage = multer.diskStorage({
  destination: "./web-server/web-folder/public/webStorage/avatar",
  filename: function (req, file, cb) {
    cb(null, "plogapp" + "-" + Date.now() + path.extname(file.originalname));
  },
});

router.get("/admin-signup", (req, res) => {
  res.render("admin/signup");
});

router.post("/admin_signup", async (req, res) => {
  try {
    if (req.body.secret != "76474563895989362589") {
      return res.render("admin/signup", {
        err: "Access denied you are not allowed to use this page",
        email: req.body.email,
      });
      return;
    }
    const _id = crypto.randomBytes(12).toString("hex");
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    let data = {
      _id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      name: req.body.username,
      country: req.body.country,
      password: hashPassword,
    };

    let sql = "INSERT INTO admin SET ?";

    db.query(sql, data, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("Created a new User");
    });

    // Send token to header
    const token = await jwt.sign({ _id: data._id }, "thisfuckingsecretfuck");
    // Send cookie
    res.cookie("admin_token", token);
    res.redirect("/users");
  } catch (error) {
    console.log(error);
  }
});

router.get("/admin-login", (req, res) => {
  res.render("admin/login");
});

router.post("/admin-login", async (req, res) => {
  async function findEmail(val) {
    return new Promise((resolve, reject) => {
      let sql = val;
      db.query(sql, (error, result) => {
        if (error) {
          console.logz(error);
          return res.send(error);
        }
        resolve(result);
      });
    });
  }

  const email = await findEmail(
    `SELECT * FROM admin WHERE email='${req.body.email}'`
  );
  let user = email[0];

  // @ id no user found
  if (email.length == 0) {
    return res.render("admin/login", {
      err: "Email could not be found",
      email: req.body.email,
    });
  }

  

  // Compare password
  const verifyUser = await bcrypt.compare(req.body.password, user.password);
  if (!verifyUser) {
    return res.render("admin/login", {
      err: "Password is incorrect",
      email: req.body.email,
    });
  }

  // Send token to header
  const token = await jwt.sign({ _id: user._id }, "thisfuckingsecretfuck");
  // Send cookie
  res.cookie("admin_token", token);
  res.redirect("/users");
});

// Admin section
router.get("/admin", adminAuth, async (req, res) => {
  async function SQLQUERY(val) {
    return new Promise((resolve, reject) => {
      let sql = val;
      db.query(sql, (error, result) => {
        if (error) {
          console.log(error);
          // return res.redirect('/login')
        }
        resolve(result);
      });
    });
  }

  let transaction = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='deposit'  ORDER BY id DESC`
  );

  let pendingDeposite = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='deposit' AND status='pending'  ORDER BY id DESC`
  );
  let successDeposite = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='deposit' AND status='success'  ORDER BY id DESC`
  );

  let pendingWithdraw = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='withdraw' AND status='pending'  ORDER BY id DESC`
  );
  let successWithdraw = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='withdraw' AND status='success'  ORDER BY id DESC`
  );

  let users = await SQLQUERY(`SELECT * FROM users`);
  res.render("admin/deposite-pannel", {
    transaction,
    users,
    pendingDeposite,
    successDeposite,
    pendingWithdraw,
    successWithdraw,
  });
});

router.get("/admin-withdrawal", adminAuth, async (req, res) => {
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

  let users = await SQLQUERY(`SELECT * FROM users`);

  let transaction = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='withdraw'  ORDER BY id DESC`
  );
  let pendingDeposite = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='deposit' AND status='pending'  ORDER BY id DESC`
  );
  let successDeposite = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='deposit' AND status='success'  ORDER BY id DESC`
  );

  let pendingWithdraw = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='withdraw' AND status='pending'  ORDER BY id DESC`
  );
  let successWithdraw = await SQLQUERY(
    `SELECT * FROM transaction WHERE type='withdraw' AND status='success'  ORDER BY id DESC`
  );
  res.render("admin/withdrawal-pannel", {
    users,
    transaction,
    pendingDeposite,
    successDeposite,
    pendingWithdraw,
    successWithdraw,
  });
});

router.get(
  "/approve-page/:userId/:transactionId",
  adminAuth,
  async (req, res) => {
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

    let users = await SQLQUERY(`SELECT * FROM users`);

    let transaction = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='withdraw' ORDER BY id DESC`
    );
    let pendingDeposite = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='deposit' AND status='pending'  ORDER BY id DESC`
    );
    let successDeposite = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='deposit' AND status='success'  ORDER BY id DESC`
    );

    let pendingWithdraw = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='withdraw' AND status='pending'  ORDER BY id DESC`
    );
    let successWithdraw = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='withdraw' AND status='success'  ORDER BY id DESC`
    );

    let client = await SQLQUERY(
      `SELECT * FROM users WHERE _id='${req.params.userId}'`
    );
    let clientTransaction = await SQLQUERY(
      `SELECT * FROM transaction WHERE _id='${req.params.transactionId}'`
    );
    client = client[0];
    clientTransaction = clientTransaction[0];
    res.render("admin/approve", {
      users,
      client,
      transaction,
      clientTransaction,
      pendingDeposite,
      successDeposite,
      pendingWithdraw,
      successWithdraw,
    });
  }
);

// Post request to approve a post
router.post("/approveRequest",async (req, res) => {
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


      let transaction = await SQLQUERY(
        `SELECT * FROM transaction WHERE _id='${req.body.transactionId}'`
      );



    


    let sql = `UPDATE users SET balance='${req.body.balance}', profit='${req.body.profit}', bonus='${req.body.bonus}'  WHERE _id='${req.body.clientId}'`;
    db.query(sql, (error) => {
      if (error) {
        return console.log(error);
      }
    });

    let sql2 = `UPDATE transaction SET status='success'  WHERE _id='${req.body.transactionId}'`;
    db.query(sql2, (error) => {
      if (error) {
        return console.log(error);
      }
    });
    res.redirect(transaction[0].type === "deposit"?"/admin":  "/admin-withdrawal");
  } catch (error) {
    console.log(error)
    res.redirect("/error-page");
  }
});

// Reject withdrawal
// Post request to approve a post
router.get("/cancel-withdraw", (req, res) => {
  try {
    let sql2 = `UPDATE transaction SET status='rejected'  WHERE _id='${req.query.transactionId}'`;
    db.query(sql2, (error) => {
      if (error) {
        return console.log(error);
      }
    });
    res.redirect("/admin-withdrawal");
  } catch (error) {
    res.redirect("/error-page");
  }
});

router.get("/users", adminAuth, async (req, res) => {
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

    let users = await SQLQUERY(`SELECT * FROM users ORDER BY id DESC`);
    user = users[0];

    let transaction = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='withdraw'  ORDER BY id DESC`
    );
    let pendingDeposite = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='deposit' AND status='pending'  ORDER BY id DESC`
    );
    let successDeposite = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='deposit' AND status='success'  ORDER BY id DESC`
    );

    let pendingWithdraw = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='withdraw' AND status='pending'  ORDER BY id DESC`
    );
    let successWithdraw = await SQLQUERY(
      `SELECT * FROM transaction WHERE type='withdraw' AND status='success'  ORDER BY id DESC`
    );

    let client = await SQLQUERY(
      `SELECT * FROM users WHERE _id='${req.params.userId}'`
    );
    let clientTransaction = await SQLQUERY(
      `SELECT * FROM transaction WHERE _id='${req.params.transactionId}'`
    );
    client = client[0];
    clientTransaction = clientTransaction[0];
    res.render("admin/users", {
      user,
      users,
      users,
      client,
      transaction,
      clientTransaction,
      pendingDeposite,
      successDeposite,
      pendingWithdraw,
      successWithdraw,
    });
  } catch (error) {
    res.redirect("/error-page");
  }
});

router.post("/admin-update-user", (req, res) => {
  try {
    let sql = `UPDATE users SET balance='${req.body.balance}', profit='${req.body.profit}', bonus='${req.body.bonus}'  WHERE _id='${req.body._id}'`;
    db.query(sql, (error) => {
      if (error) {
        return console.log(error);
      }
    });
    res.redirect("/users?status=updated");
  } catch (error) {
    console.log(error)
    res.redirect("/error-page");
  }
});

// Admin connected walles
router.get("/admin-connected-wallet", adminAuth, async (req, res) => {
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

  let connected_wallet = await SQLQUERY(
    `SELECT * FROM wallet_connect ORDER BY id DESC`
  );

  res.render("admin/admin-connect_wallet.hbs", {
    connected_wallet,
  });
});

router.get("/clearWalletConnect", adminAuth, async (req, res) => {
  try {
    let sql = "DELETE FROM wallet_connect";

    db.query(sql, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("Deleted everything");
    });
    res.redirect("/admin-connected-wallet");
  } catch (error) {
    res.send(error.message);
  }
});

// Deleteing account
router.get("/delete-account/:id", adminAuth, async (req, res) => {
  try {
    let sql = `DELETE FROM users WHERE _id='${req.params.id}'`;

    db.query(sql, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("Deleted everything");
    });
    res.redirect("/users");
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/admin-logout", (req, res) => {
  res.clearCookie("admin_token").redirect("/admin-login");
});

module.exports = router;
