

module.exports = ()=>{

  return new Promise((resolve,reject)=>{

    const main = engine.make.div({
      parent:'page-router'
    });

    const card = engine.ui.getComp('mainUi','cardComp').init(main,{
      title:'save as'
    });

      const base = engine.make.div({
        parent:card,
        class:'comp-builder-save-as_is'
      });

        engine.make.div({
          parent:base,
          class:'comp-builder-save-as_is-message',
          text:'do you want to save as is?'
        });

        engine.make.div({
          parent:base,
          class:'comp-builder-save-as_is-tag',
          text:'name : ' + engine.data.get('viewName','local')
        });

        engine.make.div({
          parent:base,
          class:'comp-builder-save-as_is-tag',
          text:'path : ' + engine.data.get('viewPath','local')
        });

        const answer = engine.make.div({
          parent:base,
          class:'comp-builder-save-as_is-answer',
        });

          engine.make.div({
            parent:answer,
            class:'comp-builder-save-as_is-answer-button',
            text:'yes',
            function:()=>{
              close(true);
            }
          });

          engine.make.div({
            parent:answer,
            class:'comp-builder-save-as_is-answer-button',
            text:'no',
            function:()=>{
              engine.data.reset('viewPath',null,'local');
              engine.data.reset('viewName',null,'local');
              close(false);
            }
          });

          function close(b){
            engine.view.remove(main);
            resolve(b);
          }

  });

}
