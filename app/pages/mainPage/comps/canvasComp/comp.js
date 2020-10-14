//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-canvas';             //dont worry about this
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

  let main = engine.make.div({
    parent:compId,
    class:'comp-canvas-main',
  });

  engine.add.function("draw",()=>{
    engine.view.remove(main);
    build();
  });

  draw_element(main,builder,"",{});

}

function draw_element(parent,element,nameCollection,elementIdCollection){

  let make;
  if(element.type === "div"){
    if(element.should_loop){
      if(element.loop_array && element.loop_array.length > 0){
        // console.log(eval(element.controllers.function)());
        for(let item of JSON.parse(element.loop_array)){
          // console.log(item);
          const local_make = engine.make.div({
            parent:parent,
            draw:element.style,
            text:extract_from_json(element.controllers.text,item),
            function:(i,v)=>{
              if(typeof(eval(element.controllers.function)) !== "function"){return;}
              eval(element.controllers.function)(i,v,item);
            }
          });
          // console.log(local_make);
          if(element.track){
            elementIdCollection[extract_from_json(element.track,item)] = local_make;
          }
        }
      }
    } else {
      make = engine.make.div({
        parent:parent,
        draw:element.style,
        text:element.controllers.text,
        function:(i,v)=>{
          if(typeof(eval(element.controllers.function)) !== "function"){return;}
          eval(element.controllers.function)(i,v);
        }
      });
    }
  }

  if(element.type === "image"){



    if(element.should_loop){
      if(element.loop_array && element.loop_array.length > 0){
        for(let item of JSON.parse(element.loop_array)){
          const lock = element.controllers.type === "local" ?
          window.host + extract_from_json(element.controllers.location,item) : element.controllers.location;
          const local_make = engine.make.image({
            parent:parent,
            draw:element.style,
            type:"url",
            location:lock,
            function:(i,v)=>{
              if(typeof(eval(element.controllers.function)) !== "function"){return;}
              eval(element.controllers.function)(i,v,item);
            }
          });
          if(element.track){
            elementIdCollection[extract_from_json(element.track,item)] = local_make;
          }
        }
      }
    } else {
      const lock = element.controllers.type === "local" ? window.host + element.controllers.location : element.controllers.location;
      make = engine.make.image({
        parent:parent,
        draw:element.style,
        type:"url",
        location:lock,
        function:(i,v)=>{
          if(typeof(eval(element.controllers.function)) !== "function"){return;}
          eval(element.controllers.function)(i,v);
        }
      });
    }
  }

  if(element.type === "href"){
    if(element.should_loop){
      if(element.loop_array && element.loop_array.length > 0){
        for(let item of JSON.parse(element.loop_array)){
          const local_make = engine.make.a({
            parent:parent,
            draw:element.style,
            type:element.controllers.type,
            href:extract_from_json(element.controllers.href,item),
            page:extract_from_json(element.controllers.page,item),
            cont:extract_from_json(element.controllers.cont,item),
            panel:extract_from_json(element.controllers.panel,item),
            params:extract_from_json(element.controllers.params,item),
            text:extract_from_json(element.controllers.text,item),
            baseFunction:typeof(eval(element.controllers.superFunction)) === "function" ? (i,v)=>{
              eval(element.controllers.superFunction)(i,v,item);
            } : null,
            superFunction:typeof(eval(element.controllers.superFunction)) === "function" ? (i,v)=>{
              eval(element.controllers.superFunction)(i,v,item);
            } : null
          });
          if(element.track){
            elementIdCollection[extract_from_json(element.track,item)] = local_make;
          }
        }
      }
    } else {
      make = engine.make.a({
        parent:parent,
        draw:element.style,
        type:element.controllers.type,
        href:element.controllers.href,
        page:element.controllers.page,
        cont:element.controllers.cont,
        panel:element.controllers.panel,
        params:element.controllers.params,
        text:element.controllers.text,
        baseFunction:typeof(eval(element.controllers.superFunction)) === "function" ? (i,v)=>{
          eval(element.controllers.superFunction)(i,v);
        } : null,
        superFunction:typeof(eval(element.controllers.superFunction)) === "function" ? (i,v)=>{
          eval(element.controllers.superFunction)(i,v);
        } : null
      });
    }
  }

  if(element.type === "input"){
    if(element.controllers.type !== "select" && element.controllers.type !== "textarea"){//all inputs
      if(element.should_loop){
        if(element.loop_array && element.loop_array.length > 0){
          for(let item of JSON.parse(element.loop_array)){
            const local_make = engine.make.input({//non select
              parent:parent,
              draw:element.style,
              type:element.controllers.type,
              value:extract_from_json(element.controllers.value,item),
              placeholder:extract_from_json(element.controllers.placeholder,item),
              function:(i,v)=>{
                if(typeof(eval(element.controllers.function)) !== "function"){return;}
                eval(element.controllers.function)(i,v,item);
              }
            });
            if(element.track){
              elementIdCollection[extract_from_json(element.track,item)] = local_make;
            }
          }
        }
      } else {
        make = engine.make.input({//non select non loop
          parent:parent,
          draw:element.style,
          type:element.controllers.type,
          value:element.controllers.options,
          placeholder:element.controllers.placeholder,
          function:(i,v)=>{
            if(typeof(eval(element.controllers.function)) !== "function"){return;}
            eval(element.controllers.function)(i,v);
          }
        });
      }
    } else if(element.controllers.type === "textarea"){
      if(element.should_loop){//looping select
        if(element.loop_array && element.loop_array.length > 0){
          for(let item of JSON.parse(element.loop_array)){
            const local_make = engine.make.textarea({
              parent:parent,
              draw:element.style,
              value:extract_from_json(element.controllers.value,item),
              rows:element.controllers.rows,
              placeholder:extract_from_json(element.controllers.placeholder,item),
              function:(i,v)=>{
                if(typeof(eval(element.controllers.function)) !== "function"){return;}
                eval(element.controllers.function)(i,v,item);
              }
            });
            if(element.track){
              elementIdCollection[extract_from_json(element.track,item)] = local_make;
            }//track element
          }//loop array items
        }//loop array present
      } else {
        engine.make.textarea({
          parent:parent,
          draw:element.style,
          value:element.controllers.value,
          rows:element.controllers.rows,
          placeholder:element.controllers.placeholder,
          function:(i,v)=>{
            if(typeof(eval(element.controllers.function)) !== "function"){return;}
            eval(element.controllers.function)(i,v);
          }
        });
      }//non looping
    } else if(element.controllers.type === "select") {//only select input
      if(element.should_loop){//looping select
        if(element.loop_array && element.loop_array.length > 0){
          for(let item of JSON.parse(element.loop_array)){
            let options = [];
            if(element.controllers.options){
              let extract = extract_from_json(element.controllers.options,item);
              for(let key in extract){
                options.push({text:key,value:extract[key]});
              }
            }
            const local_make = engine.make.select({
              parent:parent,
              draw:element.style,
              value:extract_from_json(element.controllers.value,item),
              options:options,
              function:(i,v)=>{
                if(typeof(eval(element.controllers.function)) !== "function"){return;}
                eval(element.controllers.function)(i,v,item);
              }
            });
            if(element.track){
              elementIdCollection[extract_from_json(element.track,item)] = local_make;
            }//track element
          }//loop array items
        }//loop array present
      } else {
        let options = [];
        if(element.controllers.options){
          for(let key in element.controllers.options){
            options.push({text:key,value:element.controllers.options[key]});
          }
        }
        engine.make.select({
          parent:parent,
          draw:element.style,
          type:element.controllers.type,
          value:element.controllers.value,
          options:options,
          function:(i,v)=>{
            if(typeof(eval(element.controllers.function)) !== "function"){return;}
            eval(element.controllers.function)(i,v);
          }
        });
      }//non looping
    }//select input
  }//input element

  if(element.track){
    elementIdCollection[element.track] = make;
  }

  if(Object.keys(element.children).length > 0){
    for(let key in element.children){
      let trackers = draw_element(
        make,element.children[key],
        nameCollection.length > 0 ? nameCollection += "-" + element.name : element.name,
        elementIdCollection
      );
      for(let key in trackers){
        elementIdCollection[key] = trackers[key];
      }
    }
  }

  return elementIdCollection;

}

function extract_from_json(tree,obj){
  if(!tree){return null} else if(typeof(tree) !== "string"){return tree;} else
  if(tree.indexOf("...") < 0){return tree;} else {
    let val = obj;
    for(let h of tree.split("...")){
      if(h.length > 0){
        if(!val.hasOwnProperty(h)){break;} else {
          val = val[h];
        }
      }
    }
    return val;
  }
}

module.exports = {init:init,ref:compRef,type:type,trackers:false}
