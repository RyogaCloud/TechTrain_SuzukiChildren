const { ipcRenderer } = window.native;

const setButton = document.getElementById("set");
const fileNameText = document.getElementById("file");

setButton.addEventListener("click", (event) => {
    ipcRenderer.sendSync("set", "ipc set ok");
    fileNameText.innerHTML = "fileName";
});

ipcRenderer.on("fileName", (event, fileName) => {
    fileNameText.innerHTML = fileName;
});
