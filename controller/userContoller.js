const userModel = require("../models/User");
const categoryModel = require("../models/Category");
const articleModel = require("../models/News");
const settingModal = require('../models/Setting')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {validationResult} = require('express-validator')
const  errorMessage = require('../utils/error-message')
const newsModel = require('../models/News')
const fs = require('fs')
// const { addArticle } = require("./articleContoller");
dotenv.config();
/**
 * ! login function routes
 */
const loginPage = async (req, res) => {
  res.render("admin/login", {
    layout: false,
    error:0
  });
};

const adminLogin = async (req, res,next) => {
   const error = validationResult(req);
   if(!error.isEmpty()){
    // return res.status(400).json({error:error.array()})
   return  res.render('admin/login',{
      layout:false,
      error:error.array()
     })
   }
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      // return res.status(404).send("invalid username or password");
        return next(errorMessage('Invalid username or password',401))
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // res.status(401).send("Inalid username or password");
        return next(errorMessage('Invalid username or password',401))
    }
    var jwtData = { id: user._id, fullname: user.fullname, role: user.role },
      token = jwt.sign(jwtData, process.env.JWT_SCERET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect("/admin/dashboard");
  } catch (error) {
    // res.status(500).send("internal server error");
    next(error)
  }
};
const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/");
};

/**
 * ! user crud routes
 */
const allUser = async (req, res) => {
  const users = await userModel.find();
  res.render("admin/users/index", { users,role:req.role });
};
const addUserPage = async (req, res) => {
  res.render("admin/users/create",{role:req.role,error:0});
};

const addUser = async (req, res) => {
  const error = validationResult(req)
   if(!error.isEmpty()){
     return res.render('admin/users/create',{
      role:req.role,
      error:error.array()
     })
   }
  await userModel.create(req.body);
  res.redirect("/admin/users");
};
const updateUserPage = async (req, res,next) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      // return res.status(404).send("user not found");
    return next(errorMessage('User not found',404))

    }
    res.render("admin/users/update", {user,role:req.role,error:0 });
  } catch (error) {
    // console.log(error);
    // res.status(500).send("internal server error");
    next(error)
  }
};
const updateUser = async (req, res,next) => {
  const id = req.params.id;
  const error = validationResult(req);
   if(!error.isEmpty()){
    return res.render('admin/users/update',{
      user:req.body,
      role:req.role,
      error:error.array()
    })
   }
  const { fullname, password, role } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      // return res.status(404).send("user are not found");
   return next(errorMessage('Category not found',404))

    }
    user.fullname = fullname || user.fullname;
    if (password) {
      user.password = password;
    }
    user.role = role || user.role;
    await user.save();
    res.redirect("/admin/users");
  } catch (error) {
    // res.status(500).send("Internal server error");
    next(error)
  }
};

const deleteUser = async (req, res,next) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      // return res.status(404).send("User are not found");
   return next(errorMessage('Category not found',404))
    }
    const article = await newsModel.findOne({author:id}) 

    if(article){
      return res.status(400).json({success:false,message:'User is associated with an article'})
    }
    await user.deleteOne()
    res.json({ success: true });
  } catch (error) {
    // console.log(error);
    // res.status(500).send("internel server are error");
    next(error)
  }
};

/**
 * ! function for the dashboard
 */
const dashboard = async (req, res,next) => {
   try {
       var articleCount;
        if (req.role=='author') {
        articleCount = await articleModel.countDocuments({author:req.id})
        }
        else{
        articleCount = await articleModel.countDocuments()
        }
    
       var userCount = await userModel.countDocuments(),
           categoryCount = await categoryModel.countDocuments();
  res.render("admin/dashboard",{
    role:req.role,
    fullname:req.fullname,
    userCount,
   articleCount,
   categoryCount

  });

   } catch (error) {
    //  console.log(error);
    //  res.status(500).send('Internal server error')
    next(error)
   }
};
/**
 * ! function of the settings
 */
const settings = async (req, res,next) => {
   try {
      const setting = await settingModal.findOne();
     res.render("admin/setting",{role:req.role,setting});
   } catch (error) {
    //  console.log(error)
    //  res.status(500).send('Internal server Error')
    next(error)
   }

};
const saveSettings = async (req, res,next) => {
 const {website_title,footer_description} = req.body;
 const website_logo = req.file?.filename;
 try {
  //  const setting = await settingModal.findOneAndUpdate(
  //   {},
  //   {footer_description,website_logo,website_title},
  //   {new:true,upsert:true}
  //  )
    var setting = await settingModal.findOne()
     if(!setting){
       setting = new settingModal();
     }
   
     setting.website_title = website_title,
     setting.footer_description = footer_description
     if(website_logo){
       if (setting.website_logo) {
        const logoPath = `./public/upload/${setting.website_logo}`
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath)
        }
       }
         setting.website_logo = website_logo
     }
     await setting.save()
   res.redirect('/admin/setting')
 } catch (error) {
  //  console.log(error);
  //  res.status(500).send('Internal server Error');
  next(error)
 }
};
module.exports = {
  loginPage,
  adminLogin,
  logout,
  allUser,
  addUser,
  addUserPage,
  updateUser,
  updateUserPage,
  deleteUser,
  dashboard,
  settings,
  saveSettings
};
