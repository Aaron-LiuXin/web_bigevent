$(function() {
    getUserInfo();
});

// 渲染用户头像
function renderAvatar(user) {
    // 拿到名字,有昵称用昵称，没有，用用户名
    var name = user.nickname || user.username;
    // 把名字填上去
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    // 判断是否有用户照片,有就用。没有就使用文本头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

// 退出的功能
var layer = layui.layer;
$('#btnLogout').on('click', function() {

    //用layui的confirm确认框来实现退出
    layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
        // 退出清除localstorage的token
        localStorage.removeItem('token');
        // ，重新跳转登录页面
        location.href = '/login.html';
        layer.close(index);
    });
})

// 获取用户信息，来渲染页面
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 这是为进入后台需要接口权限的页面设置的请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                renderAvatar(res.data);
            }
            // 不论请求成功还是失败，都要执行这个complete回调函数
            // 如果不登录直接改url地址为index页面，强制跳转登录页面
            // 这就相当于控制了用户的登录权限，不登录，没有token永远到不了index页面
            // 这里也把它放到baseAPI里面
            // complete: function(res) {
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 清本地存储的token
            //         localStorage.removeItem('token');
            //         // 强制跳转回登录页面
            //         location.href = '/login.html';
            //     }
            // }

    });
}