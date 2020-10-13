

module.exports = (parent,field,data)=>{

  const main = engine.make.div({
    parent:parent,
    class:'comp-form-editor'
  });

    const tag = engine.make.div({
      parent:main,
      class:'comp-form-editor-tag',
      text:field.tag
    });

    const buttonCont = engine.make.div({
      parent:main,
      class:'comp-form-editor-buttonCont'
    });

      engine.make.div({
        parent:buttonCont,
        class:'comp-form-editor-buttonCont-button',
        text:'edit',
        function:()=>{
          make_editBox(field.lang || "text",field.function,data[field.dtag]);
        }
      });

}

function make_editBox(lang,func,value){

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
          if(editor.getSession().getAnnotations().length > 0){
            return engine.ui.getComp('mainUi',"alertComp").init("page-router",{
              message:'please correct the errors'
            });
          } else {
            func(editor.getValue());
            return engine.ui.getComp('mainUi',"alertComp").init("page-router",{
              message:'saved'
            });
          }
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
      if(lang === "js"){editor.getSession().setMode('ace/mode/javascript');}
      if(lang === "json"){editor.getSession().setMode('ace/mode/json');}
      editor.setTheme('ace/theme/twilight');
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
      });
      if(typeof(value) === "string"){editor.setValue(value);}

}
