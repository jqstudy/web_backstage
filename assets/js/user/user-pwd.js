$(function() {
    //自定义密码验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //新密码不能与原密码一致
        newpwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与原密码一致';
            }
        },
        repwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致';
            }
        }
    })

    //重置密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('重置密码失败');
                }
                layer.msg('重置密码成功');
                setTimeout(function() {

                    localStorage.removeItem('token');
                    window.parent.location.href = '/login.html';
                }, 1000)
            }
        })
    })
})