

module.exports = (parent,active,show)=>{

  const base = engine.make.div({
    parent:parent,
    class:'comp-builder-position-position'
  });

  const main = engine.global.function.make_styler_section(base,'position',show,"position_styler_section");

  engine.global.comp.formComp.init(main,{
    data:active_platform === "mobile" ? active.style.browser.mobile : active.style.all,
    form:[
      //display
      {type:'select',tag:'display',dtag:'display',options:[
        {text:'none',value:'none'},
        {text:'flex',value:'flex'},
        {text:'block',value:'block'},
        {text:'inline',value:'inline'},
        {text:'grid',value:'grid'},
        {text:'inline-block',value:'inline-block'},
        {text:'contents',value:'contents'},
        {text:'delete',value:'delete'},
      ],function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("display");} else {
          engine.global.function.add_style("display",v);
        }
      }},
      {type:'single',tag:'custom display',dtag:'display',placeholder:'custom display',function:(v)=>{
        if(!v){engine.global.function.remove_style("display");} else {
          engine.global.function.add_style("display",v);
        }
      }},
    ]
  });

  engine.global.comp.formComp.init(main,{
    data:active_platform === "mobile" ? active.style.browser.mobile : active.style.all,
    form:[
      //flex
      {type:'select',tag:'flex',dtag:'flex',options:[
        {text:'none',value:'none'},
        {text:'auto',value:'auto'},
        {text:'inherit',value:'inherit'},
        {text:'delete',value:'delete'},
      ],function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("flex");} else {
          engine.global.function.add_style("flex",v);
        }
      }},
      {type:'single',tag:'custom flex',dtag:'flex',placeholder:'custom flex',function:(v)=>{
        if(!v){engine.global.function.remove_style("flex");} else {
          engine.global.function.add_style("flex",v);
        }
      }},
    ]
  });

  engine.global.comp.formComp.init(main,{
    data:active_platform === "mobile" ? active.style.browser.mobile : active.style.all,
    form:[
      //position
      {type:'select',tag:'position',dtag:'position',options:[
        {text:'static',value:'static'},
        {text:'absolute',value:'absolute'},
        {text:'fixed',value:'fixed'},
        {text:'relative',value:'relative'},
        {text:'sticky',value:'sticky'},
        {text:'initial',value:'initial'},
        {text:'inherit',value:'inherit'},
        {text:'delete',value:'delete'},
      ],function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("position");} else {
          engine.global.function.add_style("position",v);
        }
      }},
      {type:'single_select',tag:'top',dtag:'top',placeholder:'top',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("top");} else {
          engine.global.function.add_style("top",v.input + v.select);
        }
      }},
      {type:'single_select',tag:'bottom',dtag:'bottom',placeholder:'bottom',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("bottom");} else {
          engine.global.function.add_style("bottom",v.input + v.select);
        }
      }},
      {type:'single_select',tag:'left',dtag:'left',placeholder:'left',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("left");} else {
          engine.global.function.add_style("left",v.input + v.select);
        }
      }},
      {type:'single_select',tag:'right',dtag:'right',placeholder:'right',options:[
        {text:'px',value:'px'},
        {text:'vh',value:'vh'},
        {text:'vw',value:'vw'},
        {text:'em',value:'em'}
      ],function:(v)=>{
        if(!v){engine.global.function.remove_style("right");} else {
          engine.global.function.add_style("right",v.input + v.select);
        }
      }},
    ]
  });

  engine.global.comp.formComp.init(main,{
    data:active_platform === "mobile" ? active.style.browser.mobile : active.style.all,
    form:[
      //overflow
      {type:'select',tag:'overflow',dtag:'overflow',options:[
        {text:'auto',value:'auto'},
        {text:'hidden',value:'hidden'},
        {text:'scroll',value:'scroll'},
        {text:'visible',value:'visible'},
        {text:'delete',value:'delete'}
      ],function:(v)=>{
        if(v === "delete"){engine.global.function.remove_style("overflow");} else {
          engine.global.function.add_style("overflow",v);
        }
      }},
      {type:'single',tag:'overflow x',dtag:'overflow-x',placeholder:'overflow-x',function:(v)=>{
        if(!v){engine.global.function.remove_style("overflow-x");} else {
          engine.global.function.add_style("overflow-x",v);
        }
      }},
      {type:'single',tag:'overflow y',dtag:'overflow-y',placeholder:'overflow-y',function:(v)=>{
        if(!v){engine.global.function.remove_style("overflow-y");} else {
          engine.global.function.add_style("overflow-y",v);
        }
      }}
    ]
  });

}

function make_options_colors(obj){
  let collect = [];
  for(let key in obj){
    collect.push({text:key,value:obj[key]});
  }
  return collect;
}
