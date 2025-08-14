const {body} = require('express-validator');

const logInValidation = [
    body('username')
    .trim()
    .notEmpty()
    .withMessage('username is Required')
    .matches(/^\S+$/)
    .withMessage('username must not contain spaces')
    .isLength({min:3,max:10})
    .withMessage('username must be 5 to 10 character'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min:5,max:10})
    .withMessage('Password must be 5 to 10 character')
]
const userValidation = [
    body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is Required')
    .isLength({min:5,max:25})
    .withMessage('Fullname must be 5 to 25 character long'),

     body('username')
    .trim()
    .notEmpty()
    .withMessage('username is Required')
    .matches(/^\S+$/)
    .withMessage('username must not contain spaces')
    .isLength({min:5,max:10})
    .withMessage('username must be 5 to 10 character'),
   
     body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min:5,max:10})
    .withMessage('Password must be 5 to 10 character'),
     
     body('role')
     .trim()
     .notEmpty()
     .withMessage('Role is required')
     .isIn(['author','admin'])
     .withMessage('role must be author or admin')

]
const userUpdateValidation = [
   body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is Required')
    .isLength({min:5,max:25})
    .withMessage('Fullname must be 5 to 25 character long'),
     
     body('password')
     .optional({checkFalsy:true})
    .isLength({min:5,max:10})
    .withMessage('Password must be 5 to 10 character'), 
     body('role')
     .trim()
     .notEmpty()
     .withMessage('Role is required')
     .isIn(['author','admin'])
     .withMessage('role must be author or admin')
]
const categoryValidation = [
 body('name')
 .trim()
 .notEmpty()
 .withMessage('Category Name is required')
 .isLength({min:3,max:12})
  .withMessage('category name must be 3 to 12 character long'),

  body('description')
  .isLength({max:100})
  .withMessage('Description must be at most 100 character long')
]
const articleValidation = [
  body('title')
  .trim()
  .notEmpty()
  .withMessage('Title is required')
  .isLength({min:7,max:50})
  .withMessage('Title must be 7 to 50 character'),

   body('content')
   .notEmpty()
   .withMessage('Content is required')
   .isLength({min:50})
    .withMessage('Content must be 50 to 1500 character long'),

    body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
]


module.exports = {
    logInValidation,
    userUpdateValidation,
    userValidation,
    categoryValidation,
    articleValidation
}