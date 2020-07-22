import { looseBody } from '../../../common/scripts/export.js';
window['_component_header&rule'] = function(id) {
  // 凤蝶组件入口函数，会自动注入组件的 id，
  // 可根据此 id 获取组件对应在页面上的 DOM 元素
  const component = document.getElementById(id);
  console.log('hello, this is fengdie component, id: ', id);
  $('.close-rule').click(function () {
    
    $(this).closest('.fd-rule').hide();
    looseBody();
  });
  $('.header-part-item').click(function () {
    var $This = $(this);
    console.log($This.attr('data-href'));
    AlipayJSBridge.call('pushWindow', {
      url: $This.attr('data-href'),
    });
  })
};


