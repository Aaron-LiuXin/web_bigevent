//调用jquery的get，post，ajax函数之前，
// 都会先调用这个函数

$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

});