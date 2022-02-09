const router = require('express').Router()
const blogcontroller = require('../controller/blogsController');
const jwt = require('jsonwebtoken');
const jwtSecret = "abcdefghijklmnopqrstuvwxyz";
const express = require('express');

const multer = require('multer')
const path = require('path')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "./public/")))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, "E:/privateblogging/public/images");
        cb(null, "D:/Technical Training/Blog_App/blog-app-frontend/public/image");

    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
let upload = multer({
    storage: storage,
}).single('blogimage')


router.post("/addblog", upload, blogcontroller.addblog)
router.get('/getblog/:email', blogcontroller.usersblog)
router.get('/getallblog', blogcontroller.usersallblog)
router.post('/editblog/:id', blogcontroller.editblog)


function autenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (token == null) {
        res.json({ "err": "Token not match" })
    }
    else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json({ "err": "Token incorrect" })
            }
            else {
                res.json({ "msg": " Token Matched" })
                next();
            }
        })
    }
}

router.get('/loginfirst', autenticateToken, (req, res) => {
    res.json({ "msg": "Token correct " })

})


module.exports = router