//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-alertComp';             //dont worry about this
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
  build(data);                      //start build you can also start fetch here.

}

function build(data){

  const main = engine.make.div({
    parent:'page-router',
    class:'comp-alert-main'
  });

    engine.make.div({
      parent:main,
      class:'comp-alert-main-background'
    });

    const card = engine.make.div({
      parent:main,
      class:'comp-alert-main-card card'
    });

      engine.make.div({
        parent:card,
        class:'comp-alert-main-card-message',
        text:data.message
      });

      const buttons = engine.make.div({
        parent:card,
        class:'comp-alert-main-card-buttons'
      });

        engine.make.div({
          parent:buttons,
          class:'comp-alert-main-card-buttons-button',
          text:'ok',
          function:()=>{
            engine.view.remove(main);
          }
        });

}

module.exports = {init:init,ref:compRef,type:type}
