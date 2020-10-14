

module.exports = (parent)=>{

  engine.global.function.make_section(parent,"host location");

  const main = engine.make.div({
    parent:parent,
    class:'comp-assets-host'
  });

  const field = engine.make.div({
    parent:main,
    class:'comp-assets-host-field'
  });

    const input = engine.make.input({
      parent:field,
      class:'comp-assets-host-field-input',
      placeholder:'host url',
      value:engine.data.get('host','local')
    });

    engine.make.div({
      parent:field,
      class:'comp-assets-host-field-button',
      text:'update',
      function:()=>{
        let val = engine.binder.value(input);
        if(!val || val.length === 0){
          return engine.ui.getComp("mainUi","alertComp").init(main,{
            message:'please provide a valid host address where all assets are hosted'
          });
        }
        if(val[val.length - 1] !== "/"){val += "/";}
        engine.data.reset("host",val,"local");
        return engine.ui.getComp("mainUi","alertComp").init(main,{
          message:'host location updated'
        });
      }
    });

}
