const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://alhamdulillah026:alhamdulillah026@cluster0.xvjeezh.mongodb.net/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connection to DB");
}).catch((err)=>{
    console.log(err);
});


const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6583cfa510cdd561d6f0a60a",
    }));
    
    // details version of above code
    // Loop through each object in the `initData.data` array
    // for (let i = 0; i < initData.data.length; i++) {
    //     const obj = initData.data[i]; // Get the current object

    //     // Create a new object with properties of the current object and an additional `owner` property
    //     const updatedObj = {
    //         ...obj, // Copy properties from the original object
    //         owner: "6583cfa510cdd561d6f0a60a" // Add an `owner` property with the specified value
    //     };

    //     // Replace the original object with the updated object in the array
    //     initData.data[i] = updatedObj;
    // }



    await Listing.insertMany(initData.data);
    console.log("Data is initailized");
}

initDB();
