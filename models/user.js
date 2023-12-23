const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    // username, password = we don't need to initialize it
});

// for auto salting and hashing... i can also do it by custom function...
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
