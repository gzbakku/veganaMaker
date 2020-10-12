

module.exports = run;

function run(parent,field,data,base){

  if(!base){
    base = engine.make.div({
      parent:parent,
      class:'comp-form-4withselect-mainBase'
    });
  }

  const main = engine.make.div({
    parent:base,
    class:'comp-form-4withselect-main'
  });

    const top = engine.make.div({
      parent:main,
      class:'comp-form-4withselect-main-top'
    });

      const tag = engine.make.div({
        parent:top,
        class:'comp-form-4withselect-main-top-tag',
        text:field.tag
      });

      const flusher = engine.make.div({
        parent:top,
        class:'comp-form-4withselect-main-top-flusher'
      });

      let flush_enabled = false;
      function enable_flusher(){
        if(!flush_enabled){
          flush_enabled = true;
          engine.view.show(flusher);
          engine.view.hide(tag);
        }
      }

      engine.view.hide(flusher);

        const flusherCont = engine.make.div({
          parent:flusher,
          class:'comp-form-4withselect-main-top-flusher-cont'
        });

          engine.make.div({
            parent:flusherCont,
            class:'comp-form-4withselect-main-top-flusher-cont-yes',
            text:'&#10003;',
            function:()=>{flush();}
          });

          engine.make.div({
            parent:flusherCont,
            class:'comp-form-4withselect-main-top-flusher-cont-no',
            text:'x',
            function:()=>{
              engine.view.remove(main);
              run(parent,field,data,base);
            }
          });

      const selectCont = engine.make.div({
        parent:top,
        class:'comp-form-4withselect-main-top-select'
      });

        let selectValue;
        for(let option of field.options){
          if(data[field.dtagA]){if(data[field.dtagA].indexOf(option.value) >= 0){selectValue = option.value;break;}}
          if(data[field.dtagB]){if(data[field.dtagB].indexOf(option.value) >= 0){selectValue = option.value;break;}}
          if(data[field.dtagC]){if(data[field.dtagC].indexOf(option.value) >= 0){selectValue = option.value;break;}}
          if(data[field.dtagD]){if(data[field.dtagD].indexOf(option.value) >= 0){selectValue = option.value;break;}}
        }

        const select = engine.make.select({
          parent:selectCont,
          class:'comp-form-4withselect-main-top-select-input',
          options:field.options,
          value:selectValue,
          function:()=>{
            enable_flusher();
          }
        });

    const bottom = engine.make.div({
      parent:main,
      class:'comp-form-4withselect-main-bottom'
    });

    let readers = {};
    for(let item of [
      {tag:'a',placeholder:field.a,dtag:field.dtagA},
      {tag:'b',placeholder:field.b,dtag:field.dtagB},
      {tag:'c',placeholder:field.c,dtag:field.dtagC},
      {tag:'d',placeholder:field.d,dtag:field.dtagD},
    ]){
      let inputValue;
      if(data[item.dtag]){inputValue = data[item.dtag].replace(selectValue,'');}
      const input = engine.make.input({
        parent:bottom,
        class:'comp-form-4withselect-main-bottom-input',
        placeholder:item.placeholder,
        value:inputValue,
        function:()=>{
          enable_flusher();
        }
      });
      readers[item.tag] = input;
    }

    function flush(){
      if(field.function){
        field.function({
          select:engine.binder.value(select),
          a:engine.binder.value(readers.a),
          b:engine.binder.value(readers.b),
          c:engine.binder.value(readers.c),
          d:engine.binder.value(readers.d),
        });
      }
    };

}
