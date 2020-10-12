//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-info';             //dont worry about this
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

function build(){

  const card = engine.ui.getComp("mainUi","cardComp").init(compId,{
    title:'help'
  });

  let infos = [
    'choose a comp folder',
    'add some fonts to your vegana project and serve your project',
    'add fonts to the comp editor from the pain pallate icon on the top right of the builder',
    'add some colors',
    'to use images host the images on your vegana project assets folder and add there link to image element in editor section'
  ];

  const main = engine.make.div({
    parent:card,
    class:'comp-info-main'
  });

  for(let info of infos){
    engine.make.div({
      parent:main,
      class:'comp-info-main-point',
      text:info
    });
  }

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
