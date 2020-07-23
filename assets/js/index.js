$(function() {
    // 1.获取用户的基本信息
    function getmessage() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                console.log(res);

            }
        })
    }

    getmessage();
})