const cloudinary = require("../middleware/cloudinary");
const { uploadArtwork, uploadRecording } = require("../middleware/multer");


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
          res.render('profile.ejs', { //rendering res to browser => creating object to send to ejs (views)
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
        db.collection('recordings').find({ username: req.user.username }).toArray((err, recordings) => {
            if (err) return console.log(err); 
            res.render('recordings.ejs', { user: req.user, recordings }); // Pass recordings to EJS
        });
    });

    app.get('/art', isLoggedIn, function(req, res) {
        db.collection('artworks').find({ username: req.user.username }).toArray((err, artworks) => {
            if (err) return console.log(err);
            res.render('art.ejs', { user: req.user, artworks }); // Pass artworks & user to EJS
        });
    });


    /*NOTE:
    If your route name is /gallery but your EJS file is art.ejs, the GET request would look like:
    app.get("/gallery", isLoggedIn, function (req, res) {
        res.render("art.ejs", { user: req.user, artworks });
    });

    This works, but I’d have to make sure any links go to /gallery instead of /art
    */

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // SUBMIT NEW SONG LYRICS ==============================
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


    //ACTUAL WORKING ONE
    app.put('/update-favorite', (req, res) => {
      db.collection('song-lyrics')
          .findOne({ title: req.body.title })
          .then(song => {
              if (!song) return res.send("Song not found!");
              console.log(song)
              db.collection('song-lyrics').findOneAndUpdate(
                  { title: req.body.title },
                  { $set: { favorite: song.favorite ? false : true } }, // toggle logic
                  { returnDocument: "after" },
                  (err, result) => {
                      if (err) return res.send(err);
                      res.send(result);
                  }
              );
          });
    });


    app.delete('/delete-song', (req, res) => {
        db.collection('song-lyrics').findOneAndDelete(
            { title: req.body.title },
            (err, result) => {
                if (err) return res.send(500, err);
                res.send("Song deleted!");
            }
        );
    });


    //SUBMIT SONG RECORDINGS
// const cloudinary = require("../middleware/cloudinary");  //TOP OF PAGE
// const { uploadArtwork, uploadRecording } = require("../middleware/multer"); //TOP PF PAGE

app.post("/recordings", uploadRecording.single("file"), async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded");
        console.log("File received:", req.file); //  Debugging step
        
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "Plumes-Recordings"
        });

        console.log("Cloudinary response:", result, ); //  Debugging

        await db.collection("recordings").insertOne({
            username: req.user.username,
            title: req.body.title,
            fileUrl: result.secure_url,
            favorite: false 
        });

        res.redirect("/recordings");
    } catch (err) {
        console.error("Upload Failed:", err);
        res.status(500).json({ error: err.message });
    }
});


app.put('/update-favorite-recording', (req, res) => {
    db.collection('recordings')
        .findOne({ title: req.body.title })
        .then(recording => {
            if (!recording) return res.send("Recording not found!");
            console.log(recording)
            db.collection('recordings').findOneAndUpdate(
                { title: req.body.title },
                { $set: { favorite: recording.favorite ? false : true } }, // toggle logic
                { returnDocument: "after" },
                (err, result) => {
                    if (err) return res.send(err);
                    res.send(result);
                }
            );
        });
  });

  app.delete('/delete-recording', (req, res) => {
    db.collection('recordings').findOneAndDelete(
        { title: req.body.title },
        (err, result) => {
            if (err) return res.send(500, err);
            res.send("Song deleted!");
        }
    );
});



    //ARTWORK
    app.post("/artworks", uploadArtwork.single("image"), async (req, res) => {
        try {
            if (!req.file) throw new Error("No image uploaded");
            console.log("File received:", req.file); //  Debugging step
            
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image",
                folder: "Plumes-Artworks"
            });
    
            console.log("Cloudinary response:", result); //  Debugging
    
            await db.collection("artworks").insertOne({
                username: req.user.username,
                title: req.body.title,
                imageUrl: result.secure_url, // Cloudinary image URL
                favorite: false
            });
    
            res.redirect("/art");
        } catch (err) {
            console.error("Upload Failed:", err);
            res.status(500).json({ error: err.message });
        }
    });

    app.put("/update-favorite-artwork", (req, res) => {
        db.collection("artworks")
            .findOne({ title: req.body.title })
            .then(artwork => {
                if (!artwork) return res.send("Artwork not found!");
                console.log(artwork);
                db.collection("artworks").findOneAndUpdate(
                    { title: req.body.title },
                    { $set: { favorite: artwork.favorite ? false : true } }, // toggle logic
                    { returnDocument: "after" },
                    (err, result) => {
                        if (err) return res.send(err);
                        res.send(result);
                    }
                );
            });
    });

    app.delete("/delete-artwork", (req, res) => {
        db.collection("artworks").findOneAndDelete(
            { title: req.body.title },
            (err, result) => {
                if (err) return res.send(500, err);
                res.send("Artwork deleted!");
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
