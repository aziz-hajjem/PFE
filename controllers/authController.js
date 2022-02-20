const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const crypto=require('crypto')
const sendEmail=require('../utils/handlingEmail')

exports.signUp = async (req, res, next) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;
    // create user
    const newUser = await User.create({
      userName: userName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
    // create jwt for the user when he sign up
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: "Succes",
      data: {
        newUser,
        token,
      },
    });
  } catch (error) {
    
    res.status(400).json({
      error: {
        status: "Fail",
        message: error.message,
      },
    });
  }
  next();
};
exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if user enter his email and his password
    if (!email || !password) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Please enter your email and your password",
        },
      });
    }
    // find user by email
    const user = await User.findOne({ email: email }).select("+password").select("+enable").populate('projects');
    if (!user || !(await user.passwordCorrect(password, user.password))) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "User not exist or password incorrect 🥺",
        },
      });
    }
    if(!user.enable){
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "You are Enabled to Login , Please call the admin  🥺",
        },
      });
    }
    // create jwt for the user when he sign up
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: "Succes",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: {
        status: "Fail",
        message: error.message,
      },
    });
  }
  next();
};
exports.protect = async (req, res, next) => {
  try {
    let token;
    // get Token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // check if there is a token
    if (!token) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "You are not logged in , Please log in to get acces🥺",
        },
      });
    }
    // check if the token is validate
    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        error: {
          status: "Fail",
          message: "Invalid token , Please log in again  🥺",
        },
      });
    }
    // check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(404).json({
        error: {
          status: "Fail",
          message: "This is user does no longer exist ! 🥺",
        },
      });
    }
    //check if user changed password after the token was issud
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(404).json({
        error: {
          status: "fail",
          message: "User has recently change the password ! Please Login again",
        },
      });
    }
    // if it's ok grant acces to the current user
    req.user=currentUser

  } catch (error) {
    res.status(400).json({
      error: {
        status: "Fail",
        message: error.message,
      },
    });
  }
  next();
};
exports.restrictTo = ([...roles]) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(301).json({
          status: "fail",
          message: "You do not have the permisson to do that 😒",
        });
      }
      next();
    };
};
exports.forgotPassword = async (req, res, next) => {
    try {
      //1) get user based on posted email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          
          error: {
            status: "Fail",
            message: "There is no user with this email !",
          },
        });
      }
      // if there is a user, create a reset token for him
      const resetToken = user.createPasswordResetToken();
      // zedna el option adhika fel save bech may9olich confirm your password
      await user.save({ validateBeforeSave: false });
      //3) send it to user email
      const resetUrl = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;
      const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm 
          to ${resetUrl}.\n If you didn't forgot your password please ignore this email !`;
  
      try {
        await sendEmail({
          email: user.email,
          subject: "Your password token is valid only for 10min !!",
          message,
        });
  
        res.status(200).json({
          status: "Succes",
          message: `Token sent to email`,
          resetToken
        });
      } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
  
        return res.status(400).json({
          status: "Fail",
          message: `Token is not sended to the client ${error.message}`,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "Fail",
        error: {
          message: error.message,
        },
      });
    }
    next();
};
exports.resetPassword = async (req, res, next) => {
    try {
      // 1) Get user based on the token
      const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
  
      //2) If token has not expired ,and there is user, set the new password
      if (!user) {
        return res.status(404).json({
          error: { status: "Fail", message: "Token is invalid or has expired" },
        });
      }
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
  
      //3) Update changedPasswordAt property for the user
      //this is middleware 'pre' save in the userModel
  
      //4) Log the user in , send JWT
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.status(201).json({
        status: "succes",
        user,
        token: token,
      });
    } catch (error) {
      res.status(404).json({
        error: { status: "Fail", message: error.message },
      });
    }
    next();
};