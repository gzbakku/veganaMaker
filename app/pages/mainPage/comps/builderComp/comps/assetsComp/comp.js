//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-assets';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build();                      //start build you can also start fetch here.

}

const host = require('./host');
const colors = require('./colors');
const fonts = require('./fonts');

function build(){

  const card = engine.ui.getComp("mainUi","cardComp").init(compId,{
    title:'assets'
  });

  host(card);
  colors(card);
  fonts(card);

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
