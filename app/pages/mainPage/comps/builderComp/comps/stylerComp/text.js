

module.exports = async (parent,active,show)=>{

  const base = engine.make.div({
    parent:parent,
    class:'comp-builder-styler-text'
  });

  const main = engine.global.function.make_styler_section(base,'text',show,"text_styler_section");

  await engine.global.comp.formComp.init(main,{
    data:active_platform === "mobile" ? active.style.browser.mobile : active.style.all,
    form:[
      {type:'single_select',tag:'padding',dtag:'padding',placeholder:'padding',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("padding");} else {
          engine.global.function.add_style("padding",v.input + v.select);
        }
      }},
      {type:'4withSelect',tag:'padding',a:'left',b:'right',c:'top',d:'bottom',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],dtagA:'padding-left',dtagB:'padding-right',dtagC:'padding-top',dtagD:'padding-bottom',function:(v)=>{
        if(active_platform === "mobile"){
          if(v.a){active.style.browser.mobile["padding-left"] = v.a + v.select;} else {
            delete active.style.browser.mobile["padding-left"];
          }
          if(v.b){active.style.browser.mobile["padding-right"] = v.b + v.select;} else {
            delete active.style.browser.mobile["padding-right"];
          }
          if(v.c){active.style.browser.mobile["padding-top"] = v.c + v.select;} else {
            delete active.style.browser.mobile["padding-top"];
          }
          if(v.d){active.style.browser.mobile["padding-bottom"] = v.d + v.select;} else {
            delete active.style.browser.mobile["padding-bottom"];
          }
        } else {
          if(v.a){active.style.all["padding-left"] = v.a + v.select;} else {
            delete active.style.all["padding-left"];
          }
          if(v.b){active.style.all["padding-right"] = v.b + v.select;} else {
            delete active.style.all["padding-right"];
          }
          if(v.c){active.style.all["padding-top"] = v.c + v.select;} else {
            delete active.style.all["padding-top"];
          }
          if(v.d){active.style.all["padding-bottom"] = v.d + v.select;} else {
            delete active.style.all["padding-bottom"];
          }
        }
        engine.global.function.flush_style(active.style);
      }},
      {type:'align',tag:'text-align',function:(v)=>{
        let p = v === "l" ? "left" : v === "c" ? "center" : v === "r" ? "right" : "center";
        engine.global.function.add_style("text-align",p);
      }},
      {type:'select',tag:'font-family',options:make_options_fonts(fonts),function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("font-family");} else {
          engine.global.function.add_style("font-family",engine.sketch.fonts.get(v));
        }
      }},
      {type:'select',tag:'font-color',options:make_options_colors(colors),function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("color");} else {
          engine.global.function.add_style("color",v);
        }
      }},
      {type:'single_select',tag:'font-size',dtag:'font-size',placeholder:'font-size',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("font-size");} else {
          engine.global.function.add_style("font-size",v.input + v.select);
        }
      }},
      {type:'select',tag:'background-color',dtag:'background-color',options:make_options_colors(colors),function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("background-color");} else {
          engine.global.function.add_style("background-color",v);
        }
      }}
    ]
  });

}

function make_options_fonts(obj){
  let collect = [];
  for(let key in obj){
    collect.push({text:key,value:obj[key].tag});
  }
  collect.push({text:'delete',value:'delete'});
  return collect;
}

function make_options_colors(obj){
  let collect = [];
  for(let key in obj){
    collect.push({text:key,value:obj[key]});
  }
  collect.push({text:'delete',value:'delete'});
  return collect;
}
