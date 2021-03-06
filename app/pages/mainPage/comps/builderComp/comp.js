//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-builder';             //dont worry about this
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
  attach_read_result_from_main_process();
  build();

}

const editorComp = require("./comps/editorComp/comp");
const childrenComp = require("./comps/childrenComp/comp");
const stylerComp = require("./comps/stylerComp/comp");
const formComp = require("./comps/formComp/comp");
const assetsComp = require("./comps/assetsComp/comp");
const infoComp = require("./comps/infoComp/comp");

async function build(){

  engine.add.comp("formComp",formComp);

  let main = engine.make.div({
    parent:compId,
    class:'comp-builder-main',
  });

  const save = require("./save/index.js");
  // save.init();

  let menuOptions = [];
  if(active.length > 0){menuOptions.push({t:'b',image:'assets/images/back.png',function:()=>{
    engine.global.function.pop_active();
    engine.view.remove(main);
    build();
  }});}
  menuOptions.push({image:'assets/images/folder.png',function:()=>{
    ipc.call("open_view");
    //ipc resolver is after this function
  }});
  menuOptions.push({image:'assets/images/mobile_view.png',function:()=>{
    ipc.call("open_mobile_view");
  }});
  menuOptions.push({image:'assets/images/resize.png',function:()=>{
    engine.global.function.minimize_builder();
  }});
  menuOptions.push({image:'assets/images/add.png',function:()=>{
    engine.data.reset('fonts',{},'local');window.fonts = {};
    engine.data.reset('colors',{},'local');window.colors = {};
    engine.data.reset('viewName',null,'local');
    engine.data.reset('viewPath',null,'local');
    //reset_builder available at top of main page build function
    engine.global.function.reset_builder();
    engine.global.function.clean_active();
    //redraw base is available at page where we draw the main div at the bottom of build function
    engine.global.function.redraw_base();
  }});
  menuOptions.push({image:'assets/images/reload.png',function:()=>{
    engine.view.remove(main);
    build();
  }});
  menuOptions.push({image:'assets/images/save.png',function:()=>{
    save.init();
  }});
  menuOptions.push({image:'assets/images/info.png',function:()=>{
    infoComp.init(compId);
  }});
  menuOptions.push({image:'assets/images/paint.png',function:()=>{
    assetsComp.init(compId);
  }});

  let menuCont = engine.make.div({
    parent:main,
    class:'comp-builder-main-menu'
  });
  for(let i of menuOptions){
    let hcls = 'comp-builder-main-menu-img';
    if(i.t === "b"){hcls += ' comp-builder-main-menu-img_back';}
    engine.make.image({
      parent:menuCont,
      class:hcls,
      type:'local',
      location:i.image,
      function:i.function
    });
  }

  let hold = builder;
  if(active.length > 0){
    for(let i of active){
      hold = hold.children[i];
    }
  }

  if(!hold){
    hold = builder;
    engine.global.function.clean_active();
  }

  if(!hold.style){hold.style = {};}
  if(!hold.style.all){hold.style.all = {};}
  if(!hold.style.browser){hold.style.browser = {};}
  if(!hold.style.browser.mobile){hold.style.browser.mobile = {};}

  engine.global.function.draw();

  let controller = {
    active:()=>{return hold;},
    parent:compId,
    functions:{
      remake:()=>{engine.view.remove(main);build();},
      reset:reset,
      hide:()=>{engine.view.hide(main);},
      show:()=>{engine.view.show(main);},
      update_field:(tag,val,clean)=>{if(clean){hold.controllers = {};}hold.controllers[tag] = val;reset();},
      update_type:(val)=>{hold.type = val;hold.controllers = {};reset();},
      update_loop:(val)=>{hold.should_loop = val;reset();},
      update_loop_array:(val)=>{hold.loop_array = val;reset();},
      update_track:(val)=>{hold.track = val;reset();},
      update_style:(v)=>{hold.style = v;reset();},
      update_name:(val)=>{
        if(active.length > 0){
          let pink = window.builder;
          for(let i=0;i<active.length-1;i++){
            pink = pink.children[active[i]];
          }
          delete pink.children[hold.name];
          pink.children[val] = hold;
          engine.global.function.pop_active();
          engine.global.function.push_active(val);
        }
        hold.name = val;
        reset();
      },
      add_element:(name,type)=>{
        if(!hold.children){hold.children = {};}
        let build = {
          type:type,
          name:name,
          index:Object.keys(hold.children).length + 1,
          style:{
            all:{},
            browser:{
              mobile:{}
            }
          },
          controllers:{},
          should_loop:false,
          loop_array:{},
          children:{}
        };
        if(type === "image"){
          build.controllers["type"] = "url";
        }
        if(type === "input"){
          build.controllers["type"] = "string";
        }
        if(type === "href"){
          build.controllers["type"] = "local";
        }
        hold.children[name] = build;
        reset();
      },
      update_children_position:(base,next)=>{

        // console.log({b:base,n:next});
        // let collect = '';
        // for(let name in hold.children){
        //   collect += ' || ' + hold.children[name].name + ':' + hold.children[name].index;
        // }
        // console.log(collect);

        if(next > base){
          for(let childName in hold.children){
            if(hold.children[childName].index === base){
              hold.children[childName].index = next;
            } else {
              if(hold.children[childName].index <= next && hold.children[childName].index > base){
                hold.children[childName].index--;
              }
            }
          }
        } else if(base > next){
          for(let childName in hold.children){
            if(hold.children[childName].index === base){
              hold.children[childName].index = next;
            } else {
              if(hold.children[childName].index >= next && hold.children[childName].index < base){
                hold.children[childName].index++;
              }
            }
          }
        }

        // collect = '';
        // for(let name in hold.children){
        //   collect += ' || ' + hold.children[name].name + ':' + hold.children[name].index;
        // }
        // console.log(collect);

        reset();
      },
      remove_child:(name)=>{
        delete hold.children[name];
        reset();
      }
    }
  };

  function reset(){
    if(active.length === 0){
      window.builder = hold;
    } else if(active.length === 1){
      window.builder.children[active[0]] = hold;
    } else {
      let pink = window.builder;
      for(let i=0;i<active.length-1;i++){
        pink = pink.children[active[i]];
      }
      pink.children[hold.name] = hold;
    }
    engine.view.remove(main);
    engine.data.reset("builder",window.builder,"local");
    build();
  }

  const tabsCont = engine.make.div({
    parent:main,
    class:'comp-builder-main-tabs',
  });

  let tabs = [{tag:'editor',comp:editorComp},{tag:'styler',comp:stylerComp}];
  if(hold.type === "div" || hold.type === "href"){tabs.push({tag:'children',comp:childrenComp});}
  // tabs.push({tag:'assets',comp:assetsComp});

  for(let tab of tabs){
    engine.make.div({
      parent:tabsCont,
      class:'comp-builder-main-tabs-button',
      text:tab.tag,
      function:()=>{
        engine.data.reset("lastActiveTab",tab.tag,"local");
        engine.router.navigate.to.comp(tab.comp,controller,compRouter);
      }
    });
  }

  let lastActiveTab = engine.data.get("lastActiveTab","local") || "editor",lastBuilderTab;
  if(lastActiveTab === "editor"){
    lastBuilderTab = editorComp;
  } else if(lastActiveTab === "styler"){
    lastBuilderTab = stylerComp;
  } else if(lastActiveTab === "children" && builder.type !== "image" && builder.type !== "input"){
    lastBuilderTab = childrenComp;
  } else {
    lastBuilderTab = editorComp;
  }

  const tabsRouter = engine.make.div({
    parent:main,
    class:'comp-builder-main-tabsRouter',
  });

  const compRouter = engine.router.init.comps(tabsRouter,lastBuilderTab,controller);

  // assetsComp.init(compId);

}

