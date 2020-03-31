function createApi() {
    $.ajax(
        {
            url: "/api/create_api",
            type: "post",
            data: {
                "name": $("#name").val(),
                "product": $("#product").val(),
                "description": $("#description").val(),
                "module": $("#module").val(),
                "url": $("#url").val(),
                "osignList": $("#osignList").val(),
                "paras": getParaTable(),
            },
            success: function (data) {
                console.log(data);
                if (data["code"] == 1) {
                    alert("新增成功")
                    window.location.href = ('/api/index_api');
                }
                else {
                    alert(data["msg"])
                }

            },
            error: function () {
                alert("请求失败");
                window.location.href = ('/api/create_api');
            },

        }
    )
}
function getParaTable() {
    var para_name_list = document.getElementsByClassName("para_name");
    var para_value_list = document.getElementsByClassName("para_value");
    var paras = {};
    for (var i=0;i<para_name_list.length;i++){
        paras[para_name_list[i].text]=para_value_list[i].text;
    }
    return JSON.stringify(paras);
}
function setParaTable(paras_dict) {
    var todolist= $("#para_table");
    for(var key in paras_dict){
        var tr = "<tr>";
        tr += "<td class='hidden-phone'><a class='para_name' data-placement='right'>" + key + "</a></td>";
        tr += "<td class='hidden-phone'><a class='para_value' data-placement='right'>" + paras_dict[key] + "</a></td>";
        tr += '</tr>';
        todolist.append(tr);
    }
}
function readPara() {
    $.ajax(
        {
            url: "/api/split_url",
            data: {"url":$("#paraList").val()},
            type: "get",
            dataType:"json",
            success:function (data) {
                console.log(data);
                $("#url").val(data["url"]);
                setParaTable(data["paras"]);
            },
            error: function () {

            }
        }
    )

}