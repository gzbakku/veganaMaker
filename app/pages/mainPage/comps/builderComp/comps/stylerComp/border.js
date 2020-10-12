

if(!engine.data.get("test_border_colors",'local')){
  engine.data.reset("test_border_colors",['red','blue','green','purple','yellow','black'],'local');
}
let test_border_colors = engine.data.get("test_border_colors",'local');
let last_border_test_color = 0;
function get_border_color(){
  if(last_border_test_color === test_border_colors.length - 1){
    last_border_test_color = 0;
    return test_border_colors[0];
  } else {
    last_border_test_color++;
    return test_border_colors[last_border_test_color - 1];
  }
}

module.exports = async (parent,active,show)=>{

  const base = engine.make.div({
    parent:parent,
    class:'comp-builder-border-position'
  });

  const main = engine.global.function.make_styler_section(base,'border',show,"border_styler_section");

  await engine.global.comp.formComp.init(main,{
    data:active_platform === "mobile" ? active.style.browser.mobile : active.style.all,
    form:[
      {type:'switch',tag:'test border',dtag:'border',function:(v)=>{
        if(!v){engine.global.function.remove_style("border");} else {
          engine.global.function.add_style("border","5px solid " + get_border_color());
        }
      }},
      {type:'single_select',tag:'border-all',dtag:'border',options:make_options_colors(colors),function:(v)=>{
        if(!v.input){engine.global.function.remove_style("border");} else {
          engine.global.function.add_style("border",v.input + " " + v.select);
        }
      }},
      {type:'single_select',tag:'border-top',dtag:'border-top',options:make_options_colors(colors),function:(v)=>{
        if(!v.input){engine.global.function.remove_style("border-top");} else {
          engine.global.function.add_style("border-top",v.input + " " + v.select);
        }
      }},
      {type:'single_select',tag:'border-bottom',dtag:'border-bottom',options:make_options_colors(colors),function:(v)=>{
        if(!v.input){engine.global.function.remove_style("border-bottom");} else {
          engine.global.function.add_style("border-bottom",v.input + " " + v.select);
        }
      }},
      {type:'single_select',tag:'border-left',dtag:'border-left',options:make_options_colors(colors),function:(v)=>{
        if(!v.input){engine.global.function.remove_style("border-left");} else {
          engine.global.function.add_style("border-left",v.input + " " + v.select);
        }
      }},
      {type:'single_select',tag:'border-right',dtag:'border-right',options:make_options_colors(colors),function:(v)=>{
        if(!v.input){engine.global.function.remove_style("border-right");} else {
          engine.global.function.add_style("border-right",v.input + " " + v.select);
        }
      }},
      {type:'single_select',tag:'border-radius',dtag:'border-radius',options:[
        {text:'px',value:'px'},{text:'vh',value:'vh'},{text:'vw',value:'vw'},{text:'em',value:'em'},
      ],function:(v)=>{
        if(!v.input){engine.global.function.remove_style("border-radius");} else {
          engine.global.function.add_style("border-radius",v.input + v.select);
        }
      }},
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
