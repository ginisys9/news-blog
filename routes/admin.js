const express = require("express");
const router = express.Router();
/**
 * ! including the routes
 */
const categoryContoller = require('../controller/categoryController');
const articleContoller = require('../controller/articleContoller');
const commentContoller = require('../controller/commentContoller');
const userContoller = require('../controller/userContoller')
/**
 * ! Middleware 
 */
const isLoggin = require('../middleware/isLoggedin')
const isAdmin = require('../middleware/isAdmin')
const upload = require('../middleware/multer')
const isValid = require('../middleware/validation')
/**
 * ! Login routes
 */
// 
router.get("/",userContoller.loginPage);
router.post("/index",isValid.logInValidation,userContoller.adminLogin);
router.get("/logout",isLoggin,userContoller.logout);
router.get("/dashboard",isLoggin,userContoller.dashboard);
router.get("/setting",isLoggin,isAdmin,userContoller.settings);
router.post("/save-setting",isLoggin,isAdmin,upload.single('website_logo'),userContoller.saveSettings);

/**
 * ! user crud routes
 */
router.get("/users",isLoggin,isAdmin,userContoller.allUser);
router.get("/add-user",isLoggin,isAdmin,userContoller.addUserPage);
router.post("/add-user",isLoggin,isAdmin,isValid.userValidation,userContoller.addUser);
router.get("/update-user/:id",isLoggin,isAdmin,userContoller.updateUserPage);
router.post("/update-user/:id",isLoggin,isAdmin,isValid.userUpdateValidation,userContoller.updateUser);
router.delete("/delete-user/:id",isLoggin,isAdmin,userContoller.deleteUser);

/**
 * ! category crud routes
 */

router.get("/categories",isLoggin,isAdmin,categoryContoller.allCategory);
router.get("/add-category",isLoggin,isAdmin,categoryContoller.addCategoryPage);
router.post("/add-category",isLoggin,isAdmin,isValid.categoryValidation,categoryContoller.addCategory);
router.get("/update-category/:id",isLoggin,isAdmin,categoryContoller.updateCategoryPage);
router.post("/update-category/:id",isLoggin,isAdmin,isValid.categoryValidation,categoryContoller.updateCategory);
router.delete("/delete-category/:id",isLoggin,isAdmin,categoryContoller.deleteCategory);

/**
 * ! article crud routes
 */
router.get("/articles",isLoggin,articleContoller.allArticle);
router.get("/add-article",isLoggin,articleContoller.addArticlePage);
router.post("/add-article",isLoggin,upload.single('image'),isValid.articleValidation,articleContoller.addArticle);
router.get("/update-article/:id",isLoggin,articleContoller.updateArticlePage);
router.post("/update-article/:id",isLoggin,upload.single('image'),isValid.articleValidation,articleContoller.updateArticle);
router.delete("/delete-article/:id",isLoggin,articleContoller.deleteArticle);
/**
 * ! comment routes
 */
router.get("/comments",isLoggin,commentContoller.allComment);
router.put("/update-comment/:id",isLoggin,commentContoller.updateCommentStatus);
router.delete("/delete-comment/:id",isLoggin,commentContoller.deleteComment);
/**
 * ! 404 page are not found
 * ! this is only for the aunauthorized routes
 */
router.use(isLoggin,(req,res,next)=>{
    res.status(404).render('admin/404',{
        message:'Page are not found',
        role:req.role
    })
})
/**
 * ! 500 server error
 * ! for  internal id of the pages
 */
router.use(isLoggin,(error,req,res,next)=>{
     console.error(error.stack)
     var status= error.status||500,
    //  view = status=== 404 ? 'admin/404' : 'admin/500';
    view;
    switch(status){
        case 401:
          view = 'admin/401';
          break;
        case 404:
          view = 'admin/404';
          break;
        case 500:
          view = 'admin/500';
          break;
          default:
            view = 'admin/500'
    }
    res.status(status).render(view,{
        message:error.message || 'Something went wrong',
        role:req.role
    })
})

// router.use(isLoggin,(error,req,res,next)=>{
//      console.error(error.stack)
//     res.status(500).render('admin/500',{
//         message:error.message || 'Internal server error',
//         role:req.role
//     })
// })
module.exports = router;
