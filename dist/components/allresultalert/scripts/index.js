!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=11)}({0:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o="https://choujiang-test.19ego.cn",r="https://choujiang-test2.19ego.cn",a="https://choujiang.19ego.cn",l="https://choujiang-dev.19ego.cn",i="https://mfbizweb-test.19ego.cn",c="https://mfbizweb.19ego.cn",s="https://mfbizweb-dev.19ego.cn";function u(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),n=window.location.search.slice(1).match(e);return null!==n?decodeURI(n[2]):null}function d(){var t=document.body.scrollTop||document.documentElement.scrollTop;document.body.style.cssText+="position:fixed;top:-"+t+"px;"}function f(){var t=document.body;t.style.position="";var e=t.style.top;document.body.scrollTop=document.documentElement.scrollTop=-parseInt(e),t.style.top=""}e.getUserAuthCode=function(){return new Promise(function(t,e){AlipayJSBridge.call("getAuthCode",{scopeNicks:["auth_base"],appId:"2018121062528173",showErrorTip:!1},function(n){n.hasOwnProperty("authcode")?t(n.authcode):e()})})},e.getUrlParam=u,e.dealCodeStatus=function(t){switch(t){case"20000":AlipayJSBridge.call("toast",{content:"\u64cd\u4f5c\u5931\u8d25",duration:2e3}),f();break;case"30000":AlipayJSBridge.call("toast",{content:"\u5fc5\u8981\u53c2\u6570\u4e3a\u7a7a",duration:2e3}),f();break;case"41001":AlipayJSBridge.call("toast",{content:"\u6d3b\u52a8\u4e0d\u5b58\u5728",duration:2e3}),f();break;case"41002":d(),$("#not-start-or-ended p").html("\u6d3b\u52a8\u5df2\u7ed3\u675f\uff01\u4e0b\u6b21\u8bb0\u5f97\u65e9\u70b9\u6765\u54e6\uff01"),$("#not-start-or-ended, .fd-allresultalert").show();break;case"41003":d(),$("#not-start-or-ended p").html("\u6d3b\u52a8\u8fd8\u672a\u5f00\u59cb\uff0c\u8bf7\u8010\u5fc3\u7b49\u4e00\u7b49\u54e6"),$("#not-start-or-ended, .fd-allresultalert").show();break;default:AlipayJSBridge.call("toast",{content:"\u7cfb\u7edf\u5f02\u5e38\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",duration:2e3}),f()}},e.envPath=function(){return new Promise(function(t,e){var n="";switch(u("env")){case"test":n=o;break;case"test2":n=r;break;case"formal":n=a;break;case"dev":n=l;break;default:n=a}t(n)})},e.envPathUserInfo=function(){return new Promise(function(t,e){var n="";switch(u("env")){case"test":n=i;break;case"formal":n=c;break;case"dev":n=s;break;default:n=c}t(n)})},e.fixedBody=d,e.looseBody=f},11:function(t,e,n){"use strict";var o=n(0);window._component_allresultalert=function(t){function e(){$(".fd-allresultalert, .fd-allresultalert-container").hide(),(0,o.looseBody)()}function n(t,e){var n="",o=t.length;if(t.replace(/[^\x00-\xff]/g,"**").length<=e)return t;for(var r=0,a=0;r<o;r++){var l=t.charAt(r);if(/[\x00-\xff]/.test(l)?a++:a+=2,!(a<=e))return console.log(n),n;n+=l}}$(".close").click(function(){$("#no-prize,#no-chance,#goto-check").hide(),$(".fd-allresultalert-container input").val(""),e()}),$(".known-button").click(function(){$(this).closest("#no-prize").hide(),e()}),$(".go-charge-button").click(function(){var t=$(this).data("linkurl");AlipayJSBridge.call("pushWindow",{url:t}),$(this).closest("#no-chance").hide(),e()}),$(".goto-check-button").click(function(){$(this).closest("#goto-check").hide(),e()}),$(".fd-allresultalert").on("click","#get-prize-button",function(){var t=$(this).data("link");AlipayJSBridge.call("pushWindow",{url:t})}),$(".fd-allresultalert").on("click","#show-prize500",function(){var t=$(this).data("audlid"),e="\u8bf7\u8f93\u5165<span>"+$(this).data("aacname")+"\u5143</span>\u8bdd\u8d39\u9886\u53d6\u7684\u624b\u673a\u53f7\u7801";$(".prize500 .fd-allresultalert-container-title label").empty(),$(".prize500 .fd-allresultalert-container-title label").html(e),$(".fd-allresultalert, .fd-allresultalert-container").hide();var n='<div class="get-500prize-button" data-audlid="'+t+'"><img src="https://gw.alipayobjects.com/os/q/cms/images/k4c5136e/f565ed11-9bba-460f-b2f2-f51a585d8c88_w300_h85.png" /></div>';$(".prize500 .get-500prize-button").remove(),$(".prize500 .fd-allresultalert-container-content").append(n),$(".prize500, .fd-allresultalert").show()}),$(".fd-allresultalert").on("click","#show-prizeP30Pro",function(){var t=$(this).data("audlid");$(".fd-allresultalert, .fd-allresultalert-container").hide();var e='<div class="get-P30prize-button" data-audlid="'+t+'"><img src="https://gw.alipayobjects.com/os/q/cms/images/k4c5136e/f565ed11-9bba-460f-b2f2-f51a585d8c88_w300_h85.png" /></div>';$(".P30-alert .get-P30prize-button").remove(),$(".P30-alert .fd-allresultalert-container-content").append(e),$(".P30-alert, .fd-allresultalert").show()}),$(".fd-allresultalert").on("onpropertychange",".prize500-content-input input",function(){var t=$(this).val();11===t.toString().length?/^[1][3,4,6,5,7,8,9][0-9]{9}$/.test(t)?$(".error").css("opacity","0"):$(".error").css("opacity","1"):t.toString().length>11&&$(this).val(t.slice(0,11))}),$(".fd-allresultalert").on("blur",".prize500-content-input input",function(){var t=$(this).val();/^[1][3,4,6,5,7,8,9][0-9]{9}$/.test(t)?$(".error").css("opacity","0"):$(".error").css("opacity","1")}),$(".fd-allresultalert").on("input propertychange",".address",function(){var t,e;$(this).val().length>40?($(this).val(n($(this).val(),40)),console.log($(this).val())):(t=$(this),e=t[0],console.log(105),e.addEventListener("compositionstart",function(t){console.log(106)},!1),e.addEventListener("compositionend",function(e){console.log(110),t.val(n($(this).val(),40))},!1),console.log($(this).val()))}),$(".fd-allresultalert").on("blur",".address",function(){var t=$(this).val().replace(/[^\x00-\xff]/g,"xx").length;console.log(t),t>40&&$(this).val(n($(this).val(),40))})}}});