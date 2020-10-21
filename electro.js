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

let mobile;
function createMobileWindow(){
  mobile = new browser({
    width: 300,
    height: 600,
    frame:true,
    // titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true
    }
  });
  mobile.loadFile('electric.html');
  // mobile.webContents.openDevTools();
}

app.on('ready', make_all_windows);
function make_all_windows(){
  createWindow();
  createMobileWindow();
}

ipc.respondTo('reload', (sender) => {
  console.log("reload");
  win.close();
  mobile.close();
  //app.quit();
  createWindow();
  createMobileWindow();
});

ipc.respondTo('save_view', async (event,data) => {

  let name = data.name;
  if(name.indexOf(" ") >= 0){
    while(name.indexOf(" ") >= 0){
      name = name.replace(" ","_");
    }
  }
  if(name.indexOf("View") < 0){
    name += "View";
  }

  let path = data.path;
  if(true && !data.path){
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
      path = raw_path;
      return true;
    }).catch((e)=>{
      console.log(e);
      console.log("failed-get_file");
      return false;
    });
    if(!generate){
      return save_failed();
    }
  }

  //save here
  if(true){
    const base_path = path + "/" + name + "/";
    const ensure_base_dir = await ensure_dir(base_path);
    if(!ensure_base_dir){return save_failed();}
    const add_js = await make_file(base_path + name + ".js",data.js);
    if(!add_js){return save_failed();}
    const add_css = await make_file(base_path + name + "_scss.scss",data.css);
    if(!add_css){return save_failed();}
    data.builder.name = name;
    const add_builder = await make_file(base_path + name + "_builder.json",JSON.stringify(data.builder,null,1));
    if(!add_builder){return save_failed();}
  }

  function save_failed(){
    win.webContents.send("save_result_from_main_process",{result:false});
  }
  function save_success(){
    win.webContents.send("save_result_from_main_process",{result:true,path:path,name:name});
  }
  return save_success();

});

ipc.respondTo('open_view', async () => {

  if(true){
    await electron.dialog.showOpenDialog({
      title: "open View builder file",
      buttonLabel : "open",
      properties:['openFile'],
      filters:[
        { name: 'All Files', extensions: ['json'] }
      ]
    }).then(async (worker)=>{
      if(worker.canceled){return false;}
      const data = await read_json(worker.filePaths[0]);
      const path = get_base_folder(worker.filePaths[0]);
      win.webContents.send("read_result_from_main_process",{result:data ? true : false,data:data,path:path});
    }).catch((e)=>{
      console.log(e);
      console.log("failed-get_file");
      win.webContents.send("read_result_from_main_process",{result:false});
    });
  }

});

function get_base_folder(path){
  let spliter;
  if(path.indexOf("/") >= 0){spliter = '/';}
  if(path.indexOf("\\") >= 0){spliter = '\\';}
  let hold = path.split(spliter);
  let collect = '';
  for(let i=0;i<hold.length-2;i++){
    collect += hold[i] + spliter
  }
  if(collect[collect.length - 1] === spliter){
    collect = collect.substring(0,collect.length - 1);
  }
  return collect;
}

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
