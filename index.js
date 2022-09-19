const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcrypt");
const con = require("./connection");
const body = require("body-parser");
const jwt = require("jsonwebtoken");

app.post("/", (req, res) => {
    res.status("connect");
});


// Register Api
app.post("/register-api", (req, res) => {
    con.query("SELECT * FROM `db`WHERE email=?", (req.body.email), (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            res.status(200).json({
                error: false,
                status: true,
                msg: " This Email Already Used "
            });
        }
        else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            con.query("INSERT INTO `db`(`username`, `phone`, `email`, `password`) VALUES (?,?,?,?)", [req.body.username, req.body.phone, req.body.email, hash], (err, result) => {
                if (err) {
                    throw err;
                }
                if (result) {
                    res.status(403).json({
                        error: false,
                        status: true,
                        msg: "Your Account Is Created"
                    });
                }
            });
        }
    });
});

// LogIn Api
app.post("login-api", (req, res) => {
    con.query("SELECT * FROM `db` WHERE email=?", (req.body.email), (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            const match = bcrypt.compareSync(req.body.password, result[0].password);
            if (match == true) {
                res.status(200).json({
                    error: false,
                    status: true,
                    msg: "Login Successfully"
                });
            }
            else {
                res.status(403).json({
                    error: false,
                    status: true,
                    msg: "Password Is Wrong"
                });
            }
        }
        else {
            res.status(403).json({
                error: false,
                status: true,
                msg: "Username And Password Is Wrong"
            });

        }
    });
});

//  Verify Token
function verifytoken(req, res) {
    if (!req.headers['authorozation']) {
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.salit(" ")
        const token = bearerToken[1]
        jwt.verify(token.process.env.ACCESS_TOKEN_SECRET, (err, result) => {
            if (err) {
                res.status(403);
            }
            res.status(200).send(result)
            next()
        })
    }
    else {
        res.status(403).send("token required");
    }

}



app.post("/login-Api", (req, res) => {
    con.query("SELECT * FROM `db` WHERE email = ?", [req.body.email], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const match = bcrypt.compareSync(req.body.password, result[0].password);
            if (match == true) {
                res.status(200).send(true);
            } else {
                res.status(404).send("Password Not match");
            }
        } else {
            res.send("Phone number is not exist");
        }
    })
})


// verify otp
app.post("/verify-otp", (req, res) => {
    con.query("SELECT * FROM `db` WHERE phone=?", (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            const match = bcrypt.compareSync(req.body.otp, result[0].otp);
            if (match == true) {
                res.status(200).json({
                    error: false,
                    status: true,
                    msg: "send-otp"
                });
            }
            else {
                res.status(403).json({
                    error: true,
                    status: false,
                    msg: "verify-otp"

                });
            }
        }
        else {
            res.status(403).json({
                error: true,
                status: false,
                msg: "username ans password is wrong"
            });
        }
    });
});

// file upload Api

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img');
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + "-" + Date.now() + path.extname(file.originalname));

    },

})
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            cb(new Error('only .png,.jpg and .jpeg,formate allwoed'));
        }
    }
}).single("file");

// middelware file uplading
app.post("/upload", (req, res) => {
    res.status("file upload");
});



app.listen(3000);