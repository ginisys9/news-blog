var  mongoose = require('mongoose'),

settingSchema = new mongoose.Schema({
    website_title:{
        type:String,
        required:true
    },
    website_logo:{
        type:String
    },
    footer_description:{
        type:String,
        required:true
    },
});
module.exports = mongoose.model('Setting',settingSchema)
