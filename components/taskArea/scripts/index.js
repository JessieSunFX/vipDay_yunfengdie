import Swiper from "swiper";
import { fixedBody, looseBody } from '../../../common/scripts/export.js';
window['_component_taskArea'] = function (id) {
  // 凤蝶组件入口函数，会自动注入组件的 id，
  // 可根据此 id 获取组件对应在页面上的 DOM 元素
  const component = document.getElementById(id);
  console.log('hello, this is fengdie component, id: ', id);
  //活动规则
  $('.jsCheckRule').click(function () {
    console.log('活动规则')
    fixedBody();
    $('.fd-rule').show();
  })

  // 点击“开通尊享会员抽大奖”
  $('.vip-no, .vip-alert .btn').on('click', function() {
    console.log('点击了-开通尊享会员抽大奖-按钮')
    var url = $(this).data('url');
    AlipayJSBridge.call('pushWindow', {
      url: url
    });
  })

  //底部banner跳转
  $('.bottom-prize').on('click', '.prize-item', function () {
    var thisLink = $(this).data('link');
    AlipayJSBridge.call('pushWindow', {
      url: thisLink
    });
  })

  //右侧浮窗
  $('.fd-taskArea').on('click', '.gotoBanner', function () {
    var thisLink = $(this).data('link');
    AlipayJSBridge.call('pushWindow', {
      url: thisLink
    });
  })
  //打开/关闭客服
  $('.jsopenserver,.jscloseserver').on('click', function () {
    if ($('.bot_fixed').hasClass('bot_fixed_tel_transform_show')) {
      setTimeout(_ => {
        $('.bot_fixedbg').css({
          "display": "none"
        });
      }, 200);
      $('.bot_fixed').removeClass('bot_fixed_tel_transform_show')
        .addClass('bot_fixed_tel_transform_hide');
    } else {
      $('.bot_fixedbg').css({
        "display": "block"
      });
      $('.bot_fixed').addClass('bot_fixed_tel_transform_show')
        .removeClass('bot_fixed_tel_transform_hide');
    }
  })
  $('.bot_fixedbg').on('click', function () {
    setTimeout(_ => {
      $('.bot_fixedbg').css({
        "display": "none"
      });
    }, 200);
    $('.bot_fixed').removeClass('bot_fixed_tel_transform_show')
      .addClass('bot_fixed_tel_transform_hide');
  })
  $(".bot_fixed").on('click', function (event) {
    let target = event.target.nodeName;
    if (target == 'UL' || target == 'DIV') {
      return false;
    }
  });

  

  // 分享
// data-shareTitle="{{config.shareCont.title}}" data-shareContent="{{config.shareCont.content}}" data-shareImageUrl="{{config.shareCont.imageUrl}}"  data-shareUrl="{{config.shareCont.url}}
  //let shareAlipay="alipays://platformapi/startapp?appId=20000920&url=";
  let shareTitle = $("#getShare").attr('data-shareTitle'),
      shareContent = $("#getShare").attr('data-shareContent'),
      shareImageUrl = $("#getShare").attr('data-shareImageUrl'),
      shareUrl = $("#getShare").attr('data-shareUrl');
     
  $(".jsCheckShare").on('click', function () {

    AlipayJSBridge.call('share', {
      'bizType': "testShareBizType",   // 标示业务类型，埋点时使用，不需要埋业务参数，可以设空
      'keepOrder': false, // 保持分享渠道的顺序,android 9.1 换新的分享组件以后不支持
      'channels': [{
        name: 'Weibo', //新浪微博
        param: {
          title: shareTitle,
          content: shareContent,
          imageUrl: shareImageUrl,
          captureScreen: true, //分享当前屏幕截图(和imageUrl同时存在时，优先imageUrl)
          url: shareUrl //分享跳转的url，当添加此参数时，分享的图片大小不能超过32K
        }
      }, {
        name: 'Weixin', //微信
        param: {
          title: shareTitle,
          content: shareContent,
          imageUrl: shareImageUrl,
          captureScreen: true,
          url: shareUrl
        }
      }, {
        name: 'WeixinTimeLine', //微信朋友圈
        param: {
          title: shareTitle,
          content: shareContent,
          imageUrl: shareImageUrl,
          captureScreen: true,
          url: shareUrl
        }
      }, {
        name: 'SMS', //短信
        param: {
          contentType: 'url',
          title: shareTitle,
          content: shareContent,
          imageUrl: shareImageUrl,
          url: shareUrl,
          // contentType和extData为人传人定制功能专用，无需求请勿设置，campId   活动ID （一定不能为空）
          
          //extData: 'targetUrl=http://d.alipay.com/rcr/expect.htm,slTargetUrl=http://m.alipay.com,campId=,bizId=biztest,bizName=bn,validDate=10800,length=8'
        }
      }, {
        name: 'CopyLink', //复制链接
        param: {
          url: shareUrl
        }
      }, {
        name: 'ALPTimeLine', //支付宝生活圈
        param: {
          contentType: 'url',    //必选参数,目前只支持"url"格式
          title: shareTitle,   //标题
          url: shareUrl,  //url
          iconUrl: shareImageUrl //icon
        }
      }, {
        name: 'ALPContact',   //支付宝联系人,9.0版本
        param: {   //请注意，支付宝联系人仅支持一下参数
          contentType: 'url',    //必选参数,目前支持支持"text","image","url"格式
          content: shareContent,    //必选参数,分享描述
          //iconUrl: "xxx",   //必选参数,缩略图url，发送前预览使用,
          imageUrl: shareImageUrl, //图片url
          url: shareUrl,   //必选参数，卡片跳转连接
          title: shareTitle,    //必选参数,分享标题
          memo: "",   //透传参数,分享成功后，在联系人界面的通知提示。
          //otherParams: {	//透传参数，额外的分享入参
            //extendData: "testXY",    //可选参数，额外的分享入参。服务器验证签名使用，由服务器@笑六 提前发给业务方
            //alipayUrl: 'alipays://xxxx' // 这种方式的url打开 不会跳转到h5中间页
          //}
        }
      },{
        //钉钉 DingTalkSession
        name: 'DingTalkSession', //钉钉
        param: {
          contentType: 'url',    //必选参数,目前只支持"url"格式
          title: shareTitle,   //标题
          url: shareUrl,  //url
          iconUrl: shareImageUrl //icon
        }
      }]
    }, function (result) {
    });
  })


  //暂时不用
  /*$('.fd-taskArea').on('click', '.guide-40G', function () {
    var thisLink = $(this).data('link');
    AlipayJSBridge.call('pushWindow', {
      url: thisLink
    });
  })
  // $('.check-more-prize').click(function () {
  //   var thisLink = $(this).data('link');
  //   AlipayJSBridge.call('pushWindow', {
  //     url: thisLink
  //   });
  // })
  // $('.check-3c-prize').click(function () {
  //   var thisLink = $(this).data('link');
  //   AlipayJSBridge.call('pushWindow', {
  //     url: thisLink
  //   });
  // })*/

   //swiper
  var mySwiper = new Swiper('.swiper-container-banner', {
    loop: true, // 循环模式选项
    pagination: {
      el: '.swiper-pagination-banner',
    },
    autoplay: {
      delay: 5000,
    },
    spaceBetween: 10,
  })

  // 抽奖弹框“关闭”按钮
  $('.vip-alert .vip-alert-close').on('click', function() {
    $('.vip-alert').hide();
  })
  // 防止滚动穿透
  $('.vip-alert').on('touchmove',function(e){
    e.preventDefault();
  },false);
 

  // 点击底部banner
  $('.gotoBanner').on('click', function() {
    var link = $(this).data('link');
    console.log(link)
    AlipayJSBridge.call('pushWindow', {
      url: link,
    });
  })
};
