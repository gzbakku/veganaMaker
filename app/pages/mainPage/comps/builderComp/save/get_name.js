

module.exports = ()=>{

  return new Promise((resolve,reject)=>{

    const main = engine.make.div({
      parent:'page-router',
      class:'comp-builder-save',
    });

    const card = engine.ui.getComp("mainUi","cardComp").init(main,{
      title:'view name',
      closeFunction:()=>{
        reject();
      }
    });

    const form = engine.make.div({
      parent:card,
      class:'comp-builder-save-form'
    });

    const nameInput = engine.make.input({
      parent:form,
      class:'comp-builder-save-form-input',
      type:'string',
      placeholder:'vegana view name'
    });

    engine.make.div({
      parent:form,
      class:'comp-builder-save-form-button',
      text:'submit',
      function:()=>{
        if(engine.binder.value(nameInput)){
          let val = engine.binder.value(nameInput);
          engine.view.remove(main);
          resolve(val);
        } else {
          engine.ui.getComp('mainUi','alertComp').init(main,{
            messsage:'please provide a name.'
          });
        }
      }
    });

  });

}
