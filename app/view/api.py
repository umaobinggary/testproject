from flask import Blueprint, render_template, jsonify, request, session
from app.model import ApiModel
from app import db
from app.log import log
from app.api_test import ParaValues
from app.api_test.api_manage import ApiManage

mod = Blueprint("api", __name__, template_folder="templates")


@mod.route("/index_api")
def index_api():
    return render_template("api/index_api.html")


@mod.route("/search_api")
def search_api():
    data = request.values
    limit = int(data.get("limit", 10))
    offset = int(data.get("offset", 1)) + 1
    log().logger.info(f"页码：{offset} 页数：{limit}")
    data = ApiModel.query.paginate(page=offset, per_page=limit)
    log().logger.info("返回数据：%s" % data)
    data_list = [
        {"id": i.id, "name": i.name, "product": i.product, "module": i.module, "url": i.url, "osign_list": i.osign_list,
         "description": i.description,"paras":i.paras}
        for i in data.items]
    log().logger.info("返回数据：%s" % data_list)
    res = jsonify({"total": len(data.items), "rows": data_list})
    return res, {'Content-Type': 'application/json'}


@mod.route("/create_api", methods=("POST", "GET"))
def create_api():
    if request.method == "POST":
        data = dict(request.form)
        print(data)
        res = ApiModel.query.filter(ApiModel.name == data["name"]).first()
        print(data["name"])
        if res:
            return jsonify({"msg": "接口名称重复"})
        else:
            obj = ApiModel(name=data["name"], product=data["product"], module=data["module"],
                           url=data["url"], paras=data["paras"], osign_list=data["osignList"], description=data["description"])
            db.session.add(obj)
            db.session.commit()
            res = ApiModel.query.filter(ApiModel.name == data["name"])
            if res:
                return jsonify({"code": 1})
            else:
                return jsonify({"msg": "创建失败"})

    return render_template("api/create_api.html")


@mod.route("/edit_api", methods=("POST", "GET"))
def edit_api():
    if request.method == "POST":
        data = request.form
        print(data)
        obj = ApiModel.query.filter(ApiModel.id == data["id"])
        obj.update(dict(data))
        db.session.commit()

        data = jsonify({"code": 200, "msg": "成功了"})
        return data, {'Content-Type': 'application/json'}
    else:
        data = request.values
        id = data.get("id")
        return render_template("api/edit_api.html", id=id)


@mod.route("/info_api")
def info_api():
    data = request.values
    id = data.get("id")
    res = ApiModel.query.filter(ApiModel.id == id).first()
    return jsonify(res.to_dict())


@mod.route("/split_url")
def split_api():
    data = request.values
    print(data)
    url = data["url"]
    print(url)
    api_url, para_url = url.split('?')
    paras = para_url.split("&")
    paras_dict = {}
    for para in paras:
        para_name, value = para.split("=")
        paras_dict[para_name] = value
    data = jsonify(dict(url=api_url, paras=paras_dict))
    return data, {'Content-Type': 'application/json'}


@mod.route("/delete_api", methods=("POST", "GET"))
def delete_api():
    if request.method == "POST":
        data = request.form
        obj = ApiModel.query.filter(ApiModel.id == data["id"]).first()
        db.session.delete(obj)
        db.session.commit()
        res = ApiModel.query.filter(ApiModel.id == data["id"]).first()
        if res:
            code = 500
            message = "fail"
        else:
            code = 200
            message = "success"

        data = jsonify({"code": code, "msg": message})
        return data, {'Content-Type': 'application/json'}


@mod.route("/test_api")
def test_api():
    param = request.values
    id = param.get("id")
    return render_template("api/test_api.html", id=id)


@mod.route("/test_api_host")
def test_api_host():
    p = ParaValues
    host_list = p().hosts
    print(host_list)
    return jsonify({'total': len(host_list), 'rows': host_list})


@mod.route("/test_api_reosign")
def test_api_resign():
    param = request.values
    osign_list = param.get("osign_list").split(",")
    context = param.get("context")
    context = eval(context)
    print(type(context))
    if len(osign_list) > 1:
        res = ApiManage().api_sign(sign_list=osign_list, para_info=context, app_key="abc")
        return jsonify({"code": 200, "context": str(res)})
    else:
        return jsonify({"code": 200, "context": str(context)})


@mod.route("/test_api_run", methods=("POST", "GET"))
def test_api_run():
    if request.method == "POST":
        param = request.values
        url = param.get("url")
        api = ApiManage()
        header, content = api.send_req(url)
        print(header, content)
        return jsonify({"code": 200, "rows": [{"response": str(header), "content": content}]})
