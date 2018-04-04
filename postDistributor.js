var validateMobile=require('./stages/validateMobile/post.js').validateMobile;
var validatePan=require('./stages/validatePan/post.js').validatePan;
var validatePanMobileByApi=require('./stages/validatePan/post.js').validatePanMobileByApi;
var getOTP=require('./stages/otp/post.js').getOTP;
var validateOTP=require('./stages/otp/post.js').validateOTP;
var resendOTP=require('./stages/otp/post.js').resendOTP;
var validateHoldingPattern=require('./stages/holdingPattern/post.js').validateHoldingPattern;
var vaildateSelectedAmc=require('./stages/getAmc/post.js').vaildateSelectedAmc;
var validateSubnatureOptions=require('./stages/subnatureType/post.js').validateSubnatureOptions;
var validateSchemeName=require('./stages/schemeName/post.js').validateSchemeName;
var validateFolio=require('./stages/folio/post.js').validateFolio;
var validateAmount=require('./stages/amount/post.js').validateAmount;
var validateAgreement=require('./stages/agreement/post.js').validateAgreement;
var insertBuyCart=require('./stages/agreement/post.js').insertBuyCart;

module.exports={
    validateMobile          :validateMobile,
    validatePan             :validatePan,
    validatePanMobileByApi  :validatePanMobileByApi,
    getOTP                  :getOTP,
    validateOTP             :validateOTP,
    resendOTP               :resendOTP,
    validateHoldingPattern  :validateHoldingPattern,
    vaildateSelectedAmc     :vaildateSelectedAmc,
    validateSubnatureOptions:validateSubnatureOptions,
    validateSchemeName      :validateSchemeName,
    validateFolio           :validateFolio,
    validateAmount          :validateAmount,
    validateAgreement       :validateAgreement,
    insertBuyCart           :insertBuyCart
}

