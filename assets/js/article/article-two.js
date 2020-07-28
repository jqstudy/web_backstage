$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)
        // 初始化富文本编辑器
    initEditor();

    //获取地址栏参数
    var id = new URLSearchParams(location.search).get('id');
    console.log(id);

    //查询旧文章数据

    $.ajax({
        url: '/my/article/' + id,
        success: function(res) {
            //把旧数据进行表单填充
            form.val('art-form', res.data);
            //把当前所属分类传进去，进行默认判断
            initcate(res.data.cate_id);

            // 3. 初始化裁剪区域 把当前封面地址进行替换
            $image
                .cropper("destroy") // 销毁旧的裁剪区域
                .attr("src", "http://www.liulongbin.top:3007" + res.data.cover_img) // 重新设置图片路径
                .cropper(options); // 重新初始化裁剪区域
        }
    })

    function initcate(cateId = '') {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                res.cateId = cateId;
                var str = template('issue-add', res);
                $('#set-add').html(str);
                form.render();
            }
        })
    }

    //点击封面，选择图片
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

    var cate = '已发布';
    $('.btncaogao').on('click', function() {
        cate = '存为草稿';
    })

    //修改内容
    $('#form-add').on('submit', function(e) {
        e.preventDefault();
        //   formdata格式的额表单
        var fd = new FormData($(this)[0]);
        fd.append('state', cate);
        //把当前id加到文章中
        fd.append('Id', id);
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                //发起ajax请求
                publish(fd);
            })

    })

    function publish(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章修改失败');
                }
                layer.msg('文章修改成功');
                setTimeout(function() {
                    location.href = '/article/article-classify.html';
                }, 1000)
            }
        })
    }
})