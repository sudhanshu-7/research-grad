const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/user-model');

dotenv.config({ path: './config/config.env' })

module.exports = function(passport) {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        }, 
        async(accessToken, refreshToken, profile, done) => {
            console.log(profile);
            const newUser = new User ({
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
            })

            try {
                let user = await User.findOne({ googleId: profile.id })
      
                if (user) {
                  done(null, user)
                } else {
                  newUser
                    .save()
                    .then(user => console.log(user))
                  done(null, user)
                }
            } 
            catch (err) {
                console.error(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}