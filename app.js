const express = require('express');
const app = express();
//local hosting at 3000
const port = process.env.PORT || 3000;
//get understand if json data comes
app.use(express.json());

require("./src/DatabaseConnection/conn");

 const router = require("./src/Routers/dataRouters");
 app.use(router);

app.listen(port, () => {
    console.log(`App is Running at ${port}`);
})















// app.get("/index", (req, res) => {
//     res.render("index");
// });
// app.get("/secret", auth ,async (req, res) => {
//     //console.log(`THis is the token WEbsite have : ${req.cookies.jwtCookie}`)
//     res.render("secret",{
//         data: req.firstname
//     });
// });
// app.get("/logout", auth ,async (req, res) => {
//     try{
//         req.user.tokens = req.user.tokens.filter((elm)=>{
//             return elm.token != req.token;
//         })
//         res.clearCookie("jwtCookie");
       
//         //console.log(req.user);
//         await req.user.save();
//         res.render("login");
//     }
//     catch(e){
//         res.status(500).send(e);
//     }
// });
// app.get("/logoutAll", auth ,async (req, res) => {
//     try{
//         req.user.tokens = []
//         res.clearCookie("jwtCookie");
       
//         //console.log(req.user);
//         await req.user.save();
//         res.render("login");
//     }
//     catch(e){
//         res.status(500).send(e);
//     }
// });
// app.get("/", (req, res) => {
//     res.render("index");
// });
// app.get("/register", (req, res) => {
//     res.render("register");
// });
// app.get("/login", (req, res) => {
//     res.render("login");
// });









// app.post("/register", async (req, res) => {
//     try {
//         const password = req.body.Password;
//         const cpassword = req.body.CPassword;
//         if (password === cpassword) {
//             const registerUser = new Register({
//                 firstname: req.body.FirstName,
//                 lastname: req.body.LastName,
//                 username: req.body.Username,
//                 phone: req.body.Phone,
//                 password: req.body.Password,
//                 cpassword: req.body.CPassword,
//                 gender: req.body.gender
//             });

//             //for genrating tokens
//             const token = await registerUser.genrateToken();

//             //registering cookie with token as value
//             res.cookie("jwtCookie", token, {
//                 expires: new Date(Date.now() + 500000),
//                 httpOnly: true
//             });

//             //for uploading data
//             const uploadData = await registerUser.save();
//             res.status(201).render("index");
//         }
//         else {
//             res.send("Password Not Matching!");
//         }

//     } catch (e) {
//         res.status(400).send(e);
//     }
// });


// app.post("/login", async (req, res) => {
//     try {
//         const usernameEntered = req.body.Username;
//         const passwordEntered = req.body.Password;
//         const usernameDatabase = await Register.findOne({ username: usernameEntered });
//         if (!usernameDatabase) {
//             res.send("Invalid Login Credentials!");
//         }
//         // console.log(passwordEntered + " " + usernameDatabase.password);
//         const passwordCompare = await bcryptjs.compare(passwordEntered, usernameDatabase.password);

//         //Genrating token when someone login :
//         const token = await usernameDatabase.genrateToken();

//         if (passwordCompare) {
//             //generating cookie for login token
//             res.cookie("jwtCookie", token, {
//                 expires: new Date(Date.now() + 500000),
//                 //no one change delete cookie with C.S J.S
//                 httpOnly: true,
//                 //this ll let it run only for hhtps(secure)
//                 //secure:true
//             });
//             //console.log(cookie);
//             res.status(201).render("index");
//         }
//         else {
//             res.send("Password Not Matching!");
//         }


//     } catch (e) {
//         res.status(400).send(e);
//     }
// });




