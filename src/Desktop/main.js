// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const { ipcMain } = require('electron')
var fs = require('fs');

const express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const apps = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



var mainWin;
var logWin;
var win;
var fileName;
const {dialog} = require("electron");


function createWindow () {
  console.log("createIndexWidaw start");
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWin = mainWindow;
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  console.log("createIndexWidaw complete");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

/* ------------------------------------------------------------------------- */



//ファイルダイアログ制御文
function openLoadFile() {
  const win = BrowserWindow.getFocusedWindow();
  var filePath;
  
  filePath = dialog.showOpenDialogSync(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ["openFile"],
      filters: [
        {
          name: "Documents",
          extensions: ["txt", "text", "html", "js"]
        }
      ]
    },
  );
  return filePath;
}

//set後のウィンドウ生成
function createSetWindow(fileName){
  console.log("createSetWidaw start");
      //ウィンドウ設定
      const inputWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      })
      //使用するhtmlファイルを指定する
      inputWindow.loadURL(`file://${__dirname}/bomb.html`);

      mainWin.close();
      console.log("createSetWidaw complete");
      return inputWindow;
}



function createLogWindow(fileName){
  //ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
  const logWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  logWin = logWindow;
  //使用するhtmlファイルを指定する
  logWindow.loadURL(`file://${__dirname}/log.html`);
  console.log("createLogWindow : " + fileName);
  var data = fs.readFileSync(fileName, "utf8");
  // console.log("readLogFile : " + data);
  logWindow.webContents.on('did-finish-load', () => {
    logWindow.webContents.send('log', data)
  })

  return logWindow;
}

var cLine;

function onFn(countLine){
  console.log("onFn in");
  win.webContents.on('did-finish-load', () => {
    console.log("contents on");
    win.webContents.send('ON', countLine.toString());
    console.log("ON COMP"); 
  })
  console.log("onFn last");
}

apps.use(bodyParser.urlencoded({ extended: true }));
apps.use(bodyParser.json());



apps.get('/node', (req, res) => {
  res.json({
      alarm: true
  })
  console.log("set") // ping

  createLogWindow(fileName);
  win = createSetWindow(fileName);

  var data = fs.readFileSync(fileName, "utf8");
  var {countLine, lineData} = countLineFn(data);

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('data', countLine.toString())
  }) 
  console.log(win);
  cLine = countLine;
  onFn(countLine)
});


apps.listen(5000);


// setボタンの処理
ipcMain.on('set', (event, arg) => {
  console.log("set") // ping
  console.log(arg);
  //ファイルパスの取得
  var fName = openLoadFile();
  console.log("openfile : " + fName);
  fileName = fName.toString();
  console.log("global fileName : " + fileName);
  mainWin.webContents.on('did-finish-load', () => {
    mainWin.webContents.send('fileName', fileName)
  }) 
})


ipcMain.on('delete', (event, arg) => {
  if(!deleteFn(fileName, fileName)){
      
      //ファイルの読み込み
      let data = fs.readFileSync(fileName, "utf8");
      // console.log(data);
      console.log("after countLine : " + data.length);
      //ファイルの行数と改行データを取得
      var {countLine, lineData} = countLineFn(data);
      console.log("delete countLine : " + countLine);
      console.log("delete lineData : " + lineData);
      console.log("delete complete");
      event.reply('deleteComplete', 'OK')

  }else{
    console.log("countLine = 0");
    win.webContents.send('OFF', "0");
  }
})

//カウント関数
function sleep(time) {
  const d1 = new Date();
  while (true) {
      const d2 = new Date();
      if (d2 - d1 > time) {
          return;
      }
  }
}

//終了操作
ipcMain.on('stop', (event, arg) => {
  console.log("stop") // ping
  sleep(5000);
  win.close();
})




/*----------------------delete----------------------- */



//乱数生成（最大値）
function randomNum(max){
    var min = 1;
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}



//任意の行を削除し、ファイルに書き出す関数（読み込みファイル名, 書き込みファイル名）
function deleteFn(fileName, name){
    console.log("start");
    //ファイルの読み込み
    let data = fs.readFileSync(fileName, "utf8");
    // console.log(data);
    console.log(data.length);
    //ファイルの行数と改行データを取得
    var {countLine, lineData} = countLineFn(data);
    console.log(countLine);
    console.log(lineData);
    //削除行の決定  
    var num = randomNum(countLine);
    console.log("deleteLineNum : " + num);
    //任意の行を削除及びファイルに書き出し
    fs.writeFileSync(name, "");
    // console.log("mm");
    console.log(deleteLineFn(num, name, data, countLine, lineData));
    console.log("fin");

    var finFlag = false;
    if(countLine == 0){
        finFlag = true;
    }
    return finFlag;
}

//行数と改行データを作成する関数（ファイルデータ）
function countLineFn(data){
    //行数と改行データの宣言
    var countLine = 0;
    var lineData = [-1];
    //ファイルデータを一文字ずつチェックし改行文字の位置と行数を取得していく
    for(const index in data) {
        if(data[index] == "\n"){
            countLine++;
            lineData.push(parseInt(index, 10));
        }
    }
    return {countLine: countLine, lineData: lineData};
};

//任意の行を削除し、任意のファイルに書き出す関数（削除したい行番号, 書き出すファイル名, 行数, 改行データ）
function deleteLineFn(num, name, data, countLine, lineData){
    //削除する行の前後の文を保存する変数の宣言
    var dataFront = "";
    var dataBack = "";
    //削除する行より前の文を格納
    for(var i = 0; i < (lineData[num - 1] + 1); i++){
        dataFront += data[i];
    }
    //削除する行より後の文を格納
    for(var i = lineData[num] +1; i < data.length; i++){
        dataBack += data[i]
    }
    //ファイル書き出す
    fs.appendFileSync(name, dataFront);
    fs.appendFileSync(name, dataBack);
    //行数と改行データを改修
    var charCount = lineData[num] - lineData[num - 1];
    countLine--;
    for(var i = num; i < countLine + 1; i++){
        lineData[i] -= charCount;
    }
    // console.log(dataBack);
    return "FIN";
};


