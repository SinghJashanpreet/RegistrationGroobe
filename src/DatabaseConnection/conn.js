const mongoose = require('mongoose');
const DbLink = `mongodb://localhost:27017/GroobeData`;
//For Local host tesing.
//mongodb+srv://2018919:9198102@cluster0.ahc3t9m.mongodb.net/apiData?retryWrites=true&w=majority

//To avoid depriciation error
mongoose.set('strictQuery', false);
mongoose.connect(DbLink, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
}).then(() => {
    console.log("Database Connection Established!");
}).catch((err) => {
    console.log(`No DataBase Connection! ${err}`);
});