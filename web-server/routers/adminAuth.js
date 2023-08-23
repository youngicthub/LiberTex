const jwt = require('jsonwebtoken')
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.database_user,
    database: process.env.database_name,
    password: process.env.database_password
})




module.exports = async function (req, res, next) {
    try {
        const token = req.cookies.admin_token

        if (!token) {
            return res.redirect('/admin-login')
        }
        const verifyToken = await jwt.verify(token, 'thisfuckingsecretfuck')
        req.user = verifyToken

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


        const user = await findEmail(`SELECT * FROM admin WHERE _id='${req.user._id}'`)
        console.log(user)
        // console.log(req.headers.referer)
        if (req.headers.referer.includes('admin')) {
            if (user.length < 1) {
                return res.redirect('/admin-login')
            }
        }




        next()
    } catch (error) {
        console.log(error)
        res.redirect('/admin-login')
    }
}