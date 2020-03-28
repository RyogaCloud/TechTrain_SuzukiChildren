const express = require('express');
var bodyParser = require('body-parser');
const app = express();

var request = require('request');

var result = false;

// DesktopAPPにGET通信
var option = {
    url: "<DesktopAPPのURL>"
};

// リクエストボディをjsonに変換する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get通信
app.get('/', (req, res) => {
    res.send("Hello")
});

// POST通信(DesktopAPPテスト用)
app.post('/pc', function(req, res){
    if(req.body.count){
        console.log(req.body.count);  // Serverから送られてきたstatusの確認
        return res.json({
            count: false
        });
    } else{
        console.log('ERROR');
    }
});

// GET通信(Desktop)
app.get('/node', (req, res) => {
    res.send(result);
});

// POST通信(Mobile)
app.post('/init', function(req, res){
    if(req.body.status==false){
        console.log(req.body.status);  // Mobileから送られてきたstatusの確認
        result = req.body.status;
        console.log(result);

        return res.json({
            status: true
        });
    } else{
        console.log('ERROR');  // エラーメッセージの表示
        return res.json({
          status: 'ERROR'
        });
    }
})

// POST通信(MobileAPP→DesktopAPP)
app.post('/mobile', function(req, res){
    if(req.body.status){
        console.log(req.body.status);  // Mobileから送られてきたstatusの確認

        result = true;

        request.get(option, function(error, response, body){
            console.log(body);  // PCから送られてきたalarmの確認
        })

        return res.json({
            status: false
        });
        
    } else{
        console.log('ERROR');  // エラーメッセージの表示
        return res.json({
          status: 'ERROR'
        });
    }
});

app.listen(3000);
console.log('listen on port 3000')