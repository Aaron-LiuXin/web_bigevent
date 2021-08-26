$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在1-6个字符之间';
            }
        }
    });



    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res);
                // layui的方法form.val()快速给表单赋值
                form.val('formUserInfo', res.data);
            }
        });
    }

    // 点击重置，重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    });

    // 点击提交修改，去修改昵称和邮箱
    //修改成功之后，重新渲染回数据
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('提交修改失败');
                }
                layer.msg('提交修改成功');
                // 这里想渲染用户的头像和信息
                // 调用父页面的方法来重新渲染头像和昵称
                window.parent.getUserInfo();
            }
        })
    });



});