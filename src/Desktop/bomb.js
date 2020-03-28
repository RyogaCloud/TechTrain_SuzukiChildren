const { ipcRenderer } = window.native;

const stopButton = document.getElementById("stop");
const state = document.getElementById("state");
const countLine = document.getElementById("countLine");
const line = document.getElementById("line");
const m10 = document.getElementById("m10");
const m01 = document.getElementById("m01");
const s10 = document.getElementById("s10");
const s01 = document.getElementById("s01");
const c10 = document.getElementById("c10");
const c01 = document.getElementById("c01");




ipcRenderer.on("data", (event, countLineNum) => {
    console.log("OK");
    state.innerHTML = "Installation Completed!";
    countLine.innerHTML = countLineNum;
    line.innerHTML = " / " + countLineNum;
});

ipcRenderer.on("ON", (event, countLineNum) => {
    console.log("OK");
    time(countLineNum - 0);
});

var deleteCompleteFlag = false;
var deleteStopFlag = false;
var firstInterval = 3000; // 1/10s
var middleinterval = 600; // 1/10s

stopButton.addEventListener("click", (event) => {
    ipcRenderer.sendSync("stop", "test");
});

//時間制御関数
function time(countLineNum){
    /* ---------------------------時間制御文---------------------------- */

    var deleteLineNum = 2;

    var lineNum = countLineNum;

    state.innerHTML = "First Delete 1 Line";

    digitalTimer(firstInterval);
    window.setTimeout(firstDeleteFn, firstInterval * 10);
    
    function firstDeleteFn(){
        digitalTimer(middleinterval);
        ipcRenderer.send("delete", "1");
        lineNum--;
        countLine.innerHTML = lineNum;
        if(lineNum == 0){
            state.innerHTML = "Delete Complete!!";
            return; 
        } 
        if(lineNum >= 2){
            state.innerHTML = "Next Delete 2 Line";
        }else{
            state.innerHTML = "Next Delete All Line";
        }
        window.setTimeout(secondDeleteFn, middleinterval * 10);
    }

    
    var countID;
    
    function secondDeleteFn(){
        digitalTimer(middleinterval); 
        ipcRenderer.send("delete", "1");
        lineNum--;
        countLine.innerHTML = lineNum;
        if(lineNum == 0){
            state.innerHTML = "Delete Complete!!";
            return; 
        } 
        ipcRenderer.send("delete", "1");
        lineNum--;
        countLine.innerHTML = lineNum;
        if(lineNum == 0){
            state.innerHTML = "Delete Complete!!";

            return
        };
        if(lineNum >= 4){
            state.innerHTML = "Next Delete 4 Line";
        }else{
            state.innerHTML = "Next Delete All Line";
        }
        countID = window.setInterval(deleteFn, middleinterval * 10);
               
    }
    

    function deleteFn() {
        if(!deleteCompleteFlag) digitalTimer(middleinterval);
        for(var j = 0; j < (deleteLineNum * deleteLineNum); j++){
            ipcRenderer.send("delete", "1");
            lineNum--;
            countLine.innerHTML = lineNum;
            if(lineNum == 0){
                state.innerHTML = "Delete Complete!!";
                clearInterval(countID);
                break;
            }
        }
        deleteLineNum = (deleteLineNum % 10) + 1;
        if(lineNum >= deleteLineNum * deleteLineNum){
            state.innerHTML = "Next Delete " + (deleteLineNum * deleteLineNum).toString() + " Line";
        }else if(!deleteCompleteFlag){
            state.innerHTML = "Next Delete All Line";
            deleteCompleteFlag = true;
        }
    }

}

/* ---------------------------デジタルタイマー表示制御文---------------------------- */
function digitalTimer(i){
    var m = Math.floor(i / 6000);
    var s = Math.floor((i % 6000) / 100);
    var c = (i % 6000) % 100;
    var m10Num = Math.floor(m / 10);
    var m01Num = m % 10;
    var s10Num = Math.floor(s / 10);
    var s01Num = s % 10;
    var c10Num = Math.floor(c / 10);
    var c01Num = c % 10;



    var m10Flag = true;
    var m01Flag = true;
    var s10Flag = true;
    var s01Flag = true;
    var c10Flag = true;
    var c01Flag = true;
    
    if(m10Num == 0){
        m10Flag = false;
        if(m01Num == 0){
            m01Flag = false;
            if(s10Num == 0){
                s10Flag = false;
                if(s01Num == 0){
                    s01Flag = false
                    if(c10Num == 0){
                        c10Flag = false;
                        if(c01Num == 0){
                            c01Flag = false
                        }
                    }
                }
            }
        }
    }   


    m10CountFn();
    m01CountFn();
    s10CountFn();
    s01CountFn();
    c10CountFn();
    c01CountFn();


    var m10Interval = window.setInterval(m10CountFn, 600000);
    var m01Interval = window.setInterval(m01CountFn, 60000);
    var s10Interval = window.setInterval(s10CountFn, 10000);
    var s01Interval = window.setInterval(s01CountFn, 1000);
    var c10Interval = window.setInterval(c10CountFn, 100);
    var c01Interval = window.setInterval(c01CountFn, 10);



    function m10CountFn() {
        if(m10Num > 0){
            m10Num--;
            m10.className = "display d" + m10Num.toString();
        }else{
            m10Flag = false;
            m10.className = "display d0";
            clearInterval(m10Interval);
        }
    }
    function m01CountFn() {
        if(m01Num > 0){
            m01Num--;
            m01.className = "display d" + m01Num.toString();
        }else{
            if(m10Flag){
                m01Num = 9;
                m01.className = "display d" + m01Num.toString();
            }else{
                m01Flag = false;
                m01.className = "display d0";
                clearInterval(m01Interval);
            }
        }
    }
    function s10CountFn() {
        if(s10Num > 0){
            s10Num--;
            s10.className = "display d" + s10Num.toString();
        }else{
            if(m01Flag){
                s10Num = 5;
                s10.className = "display d" + s10Num.toString();
            }else{
                s10Flag = false;
                s10.className = "display d0";
                clearInterval(s10Interval);
            }
        }
    }
    function s01CountFn() {
        if(s01Num > 0){
            s01Num--;
            s01.className = "display d" + s01Num.toString();
        }else{
            if(s10Flag){
                s01Num = 9;
                s01.className = "display d" + s01Num.toString();
            }else{
                s01Flag = false;
                s01.className = "display d0";
                clearInterval(s01Interval);
            }
        }
    }
    function c10CountFn() {
        if(c10Num > 0){
            c10Num--;
            c10.className = "display d" + c10Num.toString();
        }else{
            if(s01Flag){
                c10Num = 9;
                c10.className = "display d" + c10Num.toString();
            }else{
                c10Flag = false;
                c10.className = "display d0";
                clearInterval(c10Interval);
            }
        }
    }
    function c01CountFn() {

        if(c01Num > 0){
            c01Num--;
            c01.className = "display d" + c01Num.toString();
        }else{
            if(c10Flag){
                c01Num = 9;
                c01.className = "display d" + c01Num.toString();
            }else{
                c01Flag = false;
                c01.className = "display d0";
                clearInterval(c01Interval);
            }
        }
    }
}
