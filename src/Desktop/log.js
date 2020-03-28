const { ipcRenderer } = window.native;

const countText = document.getElementById("logText");

ipcRenderer.on("log", (event, data) => {
    console.log("OK");
    countText.innerHTML = data;
});

window.onload = function(){
    document.body.oncopy = function(){return false;}
}