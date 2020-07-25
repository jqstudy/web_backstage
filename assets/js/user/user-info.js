$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间';
            }
        }
    })

    // 1.获取用户信息
    function userinfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('身份验证失败');
                }
                form.val('user-form', res.data);

            }
        })
    }
    userinfo()


    //2.实现表单的重置效果
    $('#reset').on('click', function(e) {
        e.preventDefault();
        userinfo();
    })

    //3.点击提交按钮，更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //到父元素调用index.js中的方法重新渲染页面
                window.parent.getmessage();

            }
        })
    })


})