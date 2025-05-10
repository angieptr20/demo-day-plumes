const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: "./config/.env" }); // Load environment variables

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;