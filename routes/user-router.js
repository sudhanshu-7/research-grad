const bcrypt = require('bcryptjs');
const passport = require('passport');


const User = require('../models/user-model');
const Profile = require('../models/profile-model');
const Blog = require('../models/blog-model');


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
                    
                    const newUserProfile = new Profile({
                      username: user.username,
                      age: '',
                      phone: '',
                      address: '',
                      qualification: '',
                      university: '',
                      about: '',
                      personalLife: '',
                      commendations: '',
                      website: ''
                    });

                    newUserProfile
                      .save()
                      .then(userProfile => {
                          req.flash(
                            'success_msg',
                            'You are now registered and can log in'
                          );
                          res.redirect('/login');
                      })
                      .catch(err => console.log(err));
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
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
}

profile = (req, res) => {
  
  Profile.findOne({googleId: req.user.googleId})
    .then(userProfile => {
      if(userProfile === null){
        res.json(404, {'message': 'profile not exists'})
      }
      
      res.render("profile", {
        user: req.user,
        profile: userProfile
      });
    })
    .catch(err => {console.log(err);});
  
}

editProfile = (req, res) => {

  const newProfile = req.body;

  Profile.updateOne(
    {googleId: req.user.googleId},
    newProfile,
    (err) =>{
      if(err)
        console.log(err);
      else{
        res.redirect("/profile");
      }
    }
  )
    .catch(err => {console.log(err);});

}

postBlog = (req, res) => {
  
  const title = req.body.title;
  let titleWithoutSpaces = '';

  Array.from(title).forEach(e => {
    if(e !== ' '){
      titleWithoutSpaces = titleWithoutSpaces.concat(e);
    }
  })

  const newBlog = new Blog({identifier: titleWithoutSpaces, googleId: req.user.googleId, ...req.body});


  newBlog
    .save()
    .then(blog => {
      console.log("blog posted");
      res.redirect("/blog");
    })
} 

blog = (req, res) => {
  Blog.find({googleId: req.user.googleId}, (err, found) => {
    if(err)
      console.log(err);
    
    res.render("blog", {blogs: found});
  });
}
 

editBlog = (req, res) => {

  Blog.updateOne({_id: req.params.id}, 
    {content: req.body.content}, 
    (err) => {
      if(err){
        console.log(err);
      }
      res.redirect("/blog");
    }  
  )
}

module.exports = {createUser, loginUser, profile, editProfile, postBlog, blog, editBlog};

