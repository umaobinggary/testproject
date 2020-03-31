function get_info_api(active_id) {
    if (!active_id) {
        alert("error");
        return false;
    }
    $.ajax(
        {
            url:"/api/info_api",
            data:{"id":active_id},
            type:"get",
            dataType:"json",
            success:function (data) {
                if(data){
                    $("#name").val(data.name);
                    $("#description").val(data.description);
                    $("#url").val(data.url);
                    $("#product").val(data.product);
                    $("#module").val(data.module);
                    $("#osign_list").val(data.osign_list);
                    var paras = JSON.parse(data.paras.replace(/'/g,'"'));
                    setParaTable(paras);
                }
                else {
                    alert("渲染失败");
                }


            },
            error: function () {
                alert("请求失败");

            }

        }
    )
}

function update_api(id){
       var paras = getParaTable();
       $.ajax(
        {
          url: "/api/edit_api",
          data:{'id':id,'name':$('#name').val(),'product':$('#product').val(),'module':$('#module').val(),'url':$('#url').val(),'osign_list':$('#osign_list').val(),'description':$('#description').val(),'paras':paras},
          type: "post",
          beforeSend:function()
          {
            return true;
          },
          success:function(data)
          {
            console.log(data);
            console.log(data['code']);
            if(data['code']==200)
            {
                alert('保存成功！');
                window.location.href=('/api/index_api');
              }
            else
            {
              alert('失败，请重试');
            }
          },
          error:function()
          {
            alert('请求出错');
          },
          complete:function()
          {
           window.location.href=('/api/index_api');
          }
        });
}
