module.exports = (parent)=>{

  // {
  //   david:{
  //     tag:'text',
  //     name:'David Libre',
  //     location:'http://localhost:5566/assets/fonts/David_Libre/DavidLibre-Medium.ttf'
  //   }
  // }

  engine.global.function.make_section(parent,"fonts");

  function flush_fonts(){
    engine.data.reset("fonts",fonts,"local");
  }

  const main = engine.make.div({
    parent:parent,
    class:'comp-assets-fonts'
  });

  const formCont = engine.make.div({
    parent:main,
    class:'comp-assets-fonts-formCont'
  });

    const form = engine.make.div({
      parent:formCont,
      class:'comp-assets-fonts-formCont-form'
    });

      const tagInput = engine.make.input({
        parent:form,
        class:'comp-assets-fonts-formCont-form-input',
        type:'string',
        placeholder:'font tag'
      });

      const nameInput = engine.make.input({
        parent:form,
        class:'comp-assets-fonts-formCont-form-input',
        type:'string',
        placeholder:'font name'
      });

      const locationInput = engine.make.input({
        parent:form,
        class:'comp-assets-fonts-formCont-form-input',
        type:'string',
        placeholder:'font location'
      });

      engine.make.div({
        parent:form,
        class:'comp-assets-fonts-formCont-form-button',
        text:'submit',
        function:()=>{
          let name = engine.binder.value(nameInput);
          let tag = engine.binder.value(tagInput);
          let location = engine.binder.value(locationInput);
          if(name.length === 0 || tag.length === 0 || location.length === 0){
            return engine.ui.getComp("mainUi","alertComp").init(parent,{
              message:'please provide a valid name tag and location.'
            });
          }
          fonts[tag] = {name:name,tag:tag,location:location};
          flush_fonts();
          make_row(getListCont(),name,tag,location);
        }
      });

  let listCont,noFontsCont;
  if(Object.keys(fonts).length > 0){
    for(let fontName in fonts){
      let font = fonts[fontName];
      make_row(getListCont(),font.name,font.tag,font.location);
    }
  } else {
    makeNoFontsCont();
  }

  function makeNoFontsCont(){
    noFontsCont = engine.make.div({
      parent:main,
      class:'comp-assets-fonts-noFontsCont',
      text:'please add some fonts'
    });
  }

  function getListCont(){
    if(!listCont){
      listCont = engine.make.div({
        parent:main,
        class:'comp-assets-fonts-listCont'
      });
    }
    return listCont;
  }

  function make_row(parent,name,tag,location){

    if(noFontsCont){
      engine.view.remove(noFontsCont);
      noFontsCont = null;
    }

    engine.sketch.fonts.add(tag,name,location,null,true);

    const row = engine.make.div({
      parent:parent,
      class:'comp-assets-fonts-listCont-item'
    });

      engine.make.div({
        parent:row,
        class:'comp-assets-fonts-listCont-item-name',
        text:name,
        draw:{
          all:{
            'font-family':name
          }
        }
      });

      engine.make.div({
        parent:row,
        class:'comp-assets-fonts-listCont-item-tag',
        text:tag,
        draw:{
          all:{
            'font-family':name
          }
        }
      });

      const deleteCont = engine.make.div({
        parent:row,
        class:'comp-assets-fonts-listCont-item-deleteCont'
      });

        engine.make.image({
          parent:deleteCont,
          class:'comp-assets-fonts-listCont-item-deleteCont-img',
          type:'local',
          location:'assets/images/delete.png',
          function:()=>{
            engine.view.remove(row);
            if(Object.keys(fonts).length === 1){engine.view.remove(listCont);listCont=null;makeNoFontsCont();}
            delete fonts[tag];
            flush_fonts();
          }
        });

  }

}
