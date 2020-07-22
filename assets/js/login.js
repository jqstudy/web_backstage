$(function() {
    //点击注册
    $('.link-login').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        //点击登录
    $('.link-reg').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    //接收layui的form
    var form = layui.form;
    //接收layui的layer
    var layer = layui.layer;
    //自定义验证一个规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //给再次确认密码添加验证规则
        repass: function(value) {
            // 1.value 输入密码表单的值
            // 2.比较value与确认密码是否一致
            // 3.不一致就return出去
            var repwd = $('.reg-box [name=password]').val();
            if (repwd !== value) {
                return '两次输入密码不一致';
            }
        }
    })

    //设置注册接口
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);

                }
                layer.msg('注册成功');
                setTimeout(function() {
                    $('.link-reg').click();
                }, 2000)
            }


        })

    })

    //设置登录接口
    $('#form-login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                //把获取的token存入本地
                localStorage.setItem('token', res.token);
                //跳转到index
                location.href = '/index.html';

            }

        })
    })

})