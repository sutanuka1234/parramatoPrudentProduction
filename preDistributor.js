var createHoldingPatternResponse=require('./stages/holdingPattern/pre.js').createHoldingPatternResponse;
var getAmc=require('./stages/getAmc/pre.js').getAmc;
var getSubnatureOptions=require('./stages/subnatureType/pre.js').getSubnatureOptions;

module.exports={
    createHoldingPatternResponse:createHoldingPatternResponse,
    getAmc                      :getAmc,
    getSubnatureOptions         :getSubnatureOptions
}