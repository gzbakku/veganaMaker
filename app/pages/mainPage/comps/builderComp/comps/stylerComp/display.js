

module.exports = async (parent,active,show)=>{

  const base = engine.make.div({
    parent:parent,
    class:'comp-builder-styler-display'
  });

  const main = engine.global.function.make_styler_section(base,'display',show,"display_styler_section");

  // console.log(active.style.all);

  await engine.global.comp.formComp.init(main,{
    data:active_platform === "mobile" ? active.style.browser.mobile : active.style.all,
    form:[
      {type:'single_select',tag:'height',dtag:'height',placeholder:'height',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'},
        {text:'%',value:'%'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("height");} else {
          engine.global.function.add_style("height",v.input + v.select);
        }
      }},
      {type:'single_select',tag:'width',dtag:'width',placeholder:'width',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'},
        {text:'%',value:'%'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("width");} else {
          engine.global.function.add_style("width",v.input + v.select);
        }
      }},
      {type:'4withSelect',tag:'margin',a:'left',b:'right',c:'top',d:'bottom',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],dtagA:'margin-left',dtagB:'margin-right',dtagC:'margin-top',dtagD:'margin-bottom',function:(v)=>{
        if(active_platform === "mobile"){
          if(v.a){active.style.browser.mobile["margin-left"] = v.a + v.select;} else {
            delete active.style.browser.mobile["margin-left"];
          }
          if(v.b){active.style.browser.mobile["margin-right"] = v.b + v.select;} else {
            delete active.style.browser.mobile["margin-right"];
          }
          if(v.c){active.style.browser.mobile["margin-top"] = v.c + v.select;} else {
            delete active.style.browser.mobile["margin-top"];
          }
          if(v.d){active.style.browser.mobile["margin-bottom"] = v.d + v.select;} else {
            delete active.style.browser.mobile["margin-bottom"];
          }
        } else {
          if(v.a){active.style.all["margin-left"] = v.a + v.select;} else {
            delete active.style.all["margin-left"];
          }
          if(v.b){active.style.all["margin-right"] = v.b + v.select;} else {
            delete active.style.all["margin-right"];
          }
          if(v.c){active.style.all["margin-top"] = v.c + v.select;} else {
            delete active.style.all["margin-top"];
          }
          if(v.d){active.style.all["margin-bottom"] = v.d + v.select;} else {
            delete active.style.all["margin-bottom"];
          }
        }
        engine.global.function.flush_style(active.style);
      }},
      {type:'select',tag:'margin',dtag:'margin',options:[
        {text:'auto',value:'auto'},{text:'inherit',value:'inherit'},{text:'delete',value:'delete'}
      ],function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("margin");} else {
          engine.global.function.add_style("margin",v);
        }
      }},
      {type:'align',tag:'float',function:(v)=>{
        let p = v === "l" ? "left" : v === "c" ? "center" : v === "r" ? "right" : "center";
        engine.global.function.add_style("float",p);
      }}
    ]
  });

}

function make_options_colors(obj){
  let collect = [];
  for(let key in obj){
    collect.push({text:key,value:obj[key]});
  }
  collect.push({text:'delete',value:'delete'});
  return collect;
}
