const mongoose = require('mongoose');
const validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/*
Fields in Schema
*id,*name,*email,*phone,*address,image
*/
const dataSchema = mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Id is required!"]
    },
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: [true, "Email already exists!"],
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Enter a Valid Email!");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                var temp = parseInt(v);

                if (temp < 1111111111) {
                    throw new Error(`${v} is less than 10 digits!`);
                }
                else if (temp > 9999999999) {
                    throw new Error(`${v} is more than 10 digits!`);
                }

                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        unique: [true, "P.No already exists!"],

        required: [true, 'phone is required!']
    },
    address: {
        type: String,
        required: [true, 'Address is required!']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//for genrating tokens acts as a middleware
//as we use registerUser.genrateToken() in app.js that is why we iuse methods here
//as that is a instasnce of class and for instance methods is used
dataSchema.methods.genrateToken = async function () {
    try {
        const token = await jwt.sign({ id: this.id.toString() }, process.env.Secret_key, {
            expiresIn: 1000
        });
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (e) {
        console.log("error in genrating tokens " + e);
    }
}

//MiddleWare for password hashing
dataSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        //console.log(`password = ` + this.password);
        this.password = await bcrypt.hash(this.password, 10);
        //console.log(`passwordHash = ` + passwordHash);
        this.cpassword = await bcrypt.hash(this.password, 10);
    }
    next();
});


dataSchema.plugin(uniqueValidator, { message: 'Entered {PATH} already exists! : {VALUE} ' });

//Creating model for further document creation
const DataModel = new mongoose.model('Database', dataSchema);

module.exports = DataModel;