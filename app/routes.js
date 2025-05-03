module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('creations').find().toArray((err, result) => { //grabs value from database and stores in result
          if (err) return console.log(err) //error checking
            // console.log(result)
          res.render('profile.ejs', { //rendering res to browser => creating object to send to ejs
            user : req.user, 
            creations: result 
          })
        })
    });

    // Access Song Lyrics Page from Profile
    app.get('/song-lyrics', isLoggedIn, function(req, res) {
      db.collection('song-lyrics').find({ username: req.user.username }).toArray((err, songs) => {
          if (err) return res.send(err);
          res.render('song-lyrics.ejs', { 
            user: req.user,
            songs : songs
          });
      });
  });

    app.get('/recordings', isLoggedIn, function(req, res) {
      res.render('recordings.ejs');
    });

    app.get('/art', isLoggedIn, function(req, res) {
      res.render('art.ejs');
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // Submit new song lyrics
    app.post('/add-lyrics', (req, res) => {
      db.collection('song-lyrics').insertOne(
          { 
              username: req.user.username, 
              title: req.body.title, 
              lyrics: req.body.lyrics, 
              favorite: false 
          },
          (err, result) => {
              if (err) {
                  return res.send(err);
              }
              res.redirect('/song-lyrics');
          }
        );
    });

    // app.put('/update-favorite', (req, res) => {
    //   db.collection('song-lyrics')
    //     .findOneAndUpdate(
    //       { 
    //         username: req.user.username, 
    //         title: req.body.title,
    //        },
    //       { $set: { favorite: true } }, // Increment 
    //       { sort: { _id: -1 }, upsert: true },
    //       (err, result) => {
    //         if (err) return res.send(err);
    //         res.send(result);
    //       }
    //     );
    // });

    // app.put('/update-favorite', (req, res) => {
    //   db.collection('song-lyrics')
    //     .findOneAndUpdate(
    //       { 
    //         username: req.user.username, 
    //         title: req.body.title,
    //        },
    //       { $set: { favorite: { $not: "$favorite" }} }, // Increment 
    //       { sort: { _id: -1 }, upsert: true },
    //       (err, result) => {
    //         if (err) return res.send(err);
    //         res.send(result);
    //       }
    //     );
    // });

    // app.put('/update-favorite', (req, res) => {
    //   db.collection('song-lyrics')
    //       .findOne({ username: req.user.username, title: req.body.title })
    //       .then(song => {
    //           db.collection('song-lyrics').findOneAndUpdate(
    //               { username: req.user.username, title: req.body.title },
    //               { $set: { favorite: !song.favorite } }, // toggle logic
    //               { returnDocument: "after" },
    //               (err, result) => {
    //                   if (err) return res.send(err);
    //                   res.send(result);
    //               }
    //           );
    //       });
    // });

    app.put('/update-favorite', (req, res) => {
      db.collection('song-lyrics')
          .findOne({ title: req.body.title })
          .then(song => {
              if (!song) return res.send("Song not found!");
              console.log(song)
              db.collection('song-lyrics').findOneAndUpdate(
                  { title: req.body.title },
                  { $set: { favorite: song.favorite ? false : true } }, // Proper toggle logic
                  { returnDocument: "after" },
                  (err, result) => {
                      if (err) return res.send(err);
                      res.send(result);
                  }
              );
          });
  });

//   app.put('/update-favorite', (req, res) => {
//     db.collection('song-lyrics')
//         .findOneAndUpdate(
//             { title: req.body.title },
//             { $set: { favorite: true } },
//             { sort: { _id: -1 }, upsert: true },
//             (err, result) => {
//                 if (err) return res.send(err);
//                 res.send(result);
//             }
//         );
// });

app.delete('/delete-answer', (req, res) => {
    db.collection('song-lyrics').findOneAndDelete(
        { title: req.body.title },
        (err, result) => {
            if (err) return res.send(500, err);
            res.send("Song deleted!");
        }
    );
});


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form3
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
