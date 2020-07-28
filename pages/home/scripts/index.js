
import * as functionMode from '../../../common/scripts/export.js';
//20200228CMCCRecharge

var authCode = "",
    isVip = false,
    rootId = $('#getdata').attr('data-rootId'),
    taskIdRecharge = $('#getdata').attr('data-taskIdRecharge'),
    taskIdShare = $('#getdata').attr('data-taskIdShare'),
    taskIdFollow = $('#getdata').attr('data-taskIdFollow');
functionMode.envPath()
  .then(env_path => {

    document.addEventListener('resume', function(e) {
      $('.vip-alert').hide();
      AlipayJSBridge.call('showLoading', {
        text: '加载中',
      });
      
      functionMode.getUserAuthCode()
        .then (authCode => {
          queryUserInfo(authCode);
          getPVNumber(authCode);
          checkTaskStatus(authCode, taskIdFollow);

        })
        .catch (() => {
          AlipayJSBridge.call('toast', {
            content: '授权失败，请稍后再试',
            duration: 2000
          });
        })
    }, false);
    
    // 点击"分享"
    $(".jsCheckShare").on('click', function () {
      doTask(`${taskIdShare}`)
    })

    // "去关注"按钮
    $('.follow-task').on('click', function() {
      doTask(taskIdFollow);
      let url = $(this).data('link');
      setTimeout(function() {
        AlipayJSBridge.call('pushWindow', {
          url
        });
      }, 200)
    })

    // 做任务得抽奖次数
    function doTask(taskId){
      functionMode.getUserAuthCode()
        .then (authCode => {
          $.ajax({
            type: 'GET',
            url: `${env_path}/mobileButterfly/activity/doTopUpTask?authcode=${authCode}&rootId=${rootId}&atNum=${taskId}&winnings=0`,
            /* data: {
              authCode: authCode,
              rootId: rootId,
              atNum: taskId,
              winnings: '2'

            }, */
            xhrFields: {
              withCredentials: true    // 前端设置是否带cookie
            },
            dataType:'json',
            timeout: 15000,
            success: function (res) {
              
            },
            error: function (xhr, type) {
              AlipayJSBridge.call('toast', {
                content: '网络错误，请稍后重试',
                type: 'fail',
                duration: 2000
              });
              AlipayJSBridge.call('hideLoading');
            }
          })
        })
    }

    // 查询用户任务状态
    function checkTaskStatus(authCode, taskId) {
      
          $.ajax({
            type: 'GET',
            url: `${env_path}/mobileButterfly/activity/queryUserTaskStatus?authcode=${authCode}&rootId=${rootId}`,
            xhrFields: {
              withCredentials: true    // 前端设置是否带cookie
            },
            dataType:'json',
            timeout: 15000,
            success: function (res) {
              if(res.code === '10000' && res.data && res.data.length) {
               res.data.forEach(item => {
                 for(var key in item) {
                   if(key === taskId){
                     if(item[key] == true) {//已完成关注生活号任务
                        $('.follow-task-completed').show().prev().hide();
                     }
                   }
                 }
               })
              }
            }
          })
        
    }

    // 点击权益列表
    $('.rights-list').on('click', 'li', function() {
        if(!isVip) {// 不是尊享用户
            console.log('不是尊享用户！！！');
            $('#list-alert').show().prev().hide().parent().show();
            return;
        }
        var link = $(this).data('link');
        AlipayJSBridge.call('pushWindow', {
            url: link,
        });
    })

    // 抽奖
    $('.get-my-prize').on('click', function () {
        if(!isVip) {// 不是尊享用户
            console.log('不是尊享用户！！！');
            $('#lottery-alert').show().next().hide().parent().show();
            return;
        }

        AlipayJSBridge.call('showLoading', {
        text: '抽奖中…',
        });
        var $This = $(this);
        let url = '/mobileButterfly/activity/draw';
        drewPrize($This, url, rootId);
    })
    // 具体抽奖行为
    function drewPrize ($This, url, rootId) {
      functionMode.getUserAuthCode()
      .then (authCode => {
        $.ajax({
          type: 'GET',
          url: `${env_path}${url}?authcode=${authCode}&rootId=${rootId}`,
          xhrFields: {
            withCredentials: true    // 前端设置是否带cookie
          },
          dataType:'json',
          timeout: 15000,
          success: function (res) {
            // alert(JSON.stringify(res));
            console.log(res);
            // $('body').css('position','fixed');
            functionMode.fixedBody();
            AlipayJSBridge.call('hideLoading');
            switch(res.code) {
              case '10000':
                let prizeData = res.data.prizes;
                prizeData.forEach((item) => {
                  loadDealAlert(item);
                })
                break;
             
              case '20009': //抽奖未中奖
                // $('#no-prize, .fd-allresultalert').show();
                $('#not-start-or-ended p').html('分享给好友或邀请好友开通<br>额外有1次抽奖机会');
                $('#not-start-or-ended, .fd-allresultalert').show();
                break;

              case '30000':
                AlipayJSBridge.call('toast', {
                  content: '必要参数为空',
                  duration: 2000
                });
                // $('body').css('position','static');
                functionMode.looseBody();
                break;
              case '30003': // 快去做任务获取抽奖机会
                $('#no-chance p').html('快去做任务获取抽奖机会');
                $('#no-chance, .fd-allresultalert').show();
              
                break;
             
              case '30004': // 抽奖次数用尽
                AlipayJSBridge.call('toast', {
                  content: '抽奖次数已耗尽！',
                  duration: 2000
                });
                // $('body').css('position','static');
                functionMode.looseBody();
                break;

             
              case '41001':
                AlipayJSBridge.call('toast', {
                  content: '活动不存在',
                  duration: 2000
                });
                // $('body').css('position','static');
                functionMode.looseBody();
                break;
              case '41002':  
                $('#not-start-or-ended p').html('活动已结束！下次记得早点来哦！'); 
                $('#not-start-or-ended, .fd-allresultalert').show();
                break;
              case '41003':   
                $('#not-start-or-ended p').html('活动还未开始，请耐心等一等哦');
                $('#not-start-or-ended, .fd-allresultalert').show();
                break;
              
              case '40004':
                AlipayJSBridge.call('toast', {
                  content: '系统异常，请稍后再试',
                  duration: 2000
                });
                // $('body').css('position','static');
                functionMode.looseBody();
                break;

              default:
                $('#not-start-or-ended p').html('分享给好友或邀请好友开通<br>额外有1次抽奖机会');
                $('#not-start-or-ended, .fd-allresultalert').show();
                break;
            }
          },
          error: function (xhr, type) {
            AlipayJSBridge.call('hideLoading');
            AlipayJSBridge.call('toast', {
              content: '网络错误，请稍后重试',
              type: 'fail',
              duration: 2000
            });
            // $('body').css('position','static');
            functionMode.looseBody();
          }
        })
      })
    }
    // 处理中奖后的行为
    function loadDealAlert (item) {
      // $('#normal-prize .fd-allresultalert-container-content ul li').hide();
      let couponName = item.aacName;
      let rotateIndex = 0;
      let prizeDom = $('#normal-prize .fd-allresultalert-container-content');
      prizeDom.find('.prize-item-content img').attr('src','');
      if (parseInt(item.aacType) === 2) {
        prizeDom.find('.get-prize-button img').eq(0).hide()
        prizeDom.find('.get-prize-button img').eq(1).show()
        if (parseInt(item.aacSubType) === 0 ) { // 话费券
          if (couponName.indexOf('话费') >= 0) {
            couponName = couponName.split('话费')[0];
            couponName = couponName.split('￥')[0];
            couponName = couponName.split('元')[0];
          }
          prizeDom.find('.get-prize-button').attr('data-audlid',item.audlId);
          prizeDom.find('.get-prize-button').attr('data-aacname',couponName);
          prizeDom.find('.get-prize-button').attr("id","show-prize500");
          // prizeDom.show();
        } else if (item.aacSubType === 1) { // 普通实物奖品
          // prizeDom.find('.get-prize-button').attr("data-link",item.aacVeriflyUrl);
          prizeDom.find('.get-prize-button').attr('data-audlid', item.audlId);
          prizeDom.find('.get-prize-button').attr('data-aacname', couponName);
          prizeDom.find('.get-prize-button').attr("id", "show-prizeP30Pro");
          // prizeDom.show();
        }
      } else {
        prizeDom.find('.get-prize-button img').eq(0).show()
        prizeDom.find('.get-prize-button img').eq(1).hide()
        prizeDom.find('.get-prize-button').attr('id', 'get-prize-button');
        prizeDom.find('.get-prize-button').attr("data-link", item.aacVeriflyUrl);
      }
      prizeDom.find('.prize-item-content img').attr('src', item.aacIconUrl);
      prizeDom.find('.prize-item-content .prize-item-title').empty().html(`${item.aacName}`);
      prizeDom.find('.prize-item-content .prize-item-desc').empty().html(`${item.aacDesc}`);
      $('.fd-allresultalert, #normal-prize').show();     
    }

    // 查看我的奖品(普通奖品)
    $('body').on('click', '.check-my-prize', function () {
      console.log('我的奖品！！！');
      var $This = $(this);
      let url = '/user/getPrizes';
      //window.scrollTo(0, $('.prize-area').offset().top - $('.button-and-info').height()/2)
      //$('body').css('position','fixed');
      //$('.fd-allresultalert, #my-prize').show();
      checkMyPrize($This, url, rootId)
    })
    function checkMyPrize ($This, url, rootId) {
      functionMode.getUserAuthCode()
        .then (authCode => {
          $.ajax({
            type: 'POST',
            url: `${env_path}${url}`,
            data: {
              authCode,
              rootId
            },
            xhrFields: {
              withCredentials: true    // 前端设置是否带cookie
            },
            dataType:'json',
            timeout: 15000,
            success: function (res) {
              console.log(res)
             
              functionMode.fixedBody();
              switch(res.code) {
                case '10000':
                  var prizeData = res.data;
                  console.log('获得的数据：'+JSON.stringify(prizeData))
                  $('.fd-allresultalert, .fd-allresultalert-container').hide();
                  $('#my-prize ul').html('');
                  prizeData.forEach((item) => {
                    console.log(item)
                    let dom = '', buttonDom = '', couponName = item.aacName, buttonBg = $('#my-prize ul').data('buttonbg') ;
                    let prizeType = '';
                    // 根据奖品类行进行数据处理
                    if (item.aacType ==2&&item.aacSubType==0) { // 话费券奖品
                      if (couponName.indexOf('话费') >= 0) {
                        couponName = couponName.split('话费')[0];
                        couponName = couponName.split('￥')[0];
                        couponName = couponName.split('元')[0];
                      }
                      prizeType = 'show-prize500';
                    } else if (item.aacType ==2&&item.aacSubType==1) { // 华为手机奖品
                      prizeType = 'show-prizeP30Pro';
                    } else { // 其他奖品，直接跳链接
                      prizeType = 'get-prize-button';
                    }
                    // 针对未领取、已领取进行处理
                    if (parseInt(item.audlCardStatus) === 1) { // 未领取
                      if( (item.aacType ==2&&item.aacSubType==0) || (item.aacType ==2&&item.aacSubType==1) ){
                        buttonDom = `<div id="${prizeType}" data-aacname="${couponName}" data-audlid="${item.audlId}" class="prize-ready-use" data-link="${item.aacVeriflyUrl}" style="background-image: url(${buttonBg})">立即领取</div>`;
                        console.log("未领取")
                      }else{
                        buttonDom = `<div id="${prizeType}" data-aacname="${couponName}" data-audlid="${item.audlId}" class="prize-ready-use" data-link="${item.aacVeriflyUrl}" style="background-image: url(${buttonBg})">去使用</div>`;
                        console.log("去使用")
                      }                      
                    } else if (parseInt(item.audlCardStatus) === 0) { // 已领取
                      buttonDom = `<div class=" prize-used" style="background-image: url(${buttonBg})">已领取</div>`
                      console.log("已领取")
                    }
                    dom = `<li class="prize-item">
                            <div class="prize-icon">
                              <img src="${item.aacIconUrl}" />
                            </div>
                            <div class="prize-info">
                              <div class="prize-info-title">${item.aacName}</div>
                              <div class="prize-info-desc">${item.aacDesc}</div>
                            </div>
                           ${buttonDom}
                          </li>`
                    
                      console.log('dom:'+dom)
                      $('#my-prize ul').append(dom);
                      $('.fd-allresultalert, #my-prize').show();
                  })
                  
                 
                  break;
                case '30014': // 没有中奖记录
                  $('#no-prize p').html('您还没有抽中任何奖品哦<br>快去抽奖吧');
                  $('#no-prize, .fd-allresultalert').show();
                  break;
                // case '30009': // 没有中奖记录
                //   $('#no-prize p').html('您还没有抽中任何奖品哦<br>快去抽奖吧');
                //   $('#no-prize, .fd-allresultalert').show();
                //   break;
                default:
                  functionMode.dealCodeStatus(res.code);
                  break;
              }
            },
            error: function (xhr, type) {
              AlipayJSBridge.call('toast', {
                content: '网络错误，请稍后重试',
                type: 'fail',
                duration: 2000
              });
              // $('body').css('position','static');
              functionMode.looseBody();
            }
          })
        })
    }
    
    // 领取500元话费/100元话费/500元话费券奖品
    $('.fd-allresultalert').on('click','.get-500prize-button', function () {
      var $This = $(this);
      // var phone1 = $('#getPrizeTel').val();
      var phone = $(this).parent().find('input').val();
      var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(phone)) {
        AlipayJSBridge.call('toast', {
            content: '请输入正确的手机号码',
            duration: 2000
        });
        return false;
      }
      functionMode.getUserAuthCode()
        .then (authCode => {
          $.ajax({
            type: 'GET',
            url: `${env_path}/user/updatePrizeInfo?authCode=${authCode}&rootId=${rootId}&mobile=${phone}&audlId=${ $This.data('audlid')}`,
            xhrFields: {
              withCredentials: true    // 前端设置是否带cookie
            },
            dataType:'json',
            timeout: 15000,
            success: function (res) {
              // $('body').css('position','static');
              functionMode.looseBody();
              switch(res.code) {
                case '10000':
                  $('.fd-allresultalert, .fd-allresultalert-container, .prize500').hide();
                  $('#not-start-or-ended p').html('提交成功');
                  $('#not-start-or-ended, .fd-allresultalert').show();
                  break;
                case '41001': // 活动不存在
                  AlipayJSBridge.call('toast', {
                      content: '活动不存在',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .prize500').hide();
                  });
                  break;
                case '41002': // 活动已结束
                  AlipayJSBridge.call('toast', {
                      content: '活动已结束',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .prize500').hide();
                  });
                  break;
                case '41003': // 活动未开始
                  AlipayJSBridge.call('toast', {
                      content: '活动未开始',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .P30-alert').hide();
                  });
                  break;
                case '30011': // 没有中奖记录
                  AlipayJSBridge.call('toast', {
                      content: '无中奖记录',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .prize500').hide();
                  });
                  break;
                case '30012': // 没有中奖记录
                  AlipayJSBridge.call('toast', {
                      content: '重复领取',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .prize500').hide();
                  });
                  break;
                default:
                  $('.fd-allresultalert, .fd-allresultalert-container, .prize500').hide();
                  $('#not-start-or-ended p').html('提交失败，请稍后再试！');
                  $('#not-start-or-ended, .fd-allresultalert').show();
                  break;
              }
              $('#getPrizeTel').val('');
            },
            error: function (xhr, type) {
              AlipayJSBridge.call('toast', {
                content: '网络错误，请稍后重试',
                type: 'fail',
                duration: 2000
              });
            }
          })
        })
    })

    // 领取实物奖品
    $('.fd-allresultalert').on('click','.get-P30prize-button', function () {
      var $This = $(this);
      

      var phone = $(this).parent().find('input').eq(1).val(),
          name = $(this).parent().find('input').eq(0).val(),
          address = $(this).parent().find('input').eq(2).val();

      var nameLength = name.replace(/[^\x00-\xff]/g, 'xx').length,
          addressLength = address.replace(/[^\x00-\xff]/g, 'xx').length;
      var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/

      if (nameLength < 4 || nameLength > 30) {
        AlipayJSBridge.call('toast', {content: '请输入正确的姓名',});
        return false;
      }
      if (!reg.test(phone)) {
        AlipayJSBridge.call('toast', {content: '请输入正确的手机号码',});
        return false;
      }
      if (addressLength < 8 || addressLength > 40) {
        if (addressLength < 8) {
          AlipayJSBridge.call('toast', {content: '地址信息太少，请输入有效地址',});
        } else {
          AlipayJSBridge.call('toast', {content: '地址过长，请重新输入',});
        }
        return false;
      }
      functionMode.getUserAuthCode()
        .then (authCode => {
          $.ajax({
            type: 'POST',
            url: `${env_path}/user/saveAddressInfo`,
            data: {
              authCode: authCode,
              rootId: rootId,
              mobile: phone,
              audlId: $This.data('audlid'),
              address: address,
              name: name
            },
            xhrFields: {
              withCredentials: true    // 前端设置是否带cookie
            },
            dataType:'json',
            timeout: 15000,
            success: function (res) {
              // $('body').css('position','static');
              functionMode.looseBody();
              switch(res.code) {
                case '10000':
                  $('.fd-allresultalert, .fd-allresultalert-container, .P30-alert').hide();
                  $('#not-start-or-ended p').html('提交成功');
                  $('#not-start-or-ended, .fd-allresultalert').show();
                  break;
                case '41001': // 活动不存在
                  AlipayJSBridge.call('toast', {
                      content: '活动不存在',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .P30-alert').hide();
                  });
                  break;
                case '41002': // 活动已结束
                  AlipayJSBridge.call('toast', {
                      content: '活动已结束',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .P30-alert').hide();
                  });
                  break;
                case '41003': // 活动未开始
                  AlipayJSBridge.call('toast', {
                      content: '活动未开始',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .P30-alert').hide();
                  });
                  break;
                case '30011': // 没有中奖记录
                  $('#no-prize p').html('您还没有抽中任何奖品哦<br>快去抽奖吧');
                  $('#no-prize, .fd-allresultalert').show();
                  break;
                case '30012': // 没有中奖记录
                  AlipayJSBridge.call('toast', {
                      content: '重复领取',
                      duration: 2000
                  }, function () {
                    $('.fd-allresultalert, .fd-allresultalert-container, .P30-alert').hide();
                  });
                  break;
                default:
                  $('.fd-allresultalert, .fd-allresultalert-container, .P30-alert').hide();
                  $('#not-start-or-ended p').html('提交失败，请稍后再试！');
                  $('#not-start-or-ended, .fd-allresultalert').show();
                  break;
              }
            
              $('#getBigPrizeTel').val(),
              $('#getBigPrizeName').val(),
              $('#getBigPrizeAddr').val();
            },
            error: function (xhr, type) {
              AlipayJSBridge.call('toast', {
                content: '网络错误，请稍后重试',
                type: 'fail',
                duration: 2000
              });
            }
          })
        })
    })

    // 去使用优惠券
    $('.fd-allresultalert').on('click','.use-card-coupon', function () {
      var link = $(this).data('link');
      AlipayJSBridge.call('pushWindow', {
        url: link
      });
    })

    // 领取奖品——暂时用不上
    $('.fd-allresultalert').on('click','.get-card-coupon',function () {
      var $This = $(this);
      functionMode.getUserAuthCode()
      .then (authCode => {
        $.ajax({
          type: 'POST',
          url: `${env_path}/user/updatePrizeStatus`,
          data: {
            authCode: authCode,
            rootId: rootId,
            audlId: $This.data('audlid')
          },
          xhrFields: {
            withCredentials: true    // 前端设置是否带cookie
          },
          dataType:'json',
          timeout: 15000,
          success: function (res) {
            console.log(res);
            // $('body').css('position','static');
            functionMode.looseBody();
            switch(res.code) {
              case '10000':
                var couponId = $This.data('couponid');
                $This.find('img').first().attr('src','https://gw.alipayobjects.com/os/q/cms/images/jw1usdn8/ec54cb76-ea7e-45f2-b102-66ade8c69b9f_w130_h65.png');
                $This.removeClass('get-card-coupon');
                $This.addClass('use-card-coupon');
                $('.fd-allresultalert, .fd-allresultalert-container').hide();
                AlipayJSBridge.call('pushWindow', {
                  url: 'https://render.alipay.com/p/s/mygrace/ndetail.html?__webview_options__=sms%3DYES%26pd%3DNO&type=VOUCHER&id='+couponId
                });
                break;
              case '41001': // 活动不存在
                functionMode.dealCodeStatus(res.code);
                $('.fd-allresultalert, .fd-allresultalert-container').hide();
                break;
              case '41002': // 活动已结束
                functionMode.dealCodeStatus(res.code);
                $('.fd-allresultalert, .fd-allresultalert-container').hide();
                break;
              case '41003': // 活动未开始
                functionMode.dealCodeStatus(res.code);
                $('.fd-allresultalert, .fd-allresultalert-container').hide();
                break;
              case '30011': // 没有中奖记录
                AlipayJSBridge.call('toast', {
                    content: '无中奖记录',
                    duration: 2000
                });
                $('.fd-allresultalert, .fd-allresultalert-container').hide();
                break;
              default:
                AlipayJSBridge.call('toast', {
                    content: '领取失败',
                    type: 'fail',
                    duration: 2000
                }, function () {
                  $('.fd-allresultalert, .fd-allresultalert-container').hide();
                });
                // $('body').css('position','static');
                functionMode.looseBody();
                break;
            }
            $('#getPrizeTel').val('');
          },
          error: function (xhr, type) {
            AlipayJSBridge.call('toast', {
              content: '网络错误，请稍后重试',
              type: 'fail',
              duration: 2000
            });
            // $('body').css('position','static');
            functionMode.looseBody();
          }
        })
      })
    })

    // 查询用户抽奖状态
    function loadMyTaskStatus () {
      functionMode.getUserAuthCode()
      .then (authCode => {
        $.ajax({
          type: 'POST',
          url: `${env_path}/user/getRechargeStatus`,
          data: {
            authCode: authCode,
            rootId: rootId
          },
          xhrFields: {
            withCredentials: true    // 前端设置是否带cookie
          },
          dataType:'json',
          timeout: 15000,
          success: function (res) {
            AlipayJSBridge.call('hideLoading');
            switch(res.code) {
              case '10000':
                if(res.data) {
                }
                break;
              default:
                functionMode.dealCodeStatus(res.code);
                break;
            }
          },
          error: function (xhr, type) {
            AlipayJSBridge.call('toast', {
              content: '网络错误，请稍后重试',
              type: 'fail',
              duration: 2000
            });
            AlipayJSBridge.call('hideLoading');
          }
        })
      })
    }

    //查询人数
    function getPVNumber (authcode) {
      
          $.ajax({
            type: 'POST',
            url: `${env_path}/mobileButterfly/activity/getDrawCount`,
            data: {
              authcode,
              rootId
            },
            xhrFields: {
                withCredentials: true    // 前端设置是否带cookie
            },
            dataType:'json',
            timeout: 15000,
            success: function (res) {
              console.log(res)
              AlipayJSBridge.call('hideLoading');
              switch(res.code) {
                case '10000':
                  let number = res.data;
                  var target = $('.user-num-info label span');
                  var baseNum = target.data('num');
                  if (baseNum < number) {
                    NumAutoPlusAnimation(target, {
                      time: 2000,
                      num: number,
                      regulator: 50,
                      baseNumber: baseNum
                    })
                  }
                  break;
                default:
                  // functionMode.dealCodeStatus(res.code);
                  break;
              }
              setTimeout(function () {
                getPVNumber();
              },4000)
            },
            error: function (xhr, type) {
              AlipayJSBridge.call('hideLoading');
              AlipayJSBridge.call('toast', {
                content: '网络错误，请稍后重试',
                type: 'fail',
                duration: 2000
              });
            }
          })
       
    }

    function queryUserInfo (authCode) {
      functionMode.envPathUserInfo()
        .then(env_path_user => {
          $.ajax({
              type: 'POST',
              url: `${env_path_user}/yunfengdie/queryUserInfo`,
              data: {
                  authCode: authCode
              },
              xhrFields: {
                  withCredentials: true    // 前端设置是否带cookie
              },
              dataType:'json',
              timeout: 15000,
              success: function (res) {
                  console.log(res)
                  AlipayJSBridge.call('hideLoading');
                  if(res.code === '10000' && res.data && res.data.userLevel === '2') {//用户是尊享会员
                      isVip = true;
                      doTask(taskIdRecharge);
                      $('.vip-no').hide().next().show();
                  } else {// 非尊享会员
                      isVip = false;
                      $('.vip-no').show().next().hide();
                  }
          
              },
              error: function (xhr, type) {
                  AlipayJSBridge.call('hideLoading');
                  AlipayJSBridge.call('toast', {
                      content: '网络错误，请稍后重试',
                      type: 'fail',
                      duration: 2000
                  });
              }
          })
        })

    }

    // 数字动态显示
    function NumAutoPlusAnimation(targetEle, options) {
      options = options || {};
      var $this = targetEle,
          time = options.time, // 总时间--毫秒为单位
          finalNum = options.num, // 要显示的真实数值（最大值）
          baseNumber = options.baseNumber, // 要显示的基础数值（从此数值开始变化）
          regulator = options.regulator, // 调速器，改变regulator的数值可以调节数字改变的速度
          step = (finalNum - baseNumber)  / (time / regulator), /*每40ms增加的数值--*/
          count = baseNumber, //计数器
          initial = 0;

      var timer = setInterval(function() {
        count = count + step;
        if(count >= finalNum) {
          clearInterval(timer);
          count = finalNum;
        }
        //t未发生改变的话就直接返回
        //避免调用text函数，提高DOM性能
        var t = Math.floor(count);
        if(t == initial) return false;
        initial = t;
        $this.html(initial);
        $this.attr('data-num', initial);
      }, 30);
    }
    
    function ready(callback) {
      // 如果jsbridge已经注入则直接调用
      if (window.AlipayJSBridge) {
        callback && callback();
      } else {
        // 如果没有注入则监听注入的事件
        document.addEventListener('AlipayJSBridgeReady', callback, false);
      }
    }
    ready(function () {
      AlipayJSBridge.call('showLoading', {
        text: '加载中',
      });
      AlipayJSBridge.call('hideOptionMenu');

      functionMode.getUserAuthCode()
        .then (authCode => {
          queryUserInfo(authCode);
          getPVNumber(authCode);
          checkTaskStatus(authCode, taskIdFollow);

        })
        .catch (() => {
          AlipayJSBridge.call('toast', {
            content: '授权失败，请稍后再试',
            duration: 2000
          });
        })
      
      // loadMyTaskStatus();
    });
  })