
const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const errorMessage = require('../utils/error-message')
const {validationResult} = require('express-validator')
const fs = require('fs');
const path = require('path')
const allArticle = async (req,res,next)=>{
    try {
        var articles;
        if (req.role=='admin') {
         articles = await newsModel.find().populate('category','name').populate('author','fullname')
        }
        else{
         articles = await newsModel.find({author:req.id}).populate('category','name').populate('author','fullname')
        }
        res.render('admin/articles/index',{role:req.role,articles})
    } catch (error) {
        // console.log(error);
        // res.status(500).send('Server Error')
        next(error)
    }
 
};
const addArticlePage = async (req,res)=>{
    const categoryArticle = await categoryModel.find()
    res.render('admin/articles/create',{role:req.role,categoryArticle,error:0})
};

const addArticle = async (req,res,next)=>{
// console.log(req.body,req.file);

 const error = validationResult(req);
 if (!error.isEmpty()) {
     const categoryArticle = await categoryModel.find()
    return res.render('admin/articles/create',{
        role:req.role,
        error:error.array(),
        categoryArticle
    })
 }
 try {
    const {title,content,category} = req.body;
    const article = new newsModel({
        title,content,category,author:req.id,image:req.file.filename
    })
   await article.save()  
    res.redirect('admin/articles')
 } catch (error) {
    // console.log(error);
    // res.status(500).send('Article not saved')
    next(error)
 }

};


const updateArticlePage = async (req,res,next)=>{
    const id = req.params.id;
    try {
        const article = await newsModel.findById(id).populate('category','name').populate('author','fullname');
        if (!article) {
            // return res.status(404).send('Article not found')
          return next(errorMessage('Article not found',404))
        }
        if(req.role=='author'){
            if(req.id != article.author._id){
                // return res.status(401).send('Unauthorized')
                  return next(errorMessage('Unauthorized',401))
            }
        }
        const categories = await categoryModel.find()
         res.render('admin/articles/update',{ article,categories, role:req.role,error:0})
    } catch (error) {
    //     console.log(error);
    //  res.status(500).status('Server error')
    next(createError('Server Error',500))
    }
};

const updateArticle = async (req,res,next)=>{
   const id = req.params.id;
   const error = validationResult(req);
   if (!error.isEmpty()) {
      const categories = await categoryModel.find()
     return res.render('admin/articles/update',{
      categories,
      error:error.array(),
      article:req.body
     })
   }
   try {
    const {title,content,category} = req.body;
    const  article = await newsModel.findById(id)
    if(!article){
        //  return res.status(404).send('Article are not found')
        return next(errorMessage('Article not found',404))
    }
         if(req.role=='author'){
            if(req.id != article.author._id){
                // return res.status(401).send('Unauthorized')
                return next(errorMessage('Unauthorized',404))
            }
        }
     article.title = title;
     article.content  = content;
     article.category = category;
     if(req.file){
        const imagePath = path.join(__dirname,'../public/upload',article.image)
         fs.unlinkSync(imagePath)
        article.image = req.file.filename
     }
    await article.save()

     res.redirect('admin/articles')
   } catch (error){
    //  console.log(error);
    //  res.status(500).send('Internal server error')
    next(error)
   }
};

const deleteArticle = async (req,res,next)=>{
    const id = req.params.id;
    try {
         const article = await newsModel.findById(id)
         if(!article){
            // return res.status(404).send('Artilce not found')
             return next(errorMessage('Article not found',404))
         }
              if(req.role=='author'){
            if(req.id != article.author._id){
                // return res.status(401).send('Unauthorized')
                return next(errorMessage('Unauthorized',401))
            }
        }
         try {
             const imagePath = path.join(__dirname,'../public/upload',article.image)
         fs.unlinkSync(imagePath)
         } catch (error) {
            console.error('Error deleting Image:',error)
         }
         await article.deleteOne()
         res.json({success:true})
    } catch (error) {
        // console.log(error);
        // res.status(500).send('Server Error')
        next(error)
    }
};

module.exports={
 allArticle,
 addArticle,
 addArticlePage,
 updateArticle,
 updateArticlePage,
 deleteArticle
}