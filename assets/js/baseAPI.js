// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的地址
$.ajaxPrefilter(function(options) {
    //在发起请求前同意地址路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    //设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function(res) {
        // console.log('执行了complete');
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空本地用户信息
            localStorage.removeItem('token');
            //强制跳转登录页
            location.href = '/login.html';

        }
    }
})