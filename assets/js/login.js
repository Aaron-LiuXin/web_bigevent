$(function() {
    //点击切换注册和登录
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });


    // 表单校验，这里使用layui的verify方法
    // 这里去看文档奥
    var form = layui.form;
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    });

    // 实现注册表单的功能
    // 用leyui的layer的msg提示来实现注册成功或者失败的弹框
    var layer = layui.layer;
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录');
            //创建好用户名和密码直接跳转到登录页面
            $('#link_login').click();
        })
    });


    // 登录功能的实现
    // 这里可以用的$('#form_login').submit();一样的奥
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        // 直接用ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败');
                }
                console.log(res.token);
                layer.msg('登录成功');
                // 保存token，后面有些需要权限的接口要用
                localStorage.setItem('token', res.token);
                // 登陆成功后要取跳转到首页
                location.href = '/index.html';
            }
        });
    });























});