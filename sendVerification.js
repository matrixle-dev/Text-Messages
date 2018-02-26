var Storage = require('node-storage');
var store = new Storage('verifications.json');
// 修改为您的apikey.可在官网（https://www.yunpian.com)登录后获取
var mobile;
var https = require('https');
var qs = require('querystring');
var apikey = '1d4147bb5d14e518030c600285dc17c6';
// 修改为您要发送的短信内容
var text = '【Matrixle】Your Verification Code is ';
// 当使用国内号码的时候用这个
// '【乐析留学数据矩阵】您的验证码是'
var send_sms_uri = '/v2/sms/single_send.json';
var sms_host = 'sms.yunpian.com';

// 只需要把这里的number换成从request里面拿来的手机号码就好
// 然后把验证码作为response发送回去

// 比较用户输入的验证码和真正发送的验证码
function compare(vCode) {
	var realCode = sessionStorage.getItem("code");
	document.getElementById('responder').innerHTML = realCode + " and fake code is: " + vCode;
	if (vCode == realCode) {
		//验证成功
		return true;
		//redirect到首页，显示用户信息一类的？
	} else {
		//验证失败
		return false;
	}
}

// 生成验证码并且发送到用户的手机
function verify(number) {
	mobile = number;
	generate_code();
	send_sms(send_sms_uri,apikey,mobile,text);
}

function generate_code() {
	var codie = '';
	// 随机函数生成四位验证码
	for (i = 0; i < 4; i++) {
		codie = codie + Math.floor(Math.random()*10);
	}
	// 把生成的验证码放在sessionStorage 里面暂存
	store.put("code", codie);
	text = text + codie;
	return text;
}

function send_sms(uri,apikey,mobile,text){
	// 这一堆是官网上面给的代码
    var post_data = {  
    'apikey': apikey,
    'mobile':mobile,
    'text':text,
    };//这是需要提交的数据  
    var content = qs.stringify(post_data);  
    post(uri,content,'sms.yunpian.com');
}

function post(uri,content,host){
    var options = {  
        hostname: host,
        port: 443,  
        path: uri,  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
        }  
    };
    var req = https.request(options, function (res) {  
        // console.log('STATUS: ' + res.statusCode);  
        // console.log('HEADERS: ' + JSON.stringify(res.headers));  
        res.setEncoding('utf8');  
        res.on('data', function (chunk) {  
            console.log('BODY: ' + chunk);  
        });  
    }); 
    //console.log(content);
    req.write(content);  

    req.end();   
}
