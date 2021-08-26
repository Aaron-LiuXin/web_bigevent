//调用jquery的get，post，ajax函数之前，
// 都会先调用这个函数

$.ajaxPrefilter(function(options) {
    // 在发起请求之前，加上固定的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 访问一些需要权限的接口，需要设置请求头
    //不是所有接口都需要加这个请求头
    // 判断url里面是否有/my/,有/my/才去加请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 不论请求成功还是失败，都要执行这个complete回调函数
    // 如果不登录直接改url地址为index页面，强制跳转登录页面
    // 这就相当于控制了用户的登录权限，不登录，没有token永远到不了index页面
    options.complete = function(res) {
        console.log(res);
        // 这的if我是觉得只判断一个status就足够了根本就不用||后面的message
        // 身份认证失败叹号还是中文叹号，我打出来一个英文的，肯定知道毛病处在这个判断上
        //就没想到全等下一个英文的叹号和中文的叹号它不一样
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败!') {
            // 清本地存储的token
            localStorage.removeItem('token');
            // 强制跳转回登录页面
            location.href = '/login.html';
        }
    }


});