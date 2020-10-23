//controllers
const log = false;
const type = 'page';

//ids
const pageId = "page-main";
const pageName = 'mainPage';

//init page
const init = () => {
  engine.make.init.page(pageId,"page");  //init page
  build();                               //start build
}

const canvasComp = require("./comps/canvasComp/comp");
const builderComp = require("./comps/builderComp/comp");

//build page
function build(){

  if(!engine.data.get("builder","local")){
    reset_builder();
  }

  function reset_builder(){
    engine.data.reset("builder",{
      type:'div',
      name:'master',
      style:{
        all:{},
        browser:{
          mobile:{}
        }
      },
      controllers:{},
      should_loop:false,
      loop_array:[],
      children:{}
    },"local");
  }

  engine.add.function("reset_builder",reset_builder);

  if(!engine.data.get('active','local')){
    engine.data.set("active",[],'local');
  }
  if(!engine.data.get('host','local')){
    engine.data.reset("host","http://localhost:5566/",'local');
  }
  window.host = engine.data.get('host','local');

  if(!engine.data.get("fonts","local")){engine.data.reset("fonts",{},"local");}
  window.fonts = engine.data.get("fonts","local");

  for(let fontName in fonts){
    let font = fonts[fontName];
    engine.sketch.fonts.add(font.tag,font.name,font.location,null,true);
  }

  if(!engine.data.get("colors","local")){engine.data.reset("colors",{},"local");}
  window.colors = engine.data.get("colors","local");

  window.builder = engine.data.get("builder","local");
  window.active = engine.data.get('active','local');
  engine.add.function("push_active",(v)=>{
    window.active.push(v);
    engine.data.reset("active",window.active,"local");
  });
  engine.add.function("pop_active",()=>{
    if(window.active.length === 0){return;}
    window.active.splice(window.active.length-1,1);
    engine.data.reset("active",window.active,"local");
  });
  engine.add.function("clean_active",()=>{
    engine.data.reset("active",[],"local");
  });

  engine.add.function("make_section",make_section);

  const drag = require('./drag/index.js');

  if(engine.get.platform("pc")){
    const main = engine.make.div({
      parent:pageId,
      class:'page-main-main'
    });
    engine.add.function("redraw_base",()=>{
      engine.view.remove(main);
      build();
    })
    const left = engine.make.div({
      parent:main,
      class:'page-main-main-canvas'
    });
    const right = engine.make.div({
      parent:main,
      class:'page-main-main-builder'
    });
    const rightObject = engine.get.element(right);
    canvasComp.init(left);
    builderComp.init(right);
    let dragger;
    engine.add.function('minimize_builder',()=>{
      engine.view.hide(right);
      engine.make.addClass({id:left,class:'page-main-main-canvas-full'});
      dragger = drag(main);
    });
    engine.add.function('maximize_builder',()=>{
      rightObject.style.display = 'inline-block';
      engine.make.removeClass({id:left,class:'page-main-main-canvas-full'});
      if(dragger){
        engine.view.remove(dragger);
        dragger = null;
      }
    });
    // engine.global.function.minimize_builder();
  }

  if(engine.get.platform("mobile")){
    engine.get.platform = ()=>{
      return 'mobile';
    }
    const main = engine.make.div({
      parent:pageId,
      class:'page-main-main_mobile'
    });
    engine.add.function("redraw_base",()=>{
      engine.view.remove(main);
      build();
    })
    canvasComp.init(main);
  }

}

function make_section(parent,name){
  engine.make.div({
    parent:parent,
    class:'page-main-section',
    text:name
  });
}

//do not change current exports you are free to add your own though.
let pageControllers = {
  init:init,
  ref:pageId,
  type:type,
  name:pageName,
  contModules:{},
  contList:{}
};
module.exports = pageControllers;
window.pageModules[pageName] = pageControllers;
