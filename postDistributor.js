var validateMobile=require('./stages/validateMobile/post.js').validateMobile;
var validatePan=require('./stages/validatePan/post.js').validatePan;
var validatePanMobileByApi=require('./stages/validatePan/post.js').validatePanMobileByApi;

module.exports={
    validateMobile          :validateMobile,
    validatePan             :validatePan,
    validatePanMobileByApi  :validatePanMobileByApi
}

