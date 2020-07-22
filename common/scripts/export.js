
var env_test = "https://choujiang-test.19ego.cn",
    env_test2 = "https://choujiang-test2.19ego.cn",
    env_formal = "https://choujiang.19ego.cn",
    env_dev = "https://choujiang-dev.19ego.cn",
    // 用户信息单独请求域名
    env_test_user = "https://mfbizweb-test.19ego.cn",
    env_formal_user = "https://mfbizweb.19ego.cn",
    env_dev_user = "https://mfbizweb-dev.19ego.cn";

function getUserAuthCode () {
    return new Promise ((resolve,reject)=>{
        var thisAuthCode = '';
        AlipayJSBridge.call("getAuthCode", {
            scopeNicks: ['auth_base'], //主动授权：auth_user，静默授权：auth_base
            appId: '2018121062528173', // 开放平台id，需要去开放平台配置域名白名单，才能使用，域名白名单不支持通配符
            showErrorTip: false,       // 是否显示出错弹框，默认是true
        }, function (result) {
            // alert(JSON.stringify(result));
            if (result.hasOwnProperty('authcode')) {
                resolve(result.authcode);
            } else {
                reject();
            }
        })
    })
}

function dealCodeStatus(returnCode) {
    switch(returnCode) {
        case '20000':
            AlipayJSBridge.call('toast', {
                content: '操作失败',
                duration: 2000
            });
            looseBody();
        break;
        case '30000':
            AlipayJSBridge.call('toast', {
                content: '必要参数为空',
                duration: 2000
            });
            looseBody();
        break;
        case '41001':
            AlipayJSBridge.call('toast', {
                content: '活动不存在',
                duration: 2000
            });
            looseBody();
        break;
        case '41002':
            fixedBody();
            $('#not-start-or-ended p').html('活动已结束！下次记得早点来哦！');
            $('#not-start-or-ended, .fd-allresultalert').show();
        break;
        case '41003':
            fixedBody();
            $('#not-start-or-ended p').html('活动还未开始，请耐心等一等哦');
            $('#not-start-or-ended, .fd-allresultalert').show();
        break;
        default:
            AlipayJSBridge.call('toast', {
                content: '系统异常，请稍后重试',
                duration: 2000
            });
            looseBody();
        break;
    }
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var value = window.location.search.slice(1).match(reg);
    if (value !== null) return decodeURI(value[2]);
    return null;
}

function envPath() {
    return new Promise ((resolve,reject)=>{
        var env = getUrlParam('env');
        var envPath = "";
        switch (env) {
            case "test":
                envPath = env_test;
                break;
            case "test2":
                envPath = env_test2;
                break;
            case "formal":
                envPath = env_formal;
                break;
            case "dev":
                envPath = env_dev;
                break;
            default:
                envPath = env_formal;
                break;
        }
        resolve(envPath);
        // return envPath;
    })
    
  }

function envPathUserInfo() {
    return new Promise ((resolve,reject)=>{
        var env = getUrlParam('env');
        var envPath = "";
        switch (env) {
            case "test":
                envPath = env_test_user;
                break;
            case "formal":
                envPath = env_formal_user;
                break;
            case "dev":
                envPath = env_dev_user;
                break;
            default:
                envPath = env_formal_user;
                break;
        }
        resolve(envPath);
    })
    
}

function fixedBody(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    document.body.style.cssText += 'position:fixed;top:-'+scrollTop+'px;';
}

function looseBody() {
    var body = document.body;
    body.style.position = '';
    var top = body.style.top;
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
    body.style.top = '';
}


export {
    getUserAuthCode,
    getUrlParam,
    dealCodeStatus,
    envPath,
    envPathUserInfo,
    fixedBody,
    looseBody
} 