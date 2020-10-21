
let css_pool = [];

module.exports = {

  init:async ()=>{

    let name = engine.data.get("viewName","local");
    if(!name){
      name = await require("./get_name.js")()
      .then((n)=>{return n;})
      .catch(()=>{
        return;
      });
    } else {
      await require('./as_is.js')()
      .then(async (v)=>{
        if(!v){
          name = await require("./get_name.js")()
          .then((n)=>{return n;})
          .catch(()=>{
            return;
          });
        }
      })
      .catch(()=>{
        return engine.ui.getComp("mainUi","alertComp").init("page-router",{
          message:'failed save as is popup'
        });
      });
    }

    css_pool = [];

    const build = draw_element(builder,1,'compId','',name,name);
    let final_js = "\n\nmodule.exports = (parent,data)=>{\n" + build + "\n};"
    let final_css = compile_css();

    if(engine.get.platform() === "electron"){
      ipc.on("save_result_from_main_process",(e,d)=>{
        let message;
        if(d.result){
          message = 'view generated successfully';
        } else {
          message = 'failed to generate view sorry.';
        }
        engine.ui.getComp("mainUi","alertComp").init("page-router",{
          message:message
        });
        if(d.name){
          engine.data.reset('viewName',d.name,'local');
        }
        if(d.path){
          engine.data.reset('viewPath',d.path,'local');
        }
      });
      ipc.call("save_view",{name:name,css:final_css,js:final_js,builder:{
        builder:builder,fonts:fonts,colors:colors
      },path:engine.data.get('viewPath','local')});
    }

  }

};

function draw_element(element,tab_no,parent,base,name,cls){

  let element_name_parsed = element.name;
  while(element_name_parsed.indexOf(" ") >= 0){
    element_name_parsed = element_name_parsed.replace(" ","_");
  }
  name += "_" + element_name_parsed;

  let cover;
  if(element.type === "div"){cover = 'engine.make.div';} else
  if(element.type === "href"){cover = 'engine.make.href';} else
  if(element.type === "input"){
    if(element.controllers.type !== "select" && element.controllers.type !== "textarea"){cover = 'engine.make.input';} else
    if(element.controllers.type === "select"){cover = 'engine.make.select';} else
    if(element.controllers.type === "textarea"){cover = 'engine.make.textarea';}
  } else
  if(element.type === "image"){cover = 'engine.make.image';}

  let base_tab = '';
  for(let i=0;i<tab_no;i++){base_tab +='\t';}
  let controller_tab = '';
  for(let i=0;i<tab_no+1;i++){controller_tab +='\t';}
  let baseWithoutLoop = base_tab;
  if(element.should_loop){base_tab += "\t",controller_tab += "\t"}

  let this_element;
  let make = cover + "({";
  if(parent === "compId"){
    make = base_tab + "const main = " + make;
    this_element = 'main';
  } else if(element.track){
    make = base_tab + "const " + element.track + " = " + make;this_element = element.track;
  } else if(Object.keys(element.children).length > 0){
    make = base_tab + "const " + name + " = " + make;this_element = name;
  } else {
    make = base_tab + make;
  }

  let loop_name;
  if(element.should_loop){loop_name = element_name_parsed + "_loop_array"}

  if(parent === "compId"){
    make += "\n" + controller_tab + "parent:parent,";
  } else {
    make += "\n" + controller_tab + "parent:" + parent + ",";
  }
  for(let key in element.controllers){
    if(element.controllers[key]){
      if(key === "function" || key === "baseFunction" || key === "superFunction" || key === "touch"){
        if(typeof(eval(element.controllers[key])) === "function"){
          make += '\n' + controller_tab + key + ":" + parse_function(element.controllers[key]) + ",";
        }
      } else if(key === "options"){
        make += '\n' + controller_tab + key + ":" + JSON.stringify(element.controllers[key]) + ",";
      } else {
        if(element.should_loop){
          make += '\n' + controller_tab + key + ':' + point_to_array(element.controllers[key]) + ',';
        } else {
          make += '\n' + controller_tab + key + ':"' + element.controllers[key] + '",';
        }
      }
    }
  }
  let parse_class = cls + '-' + element_name_parsed;
  make += "\n" + controller_tab + 'class:"' + parse_class + '",';
  make += '\n' + base_tab + '});\n';

  function point_to_array(tree){
    if(tree.indexOf("...") < 0){return '"' + tree + '"';}
    let make = "item";
    for(let item of tree.split("...")){
      if(item.length > 0){make += '["' + item + '"]';}
    }
    return make;
  }

  function parse_function(v){
    let h = '';index = 0;pool = v.split("\n");
    for(let item of pool){
      if(index === 0){
        h += item;
      } else {
        h += "\n" + controller_tab + item;
      }
      index++;
    }
    if(h[h.length-1] === ";"){
      h = h.substring(0,h.length - 1);
    }
    return h;
  }

  if(element.should_loop){
    make = '\n' + baseWithoutLoop + "for(let item of data." + loop_name + "){\n" + make + baseWithoutLoop + "}\n"
  } else {
    make = "\n" + make;
  }

  parse_css_class(element,parse_class,tab_no-1);

  base += make;
  for(let childName of Object.keys(element.children)){
    base = draw_element(element.children[childName],tab_no+1,this_element,base,name,parse_class);
  }

  return base;

}

