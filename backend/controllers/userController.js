const catchAsyncError=require("../middleware/catchAsyncError");
const ErrorHander = require("../utils/errorhander");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
const cloudinary=require("cloudinary");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:150,
    crop:"scale",
  });
    const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  });
    sendToken(user,201,res);
});

//login

exports.loginUser=catchAsyncError(async(req,res,next)=>{

  const {email,password}=req.body;

  if(!email || !password){
    return next(new ErrorHander("Please enter email and password",400))
  }
  const user=await User.findOne({email}).select("+password");

  if(!user){
    return next(new ErrorHander("Invalid",401));
  }
  const isPasswordMatched=user.comparePassword(password);
  if(!isPasswordMatched){
    return next(new ErrorHander("Invalid",401));
  }
  
 sendToken(user,200,res);


});
//logout
exports.logout=catchAsyncError(async(req,res,next)=>{

  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
  });

  res.status(200).json({
    success:true,
    message:"Logged out",
  });

});

//forgot psswd
exports.forgotPassword=catchAsyncError(async(req,res,next)=>{
  const user=await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHander("User not found",404))
  }
  //reset
  const resetToken=user.getResetPasswordToken();
  await user.save({validateBeforeSave:false});

  const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  const message=`Your password reset token is:-\n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it`;

  try{

    await sendEmail({
      email:user.email,
      subject:`Ecommerce Password Recovery`,
      message,

    });
    res.status(200).json({
      success:true,
      message:`Email sent to ${user.email} successfully`,
    });

  } catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});

    return next(new ErrorHander(error.message,500));
    
  }
});

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
  const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()},
  });
  if(!user){
    return next(new ErrorHander("Reset Password token is invalid",404));
  }
  if(req.body.password !==req.body.confirmPassword){
    return next(new ErrorHander("Password does not matched",404));

  }
  user.password=req.body.password;
  user.resetPasswordToken=undefined;
  user.resetPasswordExpire=undefined;
  await user.save();
  sendToken(user,200,res);
});

exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    user,
  });
});


exports.updatePassword=catchAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.user.id).select("+password");
  const isPasswordMatched=user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
    return next(new ErrorHander("old password is incorrect",400));
  }
  if(req.body.newPassword !==req.body.confirmPassword){
    return next(new ErrorHander("password does not match",400));
  }
  user.password=req.body.newPassword;
  await user.save();
  sendToken(user,200,res);
});


exports.updateProfile=catchAsyncError(async(req,res,next)=>{
 const newUserData={
  name:req.body.name,
  email:req.body.email,
 };

 if(req.body.avatar !==""){
  const user=await User.findById(req.user.id);
  const imageId=user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:150,
    crop:"scale",
  });
  newUserData.avatar={
    public_id:myCloud.public_id,
    url:myCloud.secure_url,
  }
 }
 const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
  new:true,
  runValidators:true,
  useFindAndModify:false,
 });
  res.status(200).json({
    success:true,

  });
});

exports.getAllUser=catchAsyncError(async(req,res,next)=>{
  const users=await User.find();
  res.status(200).json({
    success:true,
    users,
  });
});

exports.getSingleUser=catchAsyncError(async(req,res,next)=>{
  const user=await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHander(`User does not exist with id: ${req.params.id}`));
  }
  res.status(200).json({
    success:true,
    user,
  });
});


exports.updateUser=catchAsyncError(async(req,res,next)=>{
  const newUserData={
   name:req.body.name,
   email:req.body.email,
   role:req.body.role,
  };

  
  await User.findByIdAndUpdate(req.params.id,newUserData,{
   new:true,
   runValidators:true,
   useFindAndModify:false,
  });
   res.status(200).json({
     success:true,
 
   });
 });

 //delete
 exports.deleteUser=catchAsyncError(async(req,res,next)=>{
  
  
  const user=await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHander(`User does not exist with id: ${req.params.id}`))
  }

  const imageId=user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.deleteOne();
   
   res.status(200).json({
     success:true,
     message:"User deleted",
 
   });
 });