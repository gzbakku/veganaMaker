//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-form';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,form) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  return build(form);                      //start build you can also start fetch here.

}

let loaded = false;

function build(form){

  if(!form.data){form.data = {};}

  // if(!loaded){
  //   await engine.loader.css("nano.min.css")
  //   .catch(()=>{console.log("!!! failed-load-form-css");return false;})
  //   await engine.loader.load.js({type:'local',url:'pickr.min.js'})
  //   .catch(()=>{console.log("!!! failed-load-form_js");return false;});
  //   loaded = true;
  // }

  let main = engine.make.div({
    parent:compId,
    class:'comp-builder-form'
  });

  for(let field of form.form){

    let fieldCont = engine.make.div({
      parent:main,
      class:'comp-builder-form-field'
    });

    const tag = engine.make.div({
      parent:fieldCont,
      class:'comp-builder-form-field_tag',
      text:field.tag
    });

    const flusher = engine.make.div({
      parent:fieldCont,
      class:'comp-builder-form-field_flush',
    });

    engine.view.hide(flusher);

      engine.make.div({
        parent:flusher,
        class:'comp-builder-form-field_flush-yes',
        text:'&#10003;',
        function:()=>{
          close_flusher(get());
        }
      });

      engine.make.div({
        parent:flusher,
        class:'comp-builder-form-field_flush-no',
        text:'x',
        function:()=>{
          engine.view.remove(main);
          build(form);
        }
      });

    function close_flusher(val){
      if(get() === false){return;}
      showing_flush = false;
      engine.view.hide(flusher);
      engine.view.show(tag);
      if(field.function){
        field.function(val);
      }
    }

    let showing_flush = false;
    function enable_flusher(){
      if(showing_flush){return;} else {
        engine.view.hide(tag);
        engine.view.show(flusher);
        showing_flush = true;
      }
    }

    let inputCont = engine.make.div({
      parent:fieldCont,
      class:'comp-builder-form-field_input'
    });

    let get;

    if(field.type === "single"){
      let input = engine.make.input({
        type:field.itype,
        parent:inputCont,
        class:'comp-builder-form-field_input-input',
        placeholder:field.placeholder,
        function:()=>{
          enable_flusher();
        },
        value:form.data[field.dtag]
      });
      get = ()=>{
        return engine.binder.value(input) || null;
      }
    }

    if(field.type === "single_select"){
      let ival,sval;
      if(form.data[field.dtag]){
        for(let opt of field.options){
          if(form.data[field.dtag].indexOf(opt.value) >= 0){
            sval = opt.value;
            ival = form.data[field.dtag].replace(opt.value,"");
            break;
          }
        }
      }
      let input = engine.make.input({
        type:field.itype,
        parent:inputCont,
        class:'comp-builder-form-field_input-options_input',
        placeholder:field.placeholder,
        function:()=>{
          enable_flusher();
        },
        value:ival
      });
      let select = engine.make.select({
        parent:inputCont,
        class:'comp-builder-form-field_input-options_select',
        optionsClass:'comp-builder-form-select-option',
        options:field.options,
        function:()=>{
          if(!engine.binder.value(input)){return;}
          enable_flusher();
        },
        value:sval
      });
      get = ()=>{
        if(!engine.binder.value(input)){return null;}
        return {
          input:engine.binder.value(input),
          select:engine.binder.value(select)
        };
      }
    }

    if(field.type === "select"){
      let input = engine.make.select({
        parent:inputCont,
        class:'comp-builder-form-field_input-select',
        options:field.options,
        value:form.data[field.dtag],
        optionsClass:'comp-builder-form-select-option',
        function:()=>{
          enable_flusher();
        }
      });
      get = ()=>{
        return engine.binder.value(input);
      }
    }

    if(field.type === "textarea"){
      let input = engine.make.textarea({
        parent:inputCont,
        class:'comp-builder-form-textarea',
        rows:5,
        placeholder:field.placeholder,
        function:()=>{
          enable_flusher();
        },
        value:field.ptype === "object" ? parse_object(form.data[field.dtag]) : form.data[field.dtag]
      });
      get = ()=>{
        let v = engine.binder.value(input);
        if(!v){return null;}
        if(field.ptype === "object" && v.indexOf("...") < 0){
          let failed = false;
          if(v.indexOf(",") < 0 && v.indexOf(":") < 0){failed = true;}
          let collect = {};
          for(let i of v.split(",")){
            if(i.length > 0){
              let h = i.split(":");
              if(h.length !== 2){failed = true;break;} else {collect[h[0]] = h[1];}
            }
          }
          if(failed){
            engine.ui.getComp('mainUi','alertComp').init(compId,{
              message:'please correct the params input with format of \r\n \r\n text_1:val_1,text_2:val_2'
            });
            return false;
          } else {return collect}
        }
        return v;
      }
    }

    if(field.type === "switch"){
      engine.view.remove(inputCont);
        inputCont = engine.make.div({
          parent:fieldCont,
          class:'comp-builder-form-field_input_switch'
        });
          let open = false;
          let box_class = 'comp-builder-form-field_input_switch-box';
          if(form.data[field.dtag]){
            box_class += " comp-builder-form-field_input_switch-box_open";
            open = true;
          }
          const box = engine.make.div({
            parent:inputCont,
            class:box_class,
            function:()=>{
              if(open){
                open = false;
                engine.make.removeClass({id:box,class:'comp-builder-form-field_input_switch-box_open'});
              } else {
                open = true;
                engine.make.addClass({id:box,class:'comp-builder-form-field_input_switch-box_open'});
              }
              if(field.function){
                field.function(open);
              }
            }
          });
            engine.make.div({
              parent:box,
              class:"card comp-builder-form-field_input_switch-ball"
            });
    }//switch

    if(field.type === "4withSelect"){
      engine.view.remove(fieldCont);
      get = require('./4withSelect.js')(main,field,form.data);
    }//4withSelect

    if(field.type === "align"){
      engine.view.remove(fieldCont);
      get = require('./align.js')(main,field,form.data);
    }//align

    if(field.type === "editor"){
      engine.view.remove(fieldCont);
      require('./editor.js')(main,field,form.data);
    }

  }//element loop

}

function parse_object(v){
  if(!v){return v;} else
  if(typeof(v) === "string"){if(v.indexOf("...") >= 0){return v;}}
  let collect = "";
  for(let key in v){
    collect += key + ":" + v[key] + ",";
  }
  return collect;
}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