function attach_read_result_from_main_process(){
  if(engine.get.platform() === "electron"){
    ipc.on("read_result_from_main_process",(e,d)=>{
      if(!d.result){
        return engine.ui.getComp('mainUi','alertComp').init(compId,{
          message:'failed to open file'
        });
      }
      if(!engine.validate.json({
        name:{type:'string',max:512,min:1},
        fonts:{type:'object',max:500},
        colors:{type:'object',max:500},
        builder:{type:'object',max:7,min:7},
      },d.data)){
        return engine.ui.getComp('mainUi','alertComp').init(compId,{
          message:'given file is not compatible with this version of vegana maker.'
        });
      }
      if(!engine.validate.json({
        type:{type:'string',options:['div','image','input','href']},
        name:{type:'string',min:1,max:1024},
        style:{type:'object',min:2,max:2},
        controllers:{type:'object',max:50},
        should_loop:{type:'boolean'},
        loop_array:{type:'array',max:500},
        children:{type:'object',max:500}
      },d.data.builder)){
        return engine.ui.getComp('mainUi','alertComp').init(compId,{
          message:'given builder is not compatible with this version of vegana maker.'
        });
      }
      engine.data.reset("builder",d.data.builder,"local");
      engine.data.reset("fonts",d.data.fonts,"local");
      engine.data.reset("colors",d.data.colors,"local");
      engine.data.reset("viewName",d.data.name,"local");
      engine.data.reset("viewPath",d.path,"local");
      engine.global.function.clean_active();
      window.active = [];
      window.builder = d.result;
      engine.global.function.redraw_base();
    });
  }
}


module.exports = {init:init,ref:compRef,type:type,trackers:false}
