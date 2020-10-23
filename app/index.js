
var ace = require('brace');
require('brace/mode/javascript');
require('brace/mode/json');
require('brace/theme/twilight');

if(engine.get.platform() === "electron"){
  window.ipc = require("hadron-ipc");
}

//import all the pages here which you want to be in the app and use engine.get.pageModule api to get the page
const mainPage = require('./pages/mainPage/page');

//declare the first page module here
const startPage = mainPage;

/*set the base url to the native vegana cdn,
or if hosting on non native platform please
set the baseurl to where the files for the project are held*/
const baseHref = null;
engine.router.set.baseHref(baseHref);

require('./ui/index.js');

engine.sketch.fonts.add("font","Montserrat","assets/fonts/Montserrat/Montserrat-Regular.ttf");

//------------------------------------------------------------------------------
//dont fuck with anything below

if(engine.router.active.page == null){
  startPage.init();
}
