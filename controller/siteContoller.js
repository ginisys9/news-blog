   const mongoose = require("mongoose");
   const loadCommonData = require('../middleware/loadCommonData')
   const commentModel = require('../models/Comment');
   const userModel = require('../models/User');
const newsModel = require('../models/News');
const settingModel = require('../models/Setting');
const categoryModel = require('../models/Category');
const paginate = require('../utils/paginate')
const createError = require('../utils/error-message')
/**
 * ! Frontend part function
 */
const index = async (req, res) => {
    // const news = await newsModel.find()
    //                           .populate('category',{'name':1,'slug':1})
    //                           .populate('author','fullname')
    //                           .sort({createdAt:-1})
   
    const paginatedData = await paginate(newsModel,{},req.query,{
         populate:[
            {path:'category',select:['name slug']},
            {path:'author',select:'fullname'}
         ],
         sort:'-createdAt'
         
    })

    //   res.json(paginatedData)

      res.render('index',{paginatedData,query:req.query})
}
const articleByCategory = async (req, res,next) => {
    const category = await categoryModel.findOne({slug:req.params.name})
    if(!category){
   //   return res.status(404).send('category not found')
   return next(createError('Category was not found',404))
    }
    //  const news = await newsModel.find()
    //                           .populate('category',{'name':1,'slug':1})
    //                           .populate('author','fullname')
    //                           .sort({createdAt:-1})
     const paginatedData = await paginate(newsModel,{
        category:category._id
     },req.query,{
         populate:[
            {path:'category',select:['name slug']},
            {path:'author',select:'fullname'}
         ],
         sort:'-createdAt'
    })
    //  res.json({news,categories})

    res.render('category',{paginatedData,category,query:req.query})
}
const singleArticle = async (req, res,next) => {
const singleNews = await newsModel.findById(req.params.id)
                              .populate('category',{'name':1,'slug':1})
                              .populate('author','fullname')
                              .sort({createdAt:-1});
                       
      if (!singleNews) {
            return next(createError('Article was not found',404))
      }
    const comment = await commentModel.find({article:req.params.id,status:'approved'}).sort('-createdAt')

    //  res.json({singleNews,comment})
      res.render('single',{singleNews,comment})
}
const search = async (req, res) => {
    const searchQuery = req.query.search;
    //   const news = await newsModel.find({
    //                          $or:[
    //                             {title:{$regex:searchQuery,$options:'i'}},
    //                             {content:{$regex:searchQuery,$options:'i'}}
    //                          ]
    //                           })
    //                           .populate('category',{'name':1,'slug':1})
    //                           .populate('author','fullname')
    //                           .sort({createdAt:-1})
    
      const paginatedData = await paginate(newsModel,{
          $or:[
            {title:{$regex:searchQuery,$options:'i'}},
            {content:{$regex:searchQuery,$options:'i'}}
         ]
     },req.query,{
         populate:[
            {path:'category',select:['name slug']},
            {path:'author',select:'fullname'}
         ],
         sort:'-createdAt'
    })

    res.render('search',{paginatedData,searchQuery,query:req.query})
}
const author = async (req, res,next) => {
  const author = await userModel.findOne({_id:req.params.name})
  if (!author) {
   //   return res.status(404).send('Author not found')
      return next(createError('Author was not found',404))
  }
//   const news = await newsModel.find()
//                               .populate('category',{'name':1,'slug':1})
//                               .populate('author','fullname')
//                               .sort({createdAt:-1})
 
    const paginatedData = await paginate(newsModel,{
        author:req.params.name
     },req.query,{
         populate:[
            {path:'category',select:['name slug']},
            {path:'author',select:'fullname'}
         ],
         sort:'-createdAt'
    })

    res.render('author',{paginatedData,author,query:req.query})
}
const addComment = async (req, res,next) => {
  try {
    const {name,email,content} = req.body;
    const comment = new commentModel({name,email,content,article:req.params.id})
    await comment.save();
    res.redirect(`/single/${req.params.id}`)
  } catch (error) {
   //  res.status(500).send('Erorr adding comment')
      return next(createError('Erorr adding comment',500))
  }
}

const testingSite = async (req,res) =>{
  //  res.send('this is text editor'.repeat(50000))
   const news = await newsModel.find();
   res.json({news})
}


module.exports = {
    index,
    articleByCategory,
    singleArticle,
    search,
    author,
    addComment,
    testingSite
};
