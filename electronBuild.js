const builder = require("electron-builder");
const Platform = builder.Platform;

build();

async function build(){

  await builder.build({
    targets: Platform.WINDOWS.createTarget(),
    config: {
      "appId":"app.vegana.maker",
      "productName":"vegana maker",
      "copyright":"tejasav dutt",
      "buildVersion":"1.0.2",
      "directories":{
        "output":"dist/electron"
      },
      "win":{
        "icon":"assets/veganaMakerLogo.png",
        "target":"nsis"
      },
      "linux":{
        "icon":"assets/veganaMakerLogo.png",
        "target":"AppImage"
      }
    }
  })
  .then(()=>{
    return true;
  })
  .catch((e)=>{
    console.error(e);
    return false;
  });

}
