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

const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    console.log("Uploading file type:", ext); //  For debugging 
    
    if (![".jpg", ".jpeg", ".png", ".mp3", ".wav", ".mp4", ".m4a"].includes(ext)) { 
      cb(new Error(`File type '${ext}' is not supported`), false);
      return;
    }
    cb(null, true);
  },
});