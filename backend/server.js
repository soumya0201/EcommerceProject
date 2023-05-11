const app=require("./app");
const dotenv=require("dotenv");
const cloudinary=require("cloudinary");





const connectDatabase=require("./config/database");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true,parameterLimit:1000000,limit:"500mb"}));
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});


dotenv.config({ path: "backend/config/config.env" });

connectDatabase();
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET

});





const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://127.0.0.1:${process.env.PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });

  