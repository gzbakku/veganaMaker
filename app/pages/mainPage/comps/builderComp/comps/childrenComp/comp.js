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

  // for(let key in active.children){
  //   console.log({n:active.children[key].name,i:active.children[key].index});
  // }

  // controller.functions.update_children_position(1,4);

  // let hold = false;
  // if(!hold){
  //   controller.functions.update_children_position(2,5);
  //   hold = true;
  // }

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

  const listContObject = engine.get.element(listCont);
  listContObject.addEventListener("pointerup",()=>{
    if(!do_select){return;}
    do_select = false;
    controller.functions.update_children_position(drag_me.index,moveto);
  });

  let do_select = false,moveto,drag_me,drag_element_id,drag_item_index,moveToName;

  let sorted = sort_children(active.children);
  for(let childName of sorted){
    let child = active.children[childName];
    make_list_item(child);
  }

  function make_list_item(child,parent){

    let make_list_div = {
      parent:listCont,
      class:'comp-builder-children-list-item',
    };
    if(parent){
      let align_pos = 'beforebegin';
      if(moveToName === sorted[sorted.length - 1]){
        align_pos = 'afterend';
      }
      make_list_div.parent = parent;
      make_list_div.position = align_pos;
      make_list_div.class += " comp-builder-children-list-item-hover";
    }

    const list = engine.make.div(make_list_div);
    if(!list){return;}

    const listObject = engine.get.element(list);
    listObject.addEventListener('pointerenter',()=>{
      if(child.index === drag_item_index){return;}
      if(!do_select){return;}
      moveto = child.index;
      moveToName = child.name;
      if(drag_element_id){
        engine.view.remove(drag_element_id);
      }
      drag_element_id = make_list_item(drag_me,list);
    });

      const dragCont = engine.make.div({
        parent:list,
        class:'comp-builder-children-list-item-val comp-builder-children-list-item-val-drag_image',
      });

      const dragObject = engine.get.element(dragCont);

      dragObject.addEventListener("pointerdown",()=>{
        drag_me = child;
        do_select = true;
        drag_item_index = child.index;
        engine.make.addClass({id:list,class:'comp-builder-children-list-item-selected'});
      });

        engine.make.image({
          parent:dragCont,
          class:'comp-builder-children-list-item-val-drag_image-img',
          type:'local',
          location:'assets/images/move.png'
        });

      engine.make.div({
        parent:list,
        class:'comp-builder-children-list-item-val comp-builder-children-list-item-val-type',
        text:child.type,
        function:()=>{
          engine.global.function.push_active(child.name);
          controller.functions.remake();
        }
      });

      engine.make.div({
        parent:list,
        class:'comp-builder-children-list-item-val comp-builder-children-list-item-val-name',
        text:child.name,
        function:()=>{
          engine.global.function.push_active(child.name);
          controller.functions.remake();
        }
      });

      const imageCont = engine.make.div({
        parent:list,
        class:'comp-builder-children-list-item-val comp-builder-children-list-item-val-delete',
      });

        engine.make.image({
          parent:imageCont,
          class:'comp-builder-children-list-item-val-delete-img',
          type:'local',
          location:'assets/images/delete.png',
          function:()=>{
            controller.functions.remove_child(child.name);
          }
        });

    return list;

  }

}

function sort_children(children){

  let index_pool = [];
  let keys = {};
  for(let key in children){
    index_pool.push(children[key].index);
    keys[children[key].index] = key;
  }

  let sorted = [];
  for(let index of index_pool){
    if(sorted.length === 0 || index > sorted[sorted.length - 1]){
      sorted.push(index);
    } else {
      let sort_index = 0;
      for(let item of sorted){
        if(item > index){
          sorted.splice(sort_index,0,index);
          break;
        }
        sort_index++;
      }
    }
  }

  let sorted_keys = [];
  for(let i of sorted){
    sorted_keys.push(keys[i]);
  }

  return sorted_keys;

}

module.exports = {init:init,ref:compRef,type:type,trackers:null}
