function searchapps() {
  var searchapps = document.getElementById("searchapps");
  var filter = searchapps.value.toLowerCase();
  var app = document.getElementsByClassName('app');

  for (i = 0; i < app.length; i++) {
    if (app[i].innerText.toLowerCase().includes(filter)) {
      app[i].style.display = "initial";
    } else {
      app[i].style.display = "none";
    }
  }


document.getElementById("noapp").style.display = "inherit"

for (item in app) {
if (app[item].innerText !== undefined) {
if (app[item].style.display !== "none") {
document.getElementById("noapp").style.display = "none"
}
}
}

}

function openapp(app) {
var appframe = document.getElementById("appframe");
var closeapp = document.getElementById("closeapp");
var reloadapp = document.getElementById("reloadapp");
var controls = document.getElementById("controls");
controls.style.display = "flex";
appframe.style.display = "initial";
closeapp.style.display = "initial";
reloadapp.style.display = "initial";
appframe.setAttribute("src", app);
document.getElementById("search").value = "";
}
    
function closeapp() {
var appframe = document.getElementById("appframe");
var closeapp = document.getElementById("closeapp");
var reloadapp = document.getElementById("reloadapp");
var controls = document.getElementById("controls");
var navtitle = document.getElementById("nav-title");
controls.style.display = "none";
closeapp.style.display = "none";
appframe.style.display = "none";
reloadapp.style.display = "none";
closeapp.setAttribute("src", "");
navtitle.innerText = "Loading..."
}

function fullapp() {
  var appframe = document.getElementById("appframe")
  appframe.requestFullscreen()
}

async function fetchapps() {
let response = await fetch("/apps/apps.json")
let json = await response.json()

for (app in json) {
var title = json[app].title
var image = json[app].image
var location = json[app].location

var appelm = document.createElement("div")
appelm.className = "app"
appelm.setAttribute("onclick", 'openapp(' + '"' + location + '"' + ')')
document.getElementsByClassName("apps")[0].appendChild(appelm)

var app = document.getElementsByClassName("app")[app]

var imageelm = document.createElement("img")
imageelm.className = "appimg"
imageelm.src = image
app.appendChild(imageelm)

var titleelm = document.createElement("div")
titleelm.innerText = title
titleelm.className = "appinfo"
app.appendChild(titleelm)
}

}

fetchapps()