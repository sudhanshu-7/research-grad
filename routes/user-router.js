const bcrypt = require('bcryptjs');
const passport = require('passport');


const User = require('../models/user-model');
const UserLocal = require('../models/user-local-model');
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
        UserLocal.findOne({ username: username }).then(user => {
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
            const newUser = new UserLocal({
              username: username,
              firstName: fName,
              lastName: lName,
              email: email,
              password: password
            });

            console.log(newUser);
    
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
  console.log(req.isAuthenticated());
  Profile.findOne({username: req.user.username})
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

  const newBlog = new Blog({identifier: titleWithoutSpaces, username: req.user.username, ...req.body});


  newBlog
    .save()
    .then(blog => {
      console.log("blog posted");
      res.redirect("/blog");
    })
} 

blog = (req, res) => {
  console.log("BLOG");
  Blog.find({username: req.user.username}, (err, found) => {
  console.log(req.user);
    if(err)
      console.log(err);
    res.render("blog", {blogs: found, user: req.user});
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

dashboard = (req, res) => {
  res.render("dashboard", {user: req.user});
}

getUsername = (req, res) => {
  console.log(req.user);
  res.render("get-username", {exists: false});
}

setUsername = (req, res) => {

  Profile.findOne({username: req.body.username}, (err, found) => {
    if(err){
      console.log(err);
    }
    else if (found){
      res.render("get-username", {exists: true})
    }

    else{
      User.updateOne({googleId: req.user.googleId},
        {username: req.body.username},
        (err) => {
          if(err){
            console.log(err);
          }
        }
      )
    
      Profile.updateOne({googleId: req.user.googleId},
        {username: req.body.username},
        (err) => {
          if(err){
            console.log(err);
          }
          res.redirect("/profile");
        }
      )
    }
  })

  
}

module.exports = {createUser, loginUser, profile, editProfile, postBlog, blog, editBlog, dashboard, getUsername, setUsername};

