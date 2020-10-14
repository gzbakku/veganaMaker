const electron = require('electron');
const app = electron.app;
const browser = electron.BrowserWindow;
const ipc = require('hadron-ipc');
const fs = require("fs-extra");
const uniqid = require("uniqid");

let win;

function createWindow(){
  win = new browser({
    width: 800,
    height: 600,
    frame:true,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile('electric.html');
  // win.webContents.openDevTools();
}

ipc.respondTo('reload', (sender) => {
  win.close();
  //app.quit();
  createWindow();
});

ipc.respondTo('save_view', async (event,data) => {

  let name = data.name;
  while(name.indexOf(" ") >= 0){
    name = name.replace(" ","_");
  }
  name += "View";

  if(true){
    const generate = await electron.dialog.showOpenDialog({
      title: "Save View",
      buttonLabel : "generate",
      properties:['openDirectory']
    }).then(async (worker)=>{
      if(worker.canceled){return false;}
      let raw_path = worker.filePaths[0];
      if(raw_path.indexOf("\\") >= 0){
        let h = raw_path.split("\\");
        if(h[h.length -1] !== "views"){
          raw_path += "/views"
        }
      }
      if(raw_path.indexOf("/") >= 0){
        let h = raw_path.split("/");
        if(h[h.length -1] !== "views"){
          raw_path += "/views"
        }
      }
      const base_path = raw_path + "/" + name + "/";
      const ensure_base_dir = await ensure_dir(base_path);
      if(!ensure_base_dir){return false;}
      const add_js = await make_file(base_path + name + ".js",data.js);
      if(!add_js){return false;}
      const add_css = await make_file(base_path + name + "_scss.scss",data.css);
      if(!add_css){return false;}
      const add_builder = await make_file(base_path + name + "_builder.json",JSON.stringify(data.builder,null,1));
      if(!add_builder){return false;}
      return true;
    }).catch((e)=>{
      console.log(e);
      console.log("failed-get_file");
      return false;
    });
    win.webContents.send("message_from_main_process",{result:generate})
  }

});

ipc.respondTo('open_view', async () => {

  if(true){
    const generate = await electron.dialog.showOpenDialog({
      title: "open View builder file",
      buttonLabel : "open",
      properties:['openFile'],
      filters:[
        { name: 'All Files', extensions: ['json'] }
      ]
    }).then(async (worker)=>{
      if(worker.canceled){return false;}
      return read_json(worker.filePaths[0]);
    }).catch((e)=>{
      console.log(e);
      console.log("failed-get_file");
      return false;
    });
    win.webContents.send("read_result_from_main_process",{result:generate,id:uniqid()})
  }

});

function read_json(path){
  return fs.readJson(path)
  .then((d)=>{return d;}).catch((e)=>{console.log(e);return false;});
}

function ensure_dir(path,data){
  return fs.ensureDir(path)
  .then(()=>{return true;}).catch((e)=>{console.log(e);return false;});
}

function make_file(path,data){
  return fs.outputFile(path,data)
  .then(()=>{return true;}).catch((e)=>{console.log(e);return false;});
}



// function make_file(path,data){
//   return new Promise((resolve,reject)=>{
//     return fs.ensureDir(path, data, (err) => {
//       if(err){console.log(err);reject(err);} else {resolve();}
//     });
//   });
// }
//
// function ensure_dir(){
//   return new Promise((resolve,reject)=>{
//     fs.mkdir('/tmp/a/apple', { recursive: true }, (err) => {
//       if(err){console.log(err);reject(err);} else {resolve();}
//     });
//   });
// }

app.on('ready', createWindow);
