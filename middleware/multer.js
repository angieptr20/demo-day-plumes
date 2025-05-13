// const multer = require("multer");
// const path = require("path");

// module.exports = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname).toLowerCase();
//     console.log("Uploading file type:", ext); //  Debugging step
    
//     if (![".jpg", ".jpeg", ".png", ".mp3", ".wav", ".mp4", ".mp4a"].includes(ext)) { 
//       cb(new Error(`File type '${ext}' is not supported`), false);
//       return;
//     }
//     cb(null, true);
//   },
// });


//        WORKING SOLUTION
// const multer = require("multer");
// const path = require("path");

// module.exports = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname).toLowerCase();
//     console.log("Uploading file type:", ext); //  For debugging 
    
//     if (![".jpg", ".jpeg", ".png", ".mp3", ".wav", ".mp4", ".m4a"].includes(ext)) { 
//       cb(new Error(`File type '${ext}' is not supported`), false);
//       return;
//     }
//     cb(null, true);
//   },
// });




///POSSIBLE SOLUTION 
// const cloudinary = require("cloudinary").v2;
const cloudinary = require("../middleware/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary"); //  import
const multer = require("multer");
// const path = require("path");

//  Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

//  Multer Storage for Artwork (Images)
const artworkStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Plumes-Artworks",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
        resource_type: "image"
    }
});

//  Multer Storage for Recordings (Audio)
const recordingStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Plumes-Recordings",
        allowed_formats: ["mp3", "wav", "aac", "m4a"],
        resource_type: "auto"
    }
});

//  Multer Upload Configurations
const uploadArtwork = multer({ storage: artworkStorage });
const uploadRecording = multer({ storage: recordingStorage });

module.exports = { uploadArtwork, uploadRecording };