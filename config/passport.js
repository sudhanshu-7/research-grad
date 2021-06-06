const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const User = require('../models/user-model');
const UserLocal = require('../models/user-local-model');
const Profile = require('../models/profile-model');

dotenv.config({ path: './config/config.env' })

module.exports = function(passport) {
	passport.serializeUser((user, done) => {
		if(user.googleId !== undefined){
			console.log("google user")
		}
		else{
			console.log("local user");
		}
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
			if(user === null){
				UserLocal.findById(id, (err, user) => done(err, user))
			}
			else{
				done(err, user)
			}
		})
    })

    passport.use('google', new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        }, 
        async(accessToken, refreshToken, profile, done) => {
            console.log(profile);
            const newUser = new User ({
                googleId: profile.id,
                username: '',
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
            })

            try {
                let user = await User.findOne({ googleId: profile.id })
      
                if (user) {
                    console.log(`user already exists`);
                    done(null, user)
                } else {
                  newUser
                    .save()
                    .then(user => {
                        console.log(user)

                        const newProfile = new Profile({
                            googleId: user.googleId,
                            username: '',
                            age: '',
                            phone: '',
                            address: '',
                            qualification: '',
                            university: '',
                            about: '',
                            personalLife: '',
                            commendations: '',
                            website: '' 
                        })

                        newProfile
                            .save()
                            .then(profile => {
                                console.log(`new profile saved`)
                                done(null, user)
                            })
                    })
                }
            } 
            catch (err) {
                console.error(err)
            }
        }
    ))

    passport.use('local', new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
          // Match user
          UserLocal.findOne({
            username: username
          }).then(user => {
            if (!user) {
              return done(null, false, { message: 'That user is not registered' });
            }
    
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Password incorrect' });
              }
            });
          });
        })
      );

    
}