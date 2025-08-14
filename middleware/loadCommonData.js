const settingModel = require('../models/Setting');
const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const NodeCache = require('node-cache')
const cache = new NodeCache()
const loadCommonData = async (req,res,next) =>{
     try {
    var setting = cache.get('settingCache'),
        latestNews = cache.get('latestNewsCache'),
        categories =cache.get('categoriesCache') ;
       if (!setting && !latestNews && !categories) {
          setting = await settingModel.findOne().lean()
     latestNews = await newsModel.find()
                             .populate('category',{'name':1,'slug':1})
                             .populate('author','fullname')
                             .sort({createdAt:-1}).limit(5).lean()
    const categoriesInUse = await newsModel.distinct('category')
     categories = await categoryModel.find({'_id':{$in:categoriesInUse}}).lean()
     cache.set('latestNewsCache',latestNews,3600)
     cache.set('settingCache',setting,3600)
     cache.set('categoriesCache', categories,3600)
   }
    res.locals.setting = setting,
    res.locals.latestNews = latestNews,
    res.locals.categories = categories;
     next()
     } catch (error) {
        next(error)
     }                  
}
module.exports = loadCommonData