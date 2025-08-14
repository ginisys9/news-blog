const commentController = require('../models/Comment')
const createError = require('../utils/error-message')
const newsModel = require('../models/News')

const allComment = async (req,res,next)=>{
   try {
     var comment;
     if (req.role==='admin') {
           comment = await commentController.find()
      .populate('article','title')
      .sort({createdAt:-1})
     }
     else{
          const news = await newsModel.find({author:req.id})
          const newsId = news.map(news=>news._id)
          comment = await commentController.find({article:{$in:newsId}}).populate('article','title')
          .sort({createdAt:-1})
     }
     // res.json(comment)
     res.render('admin/comments',{comment,role:req.role})
   } catch (error) {
     next(createError('Error fetching comments',500))
   }
};
const updateCommentStatus = async (req,res,next)=>{
     try {
  const comment = await commentController.findByIdAndUpdate(req.params.id,{status:req.body.status});
 
   if (!comment) {
      return next(createError('Comment not found',404))
   }
   res.json({success:true})
   // !    res.redirct('/admin/comments');
     } catch (error) {
          next(createError('Error updating commment status',500))
     }
     // ! res.render('admin/comments/index',{role:req.role})
};
const deleteComment = async (req,res,next)=>{
    try {
       const comment = await commentController.findByIdAndDelete(req.params.id);
       if (!comment) {
          return next(createError('Comment not found',404))
       }
       res.json({success:true})
    } catch (error) {
      next(createError('Error deleting comment',500))
    }
};
module.exports = {
     allComment,
     updateCommentStatus,
     deleteComment
}

