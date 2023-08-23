const jwt = require('jsonwebtoken')
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.database_user,
    database: process.env.database_name,
    password: process.env.database_password
})

module.exports = async function auth(req, res, next) {
    const token = req.cookies.auth_token
    if (!token) {
        return res.redirect('/')
    }

    try {

        async function findEmail(val) {
            return new Promise((resolve, reject) => {
                let sql = val
                db.query(sql, (error, result) => {
                    if (error) {
                        console.logz(error)
                        return res.send(error)
                    }
                    resolve(result)
                })
            })
        }


        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifyToken;

        const user = await findEmail(`SELECT * FROM users WHERE _id='${req.user._id}'`)
        if(user.length < 1 && !req.headers.referer.includes('admin')) {
            return res.redirect('/login')
        }



        next()
    } catch (error) {
        console.log(error)
        res.redirect('/login')
    }
}