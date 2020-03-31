$(function () {
    //初始化可编辑表格
//     modelEdit();

//     //获取测试ip 列表
//     getApiUrl();

    var oTable = new TableInit();
    oTable.Init();
});


var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_test_api').bootstrapTable({
            url: '/api/search_api',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: true,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100, 500],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: 'id',
                width: '10'
            }, {
                field: 'product',
                title: '所属产品',
                width: '20'
            }, {
                field: 'module',
                title: '模块',
                width: '20'
            }, {
                field: 'name',
                title: '接口名称',
                width: '20'
            }, {
                field: 'url',
                title: '接口地址',
                width: '20'
            },
                {
                    field: 'operate',
                    title: '操作',
//                align: 'center',
                    formatter: function (value, row, index) {
                        var a = '<a href="javascript:;" onclick="window.location.href=(\'/api/edit_api?id=' + row.id + '\')">编辑</a> ';
                        var d = '<a href="javascript:;" onclick="window.location.href=(\'/api/test_api?id=' + row.id + '\')">测试</a> ';
                        var b = '<a href="javascript:;" onclick="delete_api(\'' + row.id + '\')">删除</a> ';
                        var div = "<div style='width:30px;'>" + a + d + b + "</div>";
                        return div;
                    }
                },
                {
                    field: 'osign_list',
                    title: '加密参数列表',
                    width: '50'
                }, {
                    field: 'description',
                    title: '备注'
//                width : '50'
                },
                {
                    field: 'paras',
                    title: '参数列表'
//                width : '50'
                }

            ]
        });
    };


    function operateFormatter(value, row, index) {
        return [
            '<button type="button" class="RoleOfEdit btn btn-default  btn-sm" style="margin-right:15px;">编辑</button>',
            '<button type="button" class="RoleOfDelete btn btn-default  btn-sm" style="margin-right:15px;">删除</button>'
        ].join('');
    }

    window.operateEvents = {
        'click .RoleOfEdit': function (e, value, row, index) {
            window.location.href = ('/add_test_api');
        },
        'click .RoleOfDelete': function (e, value, row, index) {
            alert("B");
        }
    }


    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            name: $("#name").val(),
            module: $("#module").val(),
            type: "test_api"
        };
        return temp;
    };
    return oTableInit;
};


function delete_api(active_id) {
    if (confirm("确认删除吗？")) {
        if (!active_id) {
            alert('Error！');
            return false;
        }
        $.ajax(
            {
                url: "/api/delete_api",
                data: {"id": active_id},
                type: "post",
                beforeSend: function () {
                    $("#tip").html("<span style='color:blue'>正在处理...</span>");
                    return true;
                },
                success: function (data) {
                    if (data.code = 200) {
                        alert('恭喜，删除成功！');
                        $("#tip").html("<span style='color:blueviolet'>恭喜，删除成功！</span>");


                        document.getElementById('btn_query').click();
                    } else {
                        $("#tip").html("<span style='color:red'>失败，请重试</span>");
                        alert('失败，请重试' + data.msg);
                    }
                },
                error: function () {
                    alert('请求出错');
                },
                complete: function () {

                }
            });

    }
    return false;
}

