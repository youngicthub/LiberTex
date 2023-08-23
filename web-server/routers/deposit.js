const router = require("express").Router();
const auth = require("./auth");
const multer = require("multer");
const path = require("path");
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

// @deposite  / withdraw
router.get("/deposit", auth, async (req, res) => {
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
            `SELECT * FROM transaction WHERE type='deposit' AND owner='${req.user._id}' ORDER BY id DESC`
        );




        user = user[0];
        res.render("dashboard/deposit", {
            user,
            transaction,
        });
    } catch (error) {
        res.redirect("/error-page?error=" + error.message);
    }
});


// @deposite  / make payment
router.get("/payment", auth, async (req, res) => {
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
            `SELECT * FROM transaction WHERE _id='${req.query._id}'`
        );

        console.log(transaction)


        user = user[0];
        res.render("dashboard/makepayment", {
            user,
            transaction: transaction[0]
        });
    } catch (error) {
        res.redirect("/error-page?error=" + error.message);
    }
});

router.post("/create-pending-deposit", auth, async (req, res) => {
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
        user = user[0];

        console.log(user);
        console.log("Hello world");

        const _id = crypto.randomBytes(6).toString("hex");

        let transaction = {
            _id,
            owner: req.user._id,
            date: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
            email: user.email,
            amount: req.body.amount,
            method: req.body.method,
            type: "deposit",
            status: "pending",
            image: null,
        };

        console.log(transaction);

        db.query("INSERT INTO transaction SET ?", transaction, (error) => {
            if (error) {
                return console.log(error);
            }
        });

        res.redirect("/deposit?status=created")
    } catch (error) {
        console.log(error);
    }
});

// UPDATE Image and Staus to  Await approval
router.post(
    "/upload-receipt/:_id",
    upload.single("upload"),
    auth,
    async (req, res) => {
        try {
            console.log(req.file.filename)

            let sql2 = `UPDATE transaction SET status='unconfirmed', image='${req.file.filename}' WHERE _id='${req.params._id}'`;
            db.query(sql2, (error) => {
                if (error) {
                    return console.log(error);
                }
            });

            res.redirect(`/payment?_id=${req.params._id}&&status=receipt-submited`)
            
        } catch (error) {
            console.log(error)
            res.send("An error occured please try again later");
        }
    }
);


module.exports = router;
