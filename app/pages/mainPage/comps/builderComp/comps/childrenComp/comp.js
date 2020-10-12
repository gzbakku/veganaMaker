//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-children';             //dont worry about this
const type = 'comp';                      //type of app

//ids
var parentId;
var compId;

const init = (pid,controller) => {         //pid referes to the parentPageId, pass this var when you init thiscomp.

  if(pid == null || pid == undefined){
    return engine.common.error('no_parent_page_ref_found'); //common error logger
  }

  parentId = pid;               //set parent page ref
  compId = parentId + compRef;  //set comp id
  engine.make.init.comp(compId,parentId,'comp');
  build(controller);                      //start build you can also start fetch here.

}

async function build(controller){

  let active = controller.active();

  const main = engine.make.div({
    parent:compId,
    class:'comp-builder-children'
  });

  engine.global.function.make_section(main,"new");

  await engine.global.comp.formComp.init(main,{
    form:[
      {type:'single_select',dtype:'string',placeholder:'name',tag:'element',dtag:'type',options:[
        {text:'div',value:'div'},
        {text:'image',value:'image'},
        {text:'input',value:'input'},
        {text:'a href',value:'href'},
      ],function:(v)=>{controller.functions.add_element(v.input,v.select);}},
    ]
  });

  if(Object.keys(active.children).length === 0){return;}

  engine.global.function.make_section(main,"children");

  const listCont = engine.make.div({
    parent:main,
    class:'comp-builder-children-list'
  });

  for(let childName of Object.keys(active.children)){

    let child = active.children[childName];

    const list = engine.make.div({
      parent:listCont,
      class:'comp-builder-children-list-item',
      function:()=>{
        engine.global.function.push_active(child.name);
        controller.functions.remake();
      }
    });

      engine.make.div({
        parent:list,
        class:'comp-builder-children-list-item-val comp-builder-children-list-item-val-type',
        text:child.type
      });

      engine.make.div({
        parent:list,
        class:'comp-builder-children-list-item-val comp-builder-children-list-item-val-name',
        text:child.name
      });

  }

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
