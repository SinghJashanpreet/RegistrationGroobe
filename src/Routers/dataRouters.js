require('dotenv').config();

const express = require('express');
const path = require('path');
const router = new express.Router();
const app = express();

app.use(express.static('public'));
app.use(express.json());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//const DataModel = require("../Models/registerModel");
const Register = require("../Models/registerModel");

const multer = require("multer");
const { send } = require('process');

//For Generating an ID
const uuid = require("uuid").v4;


//for error formatting
const errorFormatter = e => {
    var errObj = {};
    //for refining output
    var allE = e.substring(e.indexOf(':') + 1).trim().replace(/\n/g, "").replace(/{/g, "").replace(/}/g, "").replace("  ", "");

    var allEArry = allE.split(',').map(er => er.trim());
    allEArry.forEach(err => {
        const [key, value] = err.split(':').map(er => er.trim());
        errObj[key] = value;
    });
    return errObj;
}


//Giving image file new name and destinaion
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const uniqueName = new Date().getHours() + '-' + new Date().getMinutes() + '-' + new Date().getSeconds();
        cb(null, file.fieldname + '-' + uniqueName + '.jpg')
    }
});

const upload = multer({ storage: storage });

const middleware = (req, res, next) => {
    next();
}

const bcryptjs = require('bcryptjs');


var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

//Will store all data about image: newname, destination etc


const port = process.env.PORT || 8000;


const cookieParser = require('cookie-parser');
const auth = require('../Middleware/auth');
const jwt = require("jsonwebtoken");

//as we want to use cookie-parser as a middle ware
app.use(cookieParser());











//uploading data via post method
router.post("/register", upload.none(), middleware, async (req, res) => {
    try {
        const imgName = req.file;
        const password = req.body.Password;
        const cpassword = req.body.CPassword;
        if (password === cpassword) {
            if (!imgName) {
                const user = new Register({
                    _id: uuid(),
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    password: req.body.Password,
                    cpassword: req.body.CPassword
                });

                //for genrating tokens
                const token = await user.genrateToken();

                //registering cookie with token as value
                res.cookie("jwtCookie", token, {
                    expires: new Date(Date.now() + 500000),
                    // httpOnly: true
                });



                const sendData = await user.save();

                res.status(201).json({
                    staus: true,
                    message: "Register Successfully! "
                    // Data: errorFormatter(`: ${sendData}`)
                });
            }
            else {
            }
        }


        else {
            res.send("Password Not Matching!");
        }

    } catch (e) {
        //console.log(e);
        res.status(404).send({
            staus: false,
            message: errorFormatter(e.message)
        });
    }
});





//Login
router.post('/login', upload.none(), middleware, async (req, res) => {
    //const { Email, Password } = req.body;
    const Email = req.body.email;
    const Password = req.body.Password;
    // Check if user exists and password matches
    const user = await Register.findOne({ email: Email });
    if (user) {
        const passwordCompare = await bcryptjs.compare(Password, user.password);

        // Generate JWT token with user id and secret key
        const token = await user.genrateToken();

        if (passwordCompare) {
            //generating cookie for login token

            res.cookie("jwtCookie", token, {
                expires: new Date(Date.now() + 1000),
            });
            // Return token as response
            res.status(201).json({
                staus: true,
                message: "login Successfully! ",
                Token: token
                // Data: errorFormatter(`: ${sendData}`)
            });

        }
        else {
            res.status(401).json({
                status: false,
                error: 'Password Not Matching!'
            });
        }
    } else {
        res.status(401).json({
            status: false,
            error: 'Invalid credentials'
        });
    }
});



// Protected req a valid token
router.get('/protected', upload.none(), async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Enter a token' });
    }

    const token = req.headers.authorization.split(' ')[1];


    try {
        // Verify token with secret key
        const decoded = jwt.verify(token, process.env.Secret_key);
        const id = decoded.id;

        // Find user by id
        const user = await Register.findOne({ _id: decoded.id });
        if (user) {
            res.status(201).json({
                staus: true,
                message: `Welcome, ${user.name}!`
            });
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});



router.post('/update', upload.none(), middleware, async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Enter a token' });
    }

    const token = req.headers.authorization.split(' ')[1];

    const decode = JSON.parse(atob(token.split('.')[1]));
    console.log(decode);
    if (decode.exp * 1000 < new Date().getTime()) {
        res.status(400).send({
            staus: false,
            message: "Enter a valid Token"
        });
        console.log('Token Expired');
    }

    try {
        const decoded = jwt.verify(token, process.env.Secret_key);
        const id = decoded.id;
        if (!id) {
            res.status(400).send({
                staus: false,
                message: "Enter a valid Token"
            });
        }
        const idData = await Register.findById(id);
        if (id) {
            if (idData) {
                if (req.body.address || req.body.phone || req.body.email || req.body.name || req.body.password || req.body.cpassword) {
                    const updateData = await Register.findByIdAndUpdate(id, { $set: { address: req.body.address, phone: req.body.phone, email: req.body.email, name: req.body.name, password: req.body.Password, cpassword: req.body.CPassword } }, {
                        new: true
                    });

                    res.status(201).send({
                        staus: true,
                        message: "Data is Updated"
                        // Data: errorFormatter(`: ${updateData}`)
                    });
                }
                else {
                    res.status(400).send({
                        staus: false,
                        message: errorFormatter(`: Enter Valid Input field to be Updated for id : ${id}`)
                    });
                }
            } else {
                res.status(400).send({
                    staus: false,
                    message: errorFormatter(`: 
                 No matching Found in Database for id : ${id}`)
                });
            }
        }
        else {
            res.status(400).send({
                staus: false,
                message: errorFormatter(` : Enter Valid Token to be Updated! : `)
            });
            return;
        }
    } catch (e) {
        res.status(400).send({
            staus: false,
            message: errorFormatter(e.message)
        });
    }
});



module.exports = router;