const passport = require("passport");
var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt

const db = require("../models")


passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret',
        // issuer: 'accounts.examplechat.com',
        // audience: 'examplechat.net'
    },
        function (jwt_payload, done) {
            // db.User.findOne({ id: jwt_payload.sub }, function (err, user) {
                db.User.findOne({where:{id:jwt_payload.id}})
                .then(user=>{
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            });
        }));

module.exports = passport