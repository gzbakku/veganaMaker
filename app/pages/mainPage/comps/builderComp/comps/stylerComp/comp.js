//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-styler';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,controller) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build(controller);                      //start build you can also start fetch here.

}

async function build(controller){

  let active = controller.active();

  let main = engine.make.div({
    parent:compId,
    class:'comp-builder-styler',
  });

  if(!engine.data.get("active_platform","local")){
    engine.data.reset("active_platform","pc","local");
  }

  window.active_platform = engine.data.get("active_platform","local");
  engine.data.reset("active_platform",active_platform,"local");

  const platforms = engine.make.div({
    parent:main,
    class:'comp-builder-styler-platforms',
  });

  let active_opt_id;
  for(let p of [
    {
      type:'pc',
      image:'assets/images/pc.png',
      function:()=>{active_platform = 'pc';}
    },{
      type:'mobile',
      image:'assets/images/mobile.png',
      function:()=>{active_platform = 'mobile';}
    }
  ]){
    const opt = engine.make.div({
      parent:platforms,
      class:'comp-builder-styler-platforms-opt',
      function:()=>{
        if(p.type === "pc" && active_platform === "mobile"){
          active_platform = 'pc';
          engine.make.addClass({id:opt,class:'comp-builder-styler-platforms-opt_active'});
          engine.make.removeClass({id:active_opt_id,class:'comp-builder-styler-platforms-opt_active'});
          active_opt_id = opt;
          engine.data.reset("active_platform","pc","local");
          engine.view.rmeove(main);
          build(controller);
        }
        if(p.type === "mobile" && active_platform === "pc"){
          active_platform = 'mobile';
          engine.make.addClass({id:opt,class:'comp-builder-styler-platforms-opt_active'});
          engine.make.removeClass({id:active_opt_id,class:'comp-builder-styler-platforms-opt_active'});
          active_opt_id = opt;
          engine.data.reset("active_platform","mobile","local");
          engine.view.rmeove(main);
          build(controller);
        }
      }
    });
    if(p.type === active_platform){
      engine.make.addClass({id:opt,class:'comp-builder-styler-platforms-opt_active'});
      active_opt_id = opt;
    }
      engine.make.image({
        parent:opt,
        class:'comp-builder-styler-platforms-opt-image',
        type:'local',
        location:p.image
      });
  }

  engine.add.function('make_styler_section',make_styler_section);
  engine.add.function('add_style',(t,v)=>{
    if(active_platform === "mobile"){
      active.style.browser.mobile[t] = v;
    } else {
      active.style.all[t] = v;
    }
    controller.functions.update_style(active.style);
  });
  engine.add.function('flush_style',(v)=>{
    controller.functions.update_style(v);
  });
  engine.add.function('remove_style',(t)=>{
    if(!active.style){active.style = {};}
    if(active_platform === "mobile"){
      if(!active.style.browser){active.style.browser = {};}
      if(!active.style.browser.mobile){active.style.browser.mobile = {};}
      delete active.style.browser.mobile[t];
    } else {
      if(!active.style.all){active.style.all = {};}
      delete active.style.all[t];
    }
    controller.functions.update_style(active.style);
  });
  engine.add.function('make_styler_seperator',(parr)=>{
    return engine.make.div({
      parent:parr,
      class:'comp-builder-styler-seperator'
    });
  });

  await require('./text.js')(main,active,false);
  await require('./display.js')(main,active,false);
  await require('./border.js')(main,active,false);
  await require('./position.js')(main,active,false);

}

function make_styler_section(parent,title,show,global_show_controller){
  const main = engine.make.div({
    parent:parent,
    class:'comp-styler-section'
  });
  let showing = engine.data.get(global_show_controller,'local') || false;
  if(show){showing = true;engine.data.reset(global_show_controller,true,'local')}
  const header = engine.make.div({
    parent:parent,
    class:'comp-styler-section-header',
    text:title,
    function:()=>{
      if(showing){
        engine.data.reset(global_show_controller,false,"local");
        engine.view.hide(body);showing = false;
      } else {
        engine.data.reset(global_show_controller,true,"local");
        engine.view.show(body);showing = true;
      }
    }
  });
  const body = engine.make.div({
    parent:parent,
    class:'comp-styler-section-body'
  });
  if(!showing){engine.view.hide(body);}
  return body;
}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
