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
      "directories":{
        "output":"dist"
      },
      "win":{
        "icon":"assets/vegana_maker_logo_310.ico",
        "target":"nsis"
      },
      "linux":{
        "icon":"assets/vegana_maker_logo_310.ico",
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
