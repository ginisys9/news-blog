const categoryModel = require('../models/Category');
const {validationResult} = require('express-validator')
const newsModel = require('../models/News')
/**
 * ! category crud routes
 */
const allCategory= async (req,res)=>{
    const categories = await categoryModel.find()
    res.render('admin/categories/index',{categories,role:req.role})
}
const addCategoryPage= async (req,res,next)=>{
    
    res.render('admin/categories/create',{role:req.role,error:0})
}
const addCategory=async (req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.render('admin/categories/create',{
            role:req.role,
            error:error.array(),
        })
    }
    try {
     await categoryModel.create(req.body)
     res.redirect('/admin/categories')
    } catch (error) {
        // console.log(error);
        // res.status(400).send(error)
        next(error)
    }
}
const updateCategoryPage= async (req,res,next)=>{
    const id = req.params.id;
    try {
        const category = await categoryModel.findById(id)
        if(!category){
            // return res.status(404).send("Category not found")
              return next(errorMessage('Category not found',404))
        }
    res.render('admin/categories/update',{category,role:req.role,error:0})
    } catch (error) {
        // console.log(error);
        // res.status(400).send(error)
        next(error)
    }
}
const updateCategory= async (req,res)=>{
    const id = req.params.id;
    const category = await categoryModel.findById(id)
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.render('admin/categories/update',{
            category,
            error:error.array(),
            role:req.role
        })
    }
    try {
        const category = await categoryModel.findById(id); 
        if(!category){
            // return res.status(404).send('Category not found')
              return next(errorMessage('Category not found',404))
        }
        category.name = req.body.name,
        category.description = req.body.description
         await category.save()
    
     res.redirect('/admin/categories')
    } catch (error) {
        // console.log(error);
        // res.status(400).send(error)
        next(error)
    }
}

const deleteCategory = async (req,res,next)=>{
     const id = req.params.id;
    try {
     const category = await categoryModel.findById(id);
        if(!category){
            // return res.status(404).send('Category not found')
      return next(errorMessage('Category not found',404))
        }
         const article = await newsModel.findOne({category:id})

         if(article){
          return  res.status(400).json({success:false,message:'Category is associated with an article'})
         }
         await category.deleteOne()
       res.json({success:true});
    } catch (error) {
        // console.log(error);
        // res.status(400).send(error)
        next(error)
    }
}

module.exports={
    allCategory,
    addCategory,
    addCategoryPage,
    updateCategory,
    updateCategoryPage,
    deleteCategory
}
