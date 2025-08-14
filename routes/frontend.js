const express = require("express");
const router = express.Router();
const loadCommonData = require('../middleware/loadCommonData')
const siteController = require("../controller/siteContoller");

/**
 *  ! it will include all the middleware
 */
router.use(loadCommonData)
router.get("/",siteController.index);
router.get("/category/:name",siteController.articleByCategory);
router.get("/single/:id",siteController.singleArticle);
router.get("/search",siteController.search);
router.get("/author/:name",siteController.author);
router.post("/single/:id/comment",siteController.addComment);

router.get('/testing',siteController.testingSite)

router.use((req,res,next)=>{
    res.status(404).render('404',{
        message:'Page are not found',
    })
})

router.use((error,req,res,next)=>{
     console.error(error.stack)
     var status= error.status||500;
    //  view = status=== 404 ? 'admin/404' : 'admin/500';
    res.status(status).render('errors',{
        message:error.message || 'Something went wrong',
        status:status
    })
})
module.exports = router;