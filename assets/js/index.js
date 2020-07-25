$(function() {
    var layer = layui.layer;
    // 1.获取用户的基本信息


    getmessage();


    //点击退出按钮，回退到登录页面
    $('#log-out').on('click', function() {
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //清除本地存储的用户信息
            localStorage.removeItem('token');
            //跳转到登录页
            location.href = '/login.html';
            layer.close(index);
        });
    })


})

function getmessage() {
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('身份验证失败');
            }
            //渲染用户头像
            setapply(res);
        },
        //优化没登录也可以进入后台的事件
        // complete: function(res) {
        //     // console.log('执行了complete');
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清空本地用户信息
        //         localStorage.removeItem('token');
        //         //强制跳转登录页
        //         location.href = '/login.html';

        //     }
        // }

    })
}
//渲染用户头像
function setapply(user) {
    console.log(111);

    // 1.获取用户名
    var name = user.data.nickname || user.data.username;
    // 2.设置欢迎的文本
    $('.text-name').html('欢迎&nbsp;&nbsp;' + name);
    // 3.如果有用户头像则渲染，没有就用用户名头子母
    if (user.data.user_pic !== null) {

        $('.layui-nav-img').attr('src', user.data.user_pic).show();
        $('.text-user').hide();
    } else {
        $('.layui-nav-img').hide();
        var str = name[0].toUpperCase();
        $('.text-user').html(str).show();
    }
}