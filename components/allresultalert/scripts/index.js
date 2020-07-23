import { looseBody } from '../../../common/scripts/export.js';
window['_component_allresultalert'] = function(id) {
  // 凤蝶组件入口函数，会自动注入组件的 id，
  // 可根据此 id 获取组件对应在页面上的 DOM 元素
  $('.close').click(function () {
    $('#no-prize,#no-chance,#goto-check').hide();
    $('.fd-allresultalert-container input').val('');
    dealClose();
    // if($(this).closest('#my-prize').hasClass('my-prize')){
    //   //关闭我的奖品
      
    //   window.scrollTo({
    //       top: $('body').offset().height,
    //       behavior: "smooth"
    //   });
    // }
  })
  $('.known-button').click(function () {
    $(this).closest('#no-prize').hide();
    dealClose();
  })
  $('.go-charge-button').click(function() {
    var thisLink = $(this).data('linkurl');
    AlipayJSBridge.call('pushWindow', {
      url: thisLink
    });
    $(this).closest('#no-chance').hide();
    dealClose();
  })
  $('.goto-check-button').click(function () {
    // var thisLink = $(this).data('linkurl');
    // AlipayJSBridge.call('pushWindow', {
    //   url: thisLink
    // });
    $(this).closest('#goto-check').hide();
    dealClose();
  })
  //
  // $('.get-prize-button').click(function () {
  //   var thisLink = $(this).data('link');
  //   AlipayJSBridge.call('pushWindow', {
  //     url: thisLink
  //   });
  // })
  $('.fd-allresultalert').on('click', '#get-prize-button', function () {
    var thisLink = $(this).data('link');
    AlipayJSBridge.call('pushWindow', {
      url: thisLink
    });
  })

  function dealClose () {
    $('.fd-allresultalert, .fd-allresultalert-container').hide();
    // $('body').css('position','static');
    looseBody();
    
  }
  $('.fd-allresultalert').on('click', '#show-prize500', function () {
    var audlId = $(this).data('audlid');
    let couponName = $(this).data('aacname');
    // let alertTitle = `请输入<span>${couponName}元</span>话费领取的手机号码`;
    let alertTitle = `请输入领取话费奖的手机号`;
    $('.prize500 .fd-allresultalert-container-title label').empty();
    $('.prize500 .fd-allresultalert-container-title label').html(alertTitle);
    $('.fd-allresultalert, .fd-allresultalert-container').hide();
    var domData = `<div class="get-500prize-button" data-audlid="${audlId}"><img src="https://gw.alipayobjects.com/os/q/cms/images/k4c5136e/f565ed11-9bba-460f-b2f2-f51a585d8c88_w300_h85.png" /></div>`;
    $('.prize500 .get-500prize-button').remove();
    $('.prize500 .fd-allresultalert-container-content').append(domData);
    $('.prize500, .fd-allresultalert').show();
  })

  $('.fd-allresultalert').on('click', '#show-prizeP30Pro', function () {
    var audlId = $(this).data('audlid');
    
    // let alertTitle = `恭喜您获得${$(this).data('aacname')}`;
    // let alertTitle = `请填写您的收获地址和联系方式`;
    // $('.P30-alert .fd-allresultalert-container-title label').empty();
    // $('.P30-alert .fd-allresultalert-container-title label').html(alertTitle);
    $('.fd-allresultalert, .fd-allresultalert-container').hide();
    var domData = `<div class="get-P30prize-button" data-audlid="${audlId}"><img src="https://gw.alipayobjects.com/os/q/cms/images/k4c5136e/f565ed11-9bba-460f-b2f2-f51a585d8c88_w300_h85.png" /></div>`;
    $('.P30-alert .get-P30prize-button').remove();
    $('.P30-alert .fd-allresultalert-container-content').append(domData);
    $('.P30-alert, .fd-allresultalert').show();
  })

  $('.fd-allresultalert').on('onpropertychange','.prize500-content-input input', function () {
    var phone = $(this).val();
    var myreg = /^[1][3,4,6,5,7,8,9][0-9]{9}$/
    if (phone.toString().length === 11) {
      if (!myreg.test(phone)) {
        $('.error').css('opacity','1');
      } else {
        $('.error').css('opacity','0');
      }
    } else if (phone.toString().length > 11) {
      $(this).val(phone.slice(0, 11));
    }
  })
  $('.fd-allresultalert').on('blur','.prize500-content-input input', function () {
    var phone = $(this).val();
    var myreg = /^[1][3,4,6,5,7,8,9][0-9]{9}$/
    if (!myreg.test(phone)) {
      $('.error').css('opacity','1');
    }
    else {
      $('.error').css('opacity','0');
    }
  })
  $('.fd-allresultalert').on('input propertychange', '.address', function () {
    if($(this).val().length > 40) {
      $(this).val(cutStr($(this).val(), 40));
      console.log($(this).val())
    } else {
      Input_ValidateNum($(this));
      console.log($(this).val())
    }
  })
  $('.fd-allresultalert').on('blur', '.address', function () {
    var address = $(this).val();
    let len = address.replace(/[^\x00-\xff]/g, 'xx').length;
    console.log(len)
    if(len > 40) {
      $(this).val(cutStr($(this).val(), 40));
    }
  })
  function Input_ValidateNum(valDom) {
    var isInputZh = false;
    var search = valDom[0];
    console.log(105)
    search.addEventListener('compositionstart', function (e) {
      console.log(106)
      isInputZh = true;
    }, false);
    search.addEventListener('compositionend', function (e) {
      console.log(110)
      isInputZh = false;
      valDom.val(cutStr($(this).val(), 40));         
    }, false);
  }
  function cutStr(str,L){    
    var result = '',
      strlen = str.length, // 字符串长度
      chrlen = str.replace(/[^\x00-\xff]/g,'**').length; // 字节长度
    if (chrlen <= L) {return str;}
    for (var i=0,j=0; i<strlen; i++) {
        var chr = str.charAt(i);
        if(/[\x00-\xff]/.test(chr)){
          j++; // ascii码为0-255，一个字符就是一个字节的长度
        }else{
          j+=2; // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if (j<=L) { // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
          result += chr;
        } else { // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
          console.log(result)
          return result;
        }
    }
  }
};

