//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-cardComp';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,data) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  return build(data);                      //start build you can also start fetch here.

}

function build(data){

  let main = engine.make.div({
    parent:'page-router',
    class:'comp-card-main'
  });

  engine.make.div({
    parent:main,
    class:'comp-card-background'
  });

  const card = engine.make.div({
    parent:main,
    class:'comp-card'
  });

  let header = engine.make.div({
    parent:card,
    class:'comp-card-heading'
  });

    engine.make.div({
      parent:header,
      class:'comp-card-heading-title',
      text:data.title
    });

    engine.make.div({
      parent:header,
      class:'comp-card-heading-button',
      text:'close',
      function:()=>{
        engine.view.remove(main);
      }
    });

  const body = engine.make.div({
    parent:card,
    class:'comp-card-body'
  });

  return body;

}

module.exports = {init:init,ref:compRef,type:type}
