var createHoldingPatternResponse=require('./stages/holdingPattern/pre.js').createHoldingPatternResponse;
var getAmc=require('./stages/getAmc/pre.js').getAmc;
var getSubnatureOptions=require('./stages/subnatureType/pre.js').getSubnatureOptions;
var showSchemes=require('./stages/schemeName/pre.js').showSchemes;
var showFolio=require('./stages/folio/pre.js').showFolio;
var amountDecoration=require('./stages/amount/pre.js').amountDecoration;

module.exports={
    createHoldingPatternResponse:createHoldingPatternResponse,
    getAmc                      :getAmc,
    getSubnatureOptions         :getSubnatureOptions,
    showSchemes                 :showSchemes,
    showFolio                   :showFolio,
    amountDecoration            :amountDecoration
}