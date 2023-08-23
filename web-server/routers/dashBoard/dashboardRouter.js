const router = require('express').Router();
const adminAuth = require('../adminAuth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const mysql = require('mysql');
const crypto = require('crypto')

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.database_user,
    database: process.env.database_name,
    password: process.env.database_password
})


db.connect((error) => {
    if (error) {
        console.log(error)
    }
})


router.get('/dashboard', adminAuth, async (req, res) => {
    try {


        async function Post(val) {
            return new Promise((resolve, reject) => {
                let sql = val
                db.query(sql, (error, result) => {
                    if (error) {
                        return res.redirect('/login')
                    }
                    resolve(result)
                })
            })
        }

        const allUsers = await Post(`SELECT * FROM users`)
        const allposts = await Post(`SELECT * FROM posts`)
        const postPhotos = await Post(`SELECT * FROM posts WHERE postType='image'`)
        const postText = await Post(`SELECT * FROM posts WHERE postType='text'`)
        const postVideo = await Post(`SELECT * FROM posts WHERE postType='video'`)
        const comments = await Post(`SELECT * FROM comments`)
        const stories = await Post(`SELECT * FROM story`)
        const verifiedUsers = await Post(`SELECT * FROM users WHERE verified='fa fa-check-circle'`)



        res.render('dashboard/dashboard', {
            allUsers,
            verifiedUsers,
            verifiedUsersLength: verifiedUsers.length,
            userslength: allUsers.length,
            allpostslength: allposts.length,
            postPhotoslength: postPhotos.length,
            postTextLength: postText.length,
            postVideoLength: postVideo.length,
            comments: comments.length,
            stories: stories.length
        })
    } catch (error) {
        res.redirect('/error-page?error=' + error.message)
    }
})


// Create an account
router.get('/admin/login', (req, res) => {
    res.render('dashboard/login')
})

router.get('/admin/signup', (req, res) => {
    res.render('dashboard/register')
})




// ************************************************
// create admin user
router.post('/createAdminuser', async (req, res) => {


    const hashPassword = await bcrypt.hash(req.body.password, 10)

    try {

        let secret = 22122907
        let xKey = req.body.secretKey
        xKey = parseInt(xKey)

        if (xKey !== secret) {
            return res.render('dashboard/register', {
                err: 'Your interaction was blocked'
            })
        }

        const _id = crypto.randomBytes(12).toString('hex')
        const adminUser = {
            _id,
            ...req.body,
            password: hashPassword
        }
        delete adminUser.fullName
        let sql = 'INSERT INTO admin SET ?'
        db.query(sql, adminUser, (error) => {
            if (error) {
                return console.log(error)
            }
            console.log('Created a new admin')
        })
        res.redirect('/admin/login')

    } catch (error) {
        res.redirect('/error-page?error=' + error.message)
    }
})

// gabrieldelight08@gmail.com
router.post('/adminLogin', async (req, res) => {
    try {
        async function findEmail() {
            return new Promise((resolve, reject) => {
                let sql = `SELECT * FROM admin WHERE email='${req.body.email.toLowerCase()}'`
                db.query(sql, (error, result) => {
                    if (error) {
                        return res.render('dashboard/login', {
                            err: 'Account was not found '
                        })
                    }
                    resolve(result)
                })
            })
        }

        const email = await findEmail()
        let user = email[0]

        if (email.length == 0) {
            return res.render('dashboard/login', {
                err: 'Email could not be found',
                email: req.body.email
            })
        }


        const verifyUser = await bcrypt.compare(req.body.password, user.password);
        if (!verifyUser) {
            return res.render('dashboard/login', {
                err: 'Password is incorrect',
                email: req.body.email
            })
        }


        const token = await jwt.sign({ _id: user._id }, 'thisfuckingsecretfuck')
        res.cookie('admin_token', token)
        res.redirect('/dashboard')

    } catch (error) {
        res.redirect('/error-page?error=' + error.message)
    }
})


// logout router
router.get('/adminLogout', (req, res) => {
    res.clearCookie('admin_token').redirect('/admin/login')
})






router.post('/verifyUser', adminAuth, async (req, res) => {
    try {

        // verify a user    
        let sql = `UPDATE users SET verified='fa fa-check-circle' WHERE _id='${req.body.userId}'`
        db.query(sql, (error) => {
            if (error) {
                return console.log(error)
            }
        })


        let sql2 = `UPDATE posts SET verified='fa fa-check-circle' WHERE owner='${req.body.userId}'`
        db.query(sql2, (error) => {
            if (error) {
                return console.log(error)
            }
        })

        let sql3 = `UPDATE comments SET verified='fa fa-check-circle' WHERE owner='${req.body.userId}'`
        db.query(sql3, (error) => {
            if (error) {
                return console.log(error)
            }
        })

        let sql4 = `UPDATE replies SET verified='fa fa-check-circle' WHERE owner='${req.body.userId}'`
        db.query(sql4, (error) => {
            if (error) {
                return console.log(error)
            }
        })


        res.redirect('/dashboard')

    } catch (error) {
        res.redirect('/error-page?error=' + error.message)
    }
})


//Posts routers 
router.get('/postDashBoard', adminAuth, async (req, res) => {
    try {
        
  
    async function Post(val) {
        return new Promise((resolve, reject) => {
            let sql = val
            db.query(sql, (error, result) => {
                if (error) {
                    return res.redirect('/login')
                }
                resolve(result)
            })
        })
    }

    const allUsers = await Post(`SELECT * FROM users`)
    const allposts = await Post(`SELECT * FROM posts`)
    const postPhotos = await Post(`SELECT * FROM posts WHERE postType='image'`)
    const postText = await Post(`SELECT * FROM posts WHERE postType='text'`)
    const postVideo = await Post(`SELECT * FROM posts WHERE postType='video'`)
    const comments = await Post(`SELECT * FROM comments`)
    const stories = await Post(`SELECT * FROM story`)
    const verifiedUsers = await Post(`SELECT * FROM users WHERE verified='fa fa-check-circle'`)

    res.render('dashboard/dashboard_posts', {
        postText,
        postPhotos,
        postVideo,

    })
            
} catch (error) {
    res.redirect('/error-page?error=' + error.message)
}
})




module.exports = router
