const passport = require("passport");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const UserModel = require("../models/user.model");

const localStrategy = new LocalStrategy(async function (username, password, done) {
    if(!username || !password) {
        return done(null, false, { message: "Missing username or password" });
    }   

    try {
        const user = await UserModel.findOne({ username });
        if(!user) {
            return done(null, false, { message: "Username is not exist" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch) {
            return done(null, false, { message: "Password is incorrect" });
        }

        return done(null, user);

    } catch(err) {
        return done(err);
    }
});

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await UserModel.findById(id);
        return done(null, user);
    } catch(err) {
        return done(err);
    }
});



passport.use('local', localStrategy);

module.exports = passport;