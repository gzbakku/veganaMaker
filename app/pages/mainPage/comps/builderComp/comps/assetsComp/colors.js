

module.exports = (parent)=>{

  function flush_color(){
    engine.data.reset("colors",colors,"local");
  }

  const main = engine.make.div({
    parent:parent,
    class:'comp-assets-colors'
  });

  engine.global.function.make_section(main,"colors");

  const newCont = engine.make.div({
    parent:main,
    class:'comp-assets-colors-new'
  });

    const colorNameInput = engine.make.input({
      parent:newCont,
      class:'comp-assets-colors-new-input_name',
      type:'string',
      placeholder:'color name'
    });

    const colorInputCont = engine.make.div({
      parent:newCont,
      class:'comp-assets-colors-new-inputColorCont'
    });

      const colorInput = engine.make.input({
        parent:colorInputCont,
        class:'comp-assets-colors-new-input_color',
        type:'color',
        // value:'#75b8ff'
      });

    engine.make.div({
      parent:newCont,
      class:'comp-assets-colors-new-button',
      text:'submit',
      function:()=>{
        let name = engine.binder.value(colorNameInput);
        let color = engine.binder.value(colorInput);
        if(!name || name.length === 0){
          engine.ui.getComp("mainUi","alertComp").init(parent,{
            message:'please provide a valid name'
          });
          return;
        }
        colors[name] = color;
        make_color_row(get_listCont(),name,color);
        flush_color();
      }
    });

  let listCont,noColorsCont;
  if(Object.keys(colors).length > 0){
    listCont = get_listCont();
    for(let color in colors){
      make_color_row(listCont,color,colors[color]);
    }
  } else {
    makeNoColorsCont();
  }

  function makeNoColorsCont(){
    if(!noColorsCont){
      noColorsCont = engine.make.div({
        parent:main,
        class:'comp-assets-colors-noColorsCont',
        text:'please add some colors above'
      });
    }
  }

  function get_listCont(){
    if(!listCont){
      listCont = engine.make.div({
        parent:main,
        class:'comp-assets-colors-list'
      });
    }
    return listCont;
  }

  function make_color_row(parent,name,color){

    if(noColorsCont){
      engine.view.remove(noColorsCont);
      noColorsCont = null;
    }

    const row = engine.make.div({
      parent:parent,
      class:'comp-assets-colors-list-item'
    });

      engine.make.div({
        parent:row,
        class:'comp-assets-colors-list-item-name',
        text:name
      });

      const colorCont = engine.make.div({
        parent:row,
        class:'comp-assets-colors-list-item-color'
      });

        engine.make.div({
          parent:colorCont,
          class:'comp-assets-colors-list-item-color-display',
          draw:{
            all:{
              "background-color":color
            }
          }
        });

      const deleteCont = engine.make.div({
        parent:row,
        class:'comp-assets-colors-list-item-delete'
      });

        engine.make.image({
          parent:deleteCont,
          class:'comp-assets-colors-list-item-delete-img',
          type:'local',
          location:'assets/images/delete.png',
          function:()=>{
            engine.view.remove(row);
            if(Object.keys(colors).length === 1){engine.view.remove(listCont);listCont=null;makeNoColorsCont();}
            delete colors[name];
            flush_color();
          }
        });

  }

}
