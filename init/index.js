const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = "mongodb+srv://sandip:Sandip%401206++@cluster0.2qgyl30.mongodb.net/";

main().then(() => {
    console.log("DB Connection Successfull");
}).catch(err => {
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map(obj => ({...obj,owner:'66942d38f782e54a280dbbcf'}));
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
}

initDB();