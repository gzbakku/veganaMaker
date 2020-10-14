//controllers
const log = false;                        //turn on to log engine.common.tell string inputs
const compRef = '-comp-editor';             //dont worry about this
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
  return build(controller);                      //start build you can also start fetch here.

}

async function build(controller){

  let active = controller.active();

  const main = engine.make.div({
    parent:compId,
  });

  await engine.global.comp.formComp.init(main,{
    data:active,
    form:[
      {type:'single',tag:'name',dtag:'name',itype:'string',placeholder:'name',function:(v)=>{if(!v){
        engine.ui.getComp('mainUi','alertComp').init(compId,{
          message:'name is required'
        });return;
      }controller.functions.update_name(v);}},
      {type:'select',tag:'element type',dtag:'type',options:[
        {text:'div',value:'div'},
        {text:'image',value:'image'},
        {text:'input',value:'input'},
        {text:'a href',value:'href'},
      ],function:(v)=>{controller.functions.update_type(v);}},
    ]
  });

  if(active.type === "div"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'single',tag:'text',dtag:'text',placeholder:'div body text',function:(v)=>{controller.functions.update_field("text",v);}},
        {type:'editor',tag:'advance text',dtag:'text',function:(v)=>{
          controller.functions.update_field("text",v);
        }}
      ]
    });
  }

  if(active.type === "image"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'single',tag:'location',dtag:'location',itype:'string',placeholder:'location',function:(v)=>{controller.functions.update_field("location",v);}},
        {type:'select',tag:'location type',dtag:'type',options:[
          {text:'local',value:'local'},
          {text:'url',value:'url'}
        ],function:(v)=>{controller.functions.update_field("type",v);}},
      ]
    });
  }

  if(active.type === "input"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'select',tag:'type',dtag:'type',options:[
          {text:'string',value:'string'},
          {text:'number',value:'number'},
          {text:'files',value:'files'},
          {text:'button',value:'button'},
          {text:'select',value:'select'},
          {text:'checkbox',value:'checkbox'},
          {text:'textarea',value:'textarea'}
        ],function:(v)=>{controller.functions.update_field("type",v);}},
        {type:'single',tag:'value',dtag:'value',itype:'string',placeholder:'value',function:(v)=>{controller.functions.update_field("value",v);}},
        {type:'editor',tag:'advance value',dtag:'value',function:(v)=>{
          controller.functions.update_field("value",v);
        }}
      ]
    });
  }

  if(active.type === "input" && active.controllers.type !== "select" && active.controllers.type !== "button"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'single',tag:'place holder',dtag:'placeholder',itype:'string',placeholder:'placeholder',function:(v)=>{controller.functions.update_field("placeholder",v);}},
      ]
    });
  }

  if(active.type === "input" && active.controllers.type === "select"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'textarea',tag:'options',dtag:'options',ptype:'object',itype:'string',placeholder:'text_1:val_1,text_2:val_2,text_3:val_3',function:(v)=>{
          controller.functions.update_field("options",v);
        }},
      ]
    });
  }

  if(active.type === "input" && active.controllers.type === "textarea"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'single',tag:'rows',dtag:'rows',itype:'string',placeholder:'rows',function:(v)=>{
          controller.functions.update_field("rows",v);
        }},
      ]
    });
  }

  if(active.type === "href"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'select',tag:'type',dtag:'type',options:[
          {text:'local',value:'local'},
          {text:'url',value:'url'},
        ],function:(v)=>{controller.functions.update_field("type",v,true);}},
        {type:'single',tag:'href text',dtag:'text',itype:'string',placeholder:'href text',function:(v)=>{controller.functions.update_field("text",v);}},
        {type:'editor',tag:'superFunction',dtag:'superFunction',lang:'js',function:(v)=>{
          controller.functions.update_field("superFunction",v);
        }},
        {type:'editor',tag:'baseFunction',dtag:'baseFunction',lang:'js',function:(v)=>{
          controller.functions.update_field("baseFunction",v);
        }}
      ]
    });
  }

  if(active.type === "href" && active.controllers.type === "local"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'single',tag:'pageName',dtag:'page',itype:'string',placeholder:'page name',function:(v)=>{controller.functions.update_field("page",v);}},
        {type:'single',tag:'contName',dtag:'cont',itype:'string',placeholder:'cont name',function:(v)=>{controller.functions.update_field("cont",v);}},
        {type:'single',tag:'panelName',dtag:'panel',itype:'string',placeholder:'panel name',function:(v)=>{controller.functions.update_field("panel",v);}},
        {type:'textarea',tag:'params',dtag:'params',ptype:'object',itype:'string',placeholder:'text_1:val_1,text_2:val_2,text_3:val_3',function:(v)=>{
          controller.functions.update_field("params",v);
        }},
      ]
    });
  }

  if(active.type === "href" && active.controllers.type === "url"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'single',tag:'url',dtag:'href',itype:'string',placeholder:'valid url',function:(v)=>{controller.functions.update_field("href",v);}},
      ]
    });
  }

  if(active.type !== "href"){
    await engine.global.comp.formComp.init(main,{
      data:active.controllers,
      form:[
        {type:'editor',tag:'function',dtag:'function',lang:'js',function:(v)=>{
          controller.functions.update_field("function",v);
        }},
        {type:'editor',tag:'touch',dtag:'touch',lang:'js',function:(v)=>{
          controller.functions.update_field("touch",v);
        }}
      ]
    });
  }

  await engine.global.comp.formComp.init(main,{
    data:active,
    form:[
      {type:'switch',tag:'loop_array',dtag:'should_loop',itype:'string',function:(v)=>{
        if(v){
          engine.ui.getComp('mainUi','alertComp').init(compId,{
            message:'use the following format in controllers to get item from json <br><br>text = ...friend...name <br><br>' + JSON.stringify({
              friend:{
                name:'akku'
              }
            })
          });
        }
        controller.functions.update_loop(v);
      }},
      {type:'single',tag:'track',dtag:'track',itype:'string',placeholder:'track name',function:(v)=>{controller.functions.update_track(v);}},
      {type:'editor',tag:'array to loop',dtag:'loop_array',lang:'json',function:(v)=>{
        try{
          JSON.parse(v);
          controller.functions.update_loop_array(v);
        }catch(_){
          engine.ui.getComp('mainUi','alertComp').init(compId,{
            message:'given value is not a valid json array.'
          });
          return;
        }
      }}
    ]
  });

}

module.exports = {init:init,ref:compRef,type:type,trackers:false}
