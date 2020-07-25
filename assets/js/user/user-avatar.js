$(function() {

    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    $('#btnupload').on('click', function() {
        $('#file').click();
    })

    $('#file').on('change', function(e) {
        //拿到事件源，看有没有选中图片
        var file = e.target.files;
        if (file.length === 0) {
            return;
        }
        var image = URL.createObjectURL(file[0]);
        //重新配置剪裁区域
        $image.cropper('destroy').attr('src', image).cropper(options);



    })

    //上传图片
    $('#confirm').on('click', function() {
        //拿到用户裁剪的图片
        var dataurl = $image.cropper('getCroppedCanvas', {
            //创建一个画布
            width: 100,
            height: 100
        }).toDataURL('image/png'); //将画布上的内容转为base64格式的图片

        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataurl
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('图片更新失败');
                }
                layer.msg('图片更新成功');
                //主页面重新渲染
                window.parent.getmessage();

            }
        })
    })
})