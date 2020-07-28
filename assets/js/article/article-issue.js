$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)
    initEditor()
    infocate()
        //获取下拉菜单
    function infocate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('菜单获取失败');
                }
                var str = template('issue-add', res);
                $('[name=cate_id]').html(str);
                form.render();
            }
        })
    }

    $('.catebtn').on('click', function() {
        $('#file').click();
    })

    $('#file').on('change', function(e) {
        var files = e.target.files;
        if (files.length == 0) {
            return;
        }
        var image = URL.createObjectURL(files[0]);
        //销毁旧图片，添加新图片
        $image.cropper('destroy').attr('src', image).cropper(options);
    })
    var cate = '发布';
    $('.btncaogao').on('click', function() {
        cate = '草稿';
    })

    $('#form-add').on('submit', function(e) {
        e.preventDefault();
        var df = new FormData($(this)[0]);
        df.append('state', cate);

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                df.append('cover_img', blob);
                //发起ajax请求

                publish(df);
            })

    })

    function publish(df) {

        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: df,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('发布失败');
                }
                layer.msg('发布成功');

            }
        })
    }

})