$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 1.获取文章内容
    function getcatelist() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('获取文章失败');
                }
                var str = template('cate', res);
                $('tbody').empty().html(str)
            }
        })
    }
    getcatelist()
    var index = null;
    // 2.点击添加分类，弹出层显示
    $('#btnadd').on('click', function() {
        index = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '250px'],
            content: $('#tempadd').html() //这里content是一个普通的String
        });
    })

    // 3.添加文章
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章失败');
                }
                layer.msg('添加文章成功');
                getcatelist();
                layer.close(index);
            }
        })
    })


    var indexredact = null;
    // 4.点击编辑按钮显示文章内容
    $('tbody').on('click', '.redact', function() {
        indexredact = layer.open({
            type: 1,
            title: '编辑文章类别',
            area: ['500px', '250px'],
            content: $('#temp-redact').html() //这里content是一个普通的String
        });

        var dataid = $(this).attr('data-Id');
        $.ajax({
            url: '/my/article/cates/' + dataid,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败');
                }
                form.val('temp-form', res.data);
            }
        })

    })

    $('body').on('submit', '#btn-redact', function(e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新文章失败');
                }
                layer.msg('更新文章成功');
                layer.close(indexredact);
                getcatelist();


            }
        })
    })
    $('tbody').on('click', '#btn-del', function() {
        var indexid = $(this).siblings().attr('data-id');
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + indexid,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    getcatelist();
                }
            })

            layer.close(index);
        });


    })
})