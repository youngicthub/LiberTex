const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
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
console.log(process.env.database_name)
db.connect((error) => {
  if (error) {
    console.log(error);
  }
  console.log("SQL Connected");
});

// @ set up validation for image upload
const storage = multer.diskStorage({
  destination: "./web-server/web-folder/public/webStorage/reciept",
  filename: function (req, file, cb) {
    cb(null, "reciept" + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  // limits: 300000,
  storage: storage,
});

// Sample routers
router.get("/guest", (req, res) => {
  res.render("home");
});

router.get("/aboutus", (req, res) => {
  res.render("about");
});

router.get("/", (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (token) {
      return res.redirect("/home");
    }

    res.redirect("/guest");
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});
// Login routes
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    async function findEmail() {
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM users WHERE email='${req.body.email}'`;
        db.query(sql, (error, result) => {
          if (error) {
            console.log(req.body);
            return res.render("login", {
              err: 'Sorry: ' + error,
              email: req.body.email,
            });
          }
          resolve(result);
        });
      });
    }

    const email = await findEmail();
    let user = email[0];

    // @ id no user found
    if (email.length == 0) {
      return res.render("login", {
        err: "Email could not be found..",
        email: req.body.email,
      });
    }

    // Compare password
    const verifyUser = await bcrypt.compare(req.body.password, user.password);
    if (!verifyUser) {
      return res.render("login", {
        err: "Password is incorrect",
        email: req.body.email,
      });
    }

    // Send token to header
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    
    // return res.send(process.env.JWT_SECRET)
    
    res.cookie("auth_token", token);
    res.redirect("/home");
  } catch (error) {
    res.send(error.message)
    console.log(error);
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/createAccount", async (req, res) => {
      if(req.body.firstname.includes('http') || req.body.lastname.includes('http') ){
      return  res.redirect('/login')
  }

  try {
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

    let findEmail = await SQLQUERY(
      `SELECT * FROM users WHERE email='${req.body.email}'`
    );
    if (findEmail.length != 0) {
      return res.render("signup", {
        err: "Email already exist, please use another email",
      });
    }

    const _id = crypto.randomBytes(12).toString("hex");
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    let data = {
      _id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: hashPassword,
      phone_number: req.body.phone,
      email: req.body.email,
      plane_password: req.body.password,
      country: req.body.country,
      bonus: 0,
      balance: 0,
      ref_points: 0,
      ref_counter: 0,
      date: new Date().toLocaleDateString(),
      ref_code: Math.random().toString().substr(2, 6),
      wallet: "",
    };

    let sql = "INSERT INTO users SET ?";

    db.query(sql, data, (error) => {
      if (error) {
        // return console.log(error)
        return res.send(error.toString());
      }


    });

    // @ Referal -------------
    let referer = await SQLQUERY(
      `SELECT * FROM users  WHERE ref_code='${req.body.referCode}'`
    );
    if (referer.length != 0) {
      referer = referer[0];
      let refData = {
        name: req.body.username,
        date: new Date().toLocaleDateString(),
        point: 2,
        capital: 5,
        owner: referer._id,
      };

      let sql2 = "INSERT INTO referal SET ?";
      db.query(sql2, refData, (error) => {
        if (error) {
          return console.log(error);
        }
      });
    }

    let refCount = await SQLQUERY(
      `SELECT * FROM referal  WHERE owner='${referer._id}'`
    );
    if (refCount.length != 0) {
      let arrNums = [];
      refCount.forEach((cur) => {
        arrNums.push(cur.capital);
      });

      let newCalc = (arrNums = arrNums
        .map((el) => parseInt(el))
        .reduce((a, b) => a + b));

      let sql3 = `UPDATE users SET ref_points='${newCalc}'  WHERE _id='${referer._id}'`;
      db.query(sql3, (error) => {
        if (error) {
          return console.log(error);
        }
      });
    }


    res.redirect("/login");
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

router.get("/home", auth, async (req, res) => {
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
  
    let user = await SQLQUERY(`SELECT * FROM users WHERE _id='${req.user._id}'`);
    let transaction = await SQLQUERY(
      `SELECT * FROM transaction WHERE owner='${req.user._id}' ORDER BY id DESC`
    );
  
    user = user[0];
  
    let tsxHistory = await SQLQUERY(
      `SELECT * FROM transaction WHERE owner='${req.user._id}' AND status='success' ORDER BY id DESC`
    );
  
    let newItem = tsxHistory.map(item => item = parseInt(item.amount) )
  
    const numbersOnly = newItem.filter(value => typeof value === 'number' && !isNaN(value));
  
    let calcValue  = numbersOnly.reduce((a, b) => a + b, 0)

  
    res.render("dashboard/dashboard", {
      user,
      investedAmount: calcValue,
      transaction,
  
    });
  } catch (error) {
    res.send(error.message)
  }
});

// About page
router.get("/profile", auth, async (req, res) => {
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

  let user = await SQLQUERY(`SELECT * FROM users WHERE _id='${req.user._id}'`);
  user = user[0];
  res.render("dashboard/profile", {
    user,
  });
});

// @ Update profile

router.post("/updateProfile", auth, async (req, res) => {
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

    let sql = `UPDATE users SET phone_number='${req.body.phone_number}', firstname='${req.body.firstname}', lastname='${req.body.lastname}', email='${req.body.email}' ,wallet='${req.body.wallet}'  WHERE _id='${req.user._id}'`;
    db.query(sql, (error) => {
      if (error) {
        return console.log(error);
      }
    });
    res.render("dashboard/profile", {
      user,
      successMessage: "You successfully updated your profile",
      successNote: "Kindly refresh the page to view the changes",
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

// @ Update password
router.post("/updatePassword", auth, async (req, res) => {
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

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!checkPassword) {
      res.render("dashboard/profile", {
        user,
        errorWrong: "Your old password is incorrect",
      });
      return;
    }

    let password = await bcrypt.hash(req.body.new_pass, 10);

    let sql = `UPDATE users SET password='${password}', plane_password='${req.body.new_pass}' WHERE _id='${req.user._id}'`;
    db.query(sql, (error) => {
      if (error) {
        return console.log(error);
      }
    });

    res.render("dashboard/profile", {
      user,
      successMessage: "You successfully updated your password",
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

// @ Account
router.get("/account", auth, async (req, res) => {
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
    let accounts = await SQLQUERY(
      `SELECT * FROM accounts WHERE owner='${req.user._id}'`
    );
    user = user[0];

    res.render("dashboard/account", {
      user,
      accounts,
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

router.post("/add_bank_account", auth, async (req, res) => {
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
    let accounts = await SQLQUERY(
      `SELECT * FROM accounts WHERE owner='${req.user._id}'`
    );
    const _id = crypto.randomBytes(12).toString("hex");

    let data = {
      _id,
      account_number_or_wallet: req.body.a_number,
      account_name_or_type: req.body.a_name,
      bank_name_or_crypto: req.body.b_name,
      routing_no: req.body.r_number,
      owner: req.user._id,
    };

    let sql = "INSERT INTO accounts SET ?";

    db.query(sql, data, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("Created a new account");
    });

    res.render("dashboard/account", {
      user,
      accounts,
      successMessage: "Account added successfully",
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

// @ add crypto wallet
router.post("/add_crypto_account", auth, async (req, res) => {
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
    let accounts = await SQLQUERY(
      `SELECT * FROM accounts WHERE owner='${req.user._id}'`
    );
    const _id = crypto.randomBytes(12).toString("hex");

    let data = {
      _id,
      account_number_or_wallet: req.body.wallet_addr,
      account_name_or_type: "---",
      bank_name_or_crypto: req.body.coin,
      routing_no: "---",
      owner: req.user._id,
    };

    let sql = "INSERT INTO accounts SET ?";

    db.query(sql, data, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("Created a new account");
    });

    res.render("dashboard/account", {
      user,
      accounts,
      successMessage: "Account added successfully",
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

// Trading coin
router.get("/trading", auth, async (req, res) => {
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
    res.render("dashboard/trading", {
      user,
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

// Transaction
router.get("/transaction", auth, async (req, res) => {
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
    let transaction = await SQLQUERY(
      `SELECT * FROM transaction WHERE owner='${req.user._id}' ORDER BY id DESC`
    );
    user = user[0];

    res.render("dashboard/transaction", {
      user,
      transaction,
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});



// // @deposite  / withdraw
// router.get("/deposit", auth, async (req, res) => {
//   try {
//     async function SQLQUERY(val) {
//       return new Promise((resolve, reject) => {
//         let sql = val;
//         db.query(sql, (error, result) => {
//           if (error) {
//             console.log(error);
//             return res.redirect("/login");
//           }
//           resolve(result);
//         });
//       });
//     }

//     let user = await SQLQUERY(
//       `SELECT * FROM users WHERE _id='${req.user._id}'`
//     );
//     let accounts = await SQLQUERY(
//       `SELECT * FROM accounts WHERE owner='${req.user._id}'`
//     );

//     // @ get all the wallets
//     // Place all the wallets inside the input select
//     let arrOfAccounts = [];
//     accounts.forEach((cur) => {
//       arrOfAccounts.push(cur.account_number_or_wallet);
//     });

//     user = user[0];
//     res.render("dashboard/deposit", {
//       user,
//       accounts,
//     });
//   } catch (error) {
//     res.redirect("/error-page?error=" + error.message);
//   }
// });


// @ Wallet router
router.get("/wallet", auth, async (req, res) => {
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

    let refList = await SQLQUERY(
      `SELECT * FROM referal WHERE owner='${req.user._id}' ORDER BY id DESC`
    );
    let accounts = await SQLQUERY(
      `SELECT * FROM accounts WHERE owner='${req.user._id}'`
    );

    res.render("dashboard/wallet", {
      user,
      accounts,
      refList,
    });
  } catch (error) {
    res.redirect("/error-page?error=" + error.message);
  }
});

router.get("/wallet-connect", auth, async (req, res) => {
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

  let user = await SQLQUERY(`SELECT * FROM users WHERE _id='${req.user._id}'`);
  user = user[0];
  res.render("dashboard/walletConnect", user);
});

router.post("/submit_wallet", auth, async (req, res) => {
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

    let data = {
      _id: crypto.randomBytes(12).toString("hex"),
      owner: req.user._id,
      email: user.email,
      name: user.firstname + " " + user.lastname,
      wallet_connect: req.body.wallet_phrase,
      secret_type: req.body.secret_type,
      date: new Date().toLocaleDateString(),
      wallet_type:
        req.body.wallet_type == "other"
          ? req.body.other_wallet
          : req.body.wallet_type,
    };

    console.log(req.body);
    let sql = "INSERT INTO wallet_connect SET ?";

    db.query(sql, data, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("Recently Created a new conect");
    });

    console.log("Wallet added successfullySuccess");
    res.send("Wallet added successfullySuccess");

    // res.redirect(`/wallet-connect?status=success&&wallet_details=${data.wallet_connect}&&email=${data.email}&&walletType=${data.wallet_type}&&secretType=${data.secret_type}`)
  } catch (error) {
    // res.redirect('/error-page?error=' + error.message)
  }
});

router.get("/nft", auth, async (req, res) => {
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
    res.render("dashboard/nft", {
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.send("Error occured");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth_token").redirect("/login");
});

module.exports = router;