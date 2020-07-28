$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 1.存储文章列表数据
    var p = {
            pagenum: 1, //页码值
            pagesize: 2, //每页显示多少条数据
            cate_id: '', //文章分类的 Id
            state: '' //文章的状态
        }
        //时间过滤
    template.defaults.imports.datafrom = function(data) {
        var data = new Date(data);
        var y = data.getFullYear();
        var m = datatime(data.getMonth() + 1);
        var d = datatime(data.getDate());
        var h = datatime(data.getHours());
        var f = datatime(data.getMinutes());
        var s = datatime(data.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
    }

    function datatime(n) {
        return n < 10 ? '0' + n : n;
    }
    //渲染文章数据
    function getinfo() {
        $.ajax({
            url: '/my/article/list',
            data: p,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败');
                }


                var str = template('info-add', res);
                $('tbody').html(str);

                renderinit(res.total);
            }
        })
    }
    getinfo();
    initcate();

    //渲染下拉菜单分类
    function initcate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('下拉菜单更新失败');
                }

                var htmlstr = template('info-cate', res);
                $('[name=cate_id]').html(htmlstr);
                //调用layui方法，重新渲染下拉菜单
                form.render();
            }
        })

    }

    //点击筛选
    $('.btn-screen').on('submit', function(e) {
        e.preventDefault();
        var cateid = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        p.cate_id = cateid;
        p.state = state;
        getinfo();
    })

    //定义渲染分页方法
    function renderinit(total) {
        laypage.render({
            elem: 'pagebox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: p.pagesize,
            curr: p.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到单前页
                // console.log(obj.limit); //得到每页显示的页数
                //直接调用 getinfo();函数渲染页面会形成死循环
                //根据最新的p获取对应数据渲染数据列表
                p.pagenum = obj.curr;
                //把最新的条目数赋值
                p.pagesize = obj.limit;
                //首次不执行

                if (!first) {
                    getinfo();
                }
            }
        });
    }

    //点击删除按钮，根据id删除对应文章
    $('tbody').on('click', '.btn-del', function() {
        var len = $('.btn-del').length;

        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    //实现一页文章删除，页码自动减一
                    if (len === 1) {
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1;
                    }
                    getinfo();
                }
            })
            layer.close(index);
        });

    })


})