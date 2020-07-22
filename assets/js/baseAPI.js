// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的地址
$.ajaxPrefilter(function(options) {
    //在发起请求前同意地址路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})