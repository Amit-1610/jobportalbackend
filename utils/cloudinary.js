const cloudinary = require("cloudinary").v2;

// Cloudinary configuration - make sure to set these ENV variables in your .env file or environment:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,     // e.g. 'my-cloud'
  api_key: process.env.CLOUDINARY_API_KEY,           // e.g. '1234567890'
  api_secret: process.env.CLOUDINARY_API_SECRET      // e.g. 'abcdefg123456'
});

module.exports = cloudinary;
