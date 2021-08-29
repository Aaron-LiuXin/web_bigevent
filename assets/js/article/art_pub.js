$(function() {
    initCate();
    initEditor(); //调用initEditor()方法，初始化富文本编辑器
    // 定义加载文章分类的方法
    var layer = layui.layer;
    var form = layui.form;
    // 初始化文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }
                // 调用模板引擎，渲染费雷德下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 要调用这个方法去，告诉layui要重新渲染
                form.render();
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);





    // 照片上传功能
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });

    // 监听coverFlie的change事件，并判断是否选择了文件
    // 把照片上传到服务器
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return;
        }
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });
    // 定义文章的发布状态
    var art_state = '已发布';
    // 当点击草稿，把文章状态变更成草稿
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    // 监听表单的submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // new了fd， 把submit传进去
        // 这样就有了title，cate-id，content3个值
        var fd = new FormData($(this)[0]);
        // 在把state属性加上
        fd.append('state', art_state);
        // 拿到封面，输出为弍文件对象

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，把它加到fd上。这样fd需要的5个值就全了
                //就可以把fd上传服务器
                fd.append('cover_img', blob);
                // 最后发起ajax请求    
                publishArticle(fd);
            })
    });

    // 发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 用jquery想服务器提交 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布文章成功后，跳转到文章列表页面
                //老师教的方法用这个，但是没有选项卡切换效果
                // location.href = '/article/art_list.html';
                window.parent.$('#art_list_btn').click(); //这个模拟人点击，有tab切换效果

            }
        });
    }




});