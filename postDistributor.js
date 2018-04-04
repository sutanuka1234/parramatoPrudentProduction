var validateMobile=require('./stages/validateMobile/post.js').validateMobile;
var validatePan=require('./stages/validatePan/post.js').validatePan;
var validatePanMobileByApi=require('./stages/validatePan/post.js').validatePanMobileByApi;
var getOTP=require('./stages/otp/post.js').getOTP;
var validateOTP=require('./stages/otp/post.js').validateOTP;
var resendOTP=require('./stages/otp/post.js').resendOTP;
var validateHoldingPattern=require('./stages/holdingPattern/post.js').validateHoldingPattern;

module.exports={
    validateMobile          :validateMobile,
    validatePan             :validatePan,
    validatePanMobileByApi  :validatePanMobileByApi,
    getOTP                  :getOTP,
    validateOTP             :validateOTP,
    resendOTP               :resendOTP,
    validateHoldingPattern  :validateHoldingPattern   
}