function parse_css_class(element,css,tabNo){
  let base_tab = '';
  for(let i=0;i<tabNo;i++){base_tab +='\t';}
  let controller_tab = '';
  for(let i=0;i<tabNo+1;i++){controller_tab +='\t';}
  if(Object.keys(element.style.all).length === 0){return;}
  let all = '\n\n' + base_tab + '.' + css + "{";
  for(let itemName in element.style.all){
    if(itemName === "font-family"){
      all += "\n" + controller_tab + itemName + ':"' + element.style.all[itemName] + '";'
    } else {
      all += "\n" + controller_tab + itemName + ':' + element.style.all[itemName] + ';'
    }
  }
  all += "\n" + base_tab + "}";
  let mobile = '\n\n' + base_tab + '.' + css + "{";
  for(let itemName in element.style.browser.mobile){
    if(itemName=== "font-family"){
      mobile += "\n" + controller_tab + itemName + ':"' + element.style.browser.mobile[itemName] + '";'
    } else {
      mobile += "\n" + controller_tab + itemName + ':' + element.style.browser.mobile[itemName] + ';'
    }
  }
  mobile += "\n" + base_tab + "}";
  css_pool.push({all:all,mobile:mobile});
}

function compile_css(){

  let make = '';

  for(let cls of css_pool){
    make += cls.all;
  }

  return make;

}

function display(code){

  const main = engine.make.div({
    parent:'page-router',
    class:'comp-editor-box'
  });

    const menuCont = engine.make.div({
      parent:main,
      class:'comp-editor-box-menu'
    });

      engine.make.image({
        parent:menuCont,
        class:'comp-editor-box-menu-button',
        tyle:'local',
        location:'assets/images/delete.png',
        function:()=>{func(false);}
      });

      engine.make.image({
        parent:menuCont,
        class:'comp-editor-box-menu-button',
        tyle:'local',
        location:'assets/images/save.png',
        function:()=>{
          // if(editor.getSession().getAnnotations().length > 0){
          //   return engine.ui.getComp('mainUi',"alertComp").init("page-router",{
          //     message:'please correct the errors'
          //   });
          // } else {
          //   func(editor.getValue());
          //   return engine.ui.getComp('mainUi',"alertComp").init("page-router",{
          //     message:'saved'
          //   });
          // }
        }
      });

      engine.make.image({
        parent:menuCont,
        class:'comp-editor-box-menu-button',
        tyle:'local',
        location:'assets/images/close.png',
        function:()=>{engine.view.remove(main);}
      });

    const editorCoverCont = engine.make.div({
      parent:main,
      class:'comp-editor-box-editorCover'
    });

    let editorCont = engine.make.div({
      parent:editorCoverCont,
      class:'comp-editor-box-editor'
    });

      let editor = ace.edit(editorCont);
      editor.getSession().setMode('ace/mode/javascript');
      editor.setTheme('ace/theme/twilight');
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
      });
      if(typeof(code) === "string"){editor.setValue(code);}

}
