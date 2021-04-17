const bcrypt = require('bcryptjs');
const passport = require('passport');


const User = require('../models/user-model');


createUser = (req, res) => {
    const { username, fName, lName, email, password, password_confirmation } = req.body;
    let errors = [];

    if(!req.body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a component' 
        });
    }


    if (!username || !fName || !password || !lName || !password_confirmation || !email) {
        errors.push({ msg: 'Please enter all fields' });
      }
    
    if (password != password_confirmation) {
        errors.push({ msg: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    
    if (errors.length > 0) {
        console.log(errors);
        res.render('signup', {
          errors,
          username,
          fName,
          lName,
          password
        });
    }
    else {
        User.findOne({ username: username }).then(user => {
          if (user) {
            errors.push({ msg: 'User already exists' });
            res.render('signup', {
                errors,
                username,
                fName,
                lName,
                email,
                password
            });
          } else {
            const newUser = new User({
              username,
              fName,
              lName,
              email,
              password
            });
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    console.log("User Registered");
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
    }
}



loginUser = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
}

module.exports = {createUser, loginUser};

