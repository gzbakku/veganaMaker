

module.exports = (parent,field)=>{

  const main = engine.make.div({
    parent:parent,
    class:'comp-form-align-main'
  });

  engine.make.div({
    parent:main,
    class:'comp-form-align-main-tag',
    text:field.tag
  });

  const inputCont = engine.make.div({
    parent:main,
    class:'comp-form-align-main-inputCont'
  });

  for(let item of ['l','c','r']){
    engine.make.div({
      parent:inputCont,
      class:'comp-form-align-main-inputCont-button',
      text:item,
      function:()=>{
        if(field.function){
          field.function(item);
        }
      }
    });
  }

}
