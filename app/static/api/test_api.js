$(function () {
    var id = $("#id").val();
    get_info(id);
});

function get_info(active_id) {
    if (!active_id) {
        alert("error");
        return false;
    }
    $.ajax(
        {
            url: "/api/info_api",
            data: {"id": active_id},
            type: "get",
            dataType: "json",
            success: function (data) {
                if (data) {
                    $("#name").val(data.name);
                    $("#description").val(data.description);
                    $("#url").val(data.url);
                    $("#product").val(data.product);
                    $("#module").val(data.module);
                    $("#osign_list").val(data.osign_list);
                    var paras = JSON.parse(data.paras.replace(/'/g, '"'));
                    addBody(paras);
                    getTestApiHost(1);
                    fullurl();
                } else {
                    alert("渲染失败");
                }


            },
            error: function () {
                alert("请求失败");

            }

        }
    )
}

function addBody(content) {
    var tbody = document.getElementById("tbody");
    var data = content;
    for (var key in data) {
        var tr = document.createElement("tr");
        var tdname = document.createElement("td");
        var tdvalue = document.createElement("td");
        tdvalue.contentEditable = "true";
        tdname.innerHTML = key;
        tdvalue.innerHTML = data[key];
        tr.appendChild(tdname);
        tr.appendChild(tdvalue);
        tbody.appendChild(tr);
    }

}

function getTestApiHost(type) {
    $.ajax(
        {
            url: "/api/test_api_host",
            data: {'type': type},
            type: "get",
            dataType: "json",
            beforeSend: function () {
                return true;
            },
            success: function (data) {
                if (data) {
                    var data = data;
                    console.log(data);
                    $("#host_id").html("");
                    var option_group = '';
                    for (var i = 0; i < data.rows.length; i++) {
                        var selectdata = data.rows[i];
                        var option = '<option value="' + i + '">' + data.rows[i] + '</option>';
                        console.log(option);
                        option_group += option;
                        console.log(option_group);
                    }
                    console.log(option_group);
                    $("#host_id").append(option_group);
                    $("#host").val(data.rows[0]);
                } else {
                    $("#tip").html("<span style='color:red'>失败，请重试</span>");
                    // alert('操作失败');
                }
            },
            error: function () {
                alert('请求出错');
            },
            complete: function () {
            }
        });
}

function fullurl() {
    var host = $("#host").val();
    var url = $("#url").val();
    var mytable = document.getElementById("paraTable");
    var context = '?';
    for (var i = 1, rows = mytable.rows.length; i < rows; i++) {
        if (i > 1) {
            context = context + '&' + mytable.rows[i].cells[0].innerHTML + '=' + mytable.rows[i].cells[1].innerHTML;
        } else {
            context = context + mytable.rows[i].cells[0].innerHTML + "=" + mytable.rows[i].cells[1].innerHTML;
        }
    }
    $("#fullurlcontext").val(host + url + context);

}

function changehost() {
    var selectedIndex = document.getElementById("host_id").selectedIndex;
    var host = document.getElementById("host_id").options[selectedIndex].text;
    $("#host").val(host);
    fullurl();

}


function reosign() {
    var mytable = document.getElementById("paraTable");
    var context = {};
    for (var i = 1, rows = mytable.rows.length; i < rows; i++) {
        context[mytable.rows[i].cells[0].innerHTML] = mytable.rows[i].cells[1].innerHTML;
    }
    var context = JSON.stringify(context);
    var osign_list = $("#osign_list").val();
    $.ajax(
        {
            url: "/api/test_api_reosign",
            data: {"osign_list": osign_list, "context": context},
            type: "get",
            dataType: "json",
            beforeSend: function () {
                return true;
            },
            success: function (data) {
                if (data && data.code == '200') {
                    // 解析json数据
                    console.log(data.context);
                    var paras = JSON.parse(data.context.replace(/'/g, '"'));
                    addBody(paras);
                } else {
                    $("#tip").html("<span style='color:red'>失败，请重试</span>");
                    alert('重签名失败，请确认参数中是否有签名字段');
                }
            },
            error: function () {
                alert('请求出错');
            },
            complete: function () {
                // $('#tips').hide();
            }
        });

    return false;
}


function runapitest() {
    var fullurlcontext = $("#fullurlcontext").val();
    $.ajax(
        {
            url: "/api/test_api_run",
            data: {"url": fullurlcontext},
            type: "post",
            dataType: "json",
            beforeSend: function () {
                return true;
            },
            success: function (data) {
                if (data) {
                    var data = data;
                    var data_obj = data.rows[0];
                    $("#response").val(data_obj.response);
                    $("#content").val(data_obj.content);

                } else {
                    $("#tip").html("<span style='color:red'>失败，请重试</span>");
                    // alert('操作失败');
                }
            },
            error: function () {
                alert('请求出错');
            },
            complete: function () {
                // $('#tips').hide();
            }
        });

    return false;


}