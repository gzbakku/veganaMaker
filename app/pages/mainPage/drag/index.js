

module.exports = (parent)=>{

  const card = engine.make.div({
    parent:parent,
    class:'card page-main-drag-main',
    touch:(i,v)=>{
      move(v);
    }
  });

  const cardObject = engine.get.element(card);
  const cardHeight = 80;
  const cardWidth = 250;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  function move(v){
    let leftBorder = v.posX - Math.abs(cardWidth/2);
    let topBorder = v.posY - Math.abs(cardHeight/2);
    if(leftBorder < 0){leftBorder = 0;}
    if(topBorder < 0){topBorder = 0;}
    if(leftBorder + cardWidth > windowWidth){leftBorder = windowWidth - cardWidth;}
    if(topBorder + cardHeight > windowHeight){topBorder = windowHeight - cardHeight;}
    cardObject.style.left = leftBorder + "px";
    cardObject.style.top = topBorder + "px";
  }

    const left = engine.make.div({
      parent:card,
      class:'page-main-drag-main-left',
    });

      engine.make.image({
        parent:left,
        class:'page-main-drag-main-left-img',
        type:'local',
        location:'assets/images/resize.png'
      });

    const right = engine.make.div({
      parent:card,
      class:'page-main-drag-main-right'
    });

      engine.make.div({
        parent:right,
        class:'page-main-drag-main-right-text',
        text:'open builder'
      });

      engine.make.div({
        parent:right,
        class:'page-main-drag-main-right-button',
        text:'maximize',
        function:()=>{
          engine.global.function.maximize_builder();
        }
      });

  return card;

}
