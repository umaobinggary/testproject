from flask import Blueprint, render_template, jsonify, request, session
from app.model import UserModel
from functools import wraps
from app import db
from app.log import log

mod = Blueprint("user", __name__, template_folder="templates")


def authorize(fn):
    @wraps(fn)
    def wrapper():
        user = session.get('user', None)
        if user:
            return fn()
        else:
            return render_template("login.html")

    return wrapper


@mod.route("/login", methods=("POST", "GET"))
def login():
    if request.method == "POST":
        print(request.form.get("username"))
        username = request.form.get("username")
        password = request.form.get("password")
        log().logger.info(f"当前登入用户：{username}")
        if username == '' or password == '':
            return jsonify({'msg': '用户名或密码不能为空'})
        else:
            res = UserModel.query.filter(UserModel.username == username, UserModel.password == password).first()
        print(res)
        if res:
            session['user'] = username
            return jsonify(code=1)
        else:
            return jsonify({"msg": "账号或密码不正确"})
    return render_template("login.html")


@mod.route("/register", methods=("POST", "GET"))
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        print("用户", username)
        log().logger.info(f"当前注册用户：{username}")
        if username == '' or password == '':
            return jsonify({'msg': '用户名或密码不能为空'})
        else:
            res = UserModel.query.filter(UserModel.username == username).first()

            print("####", res)
            if res:
                return jsonify({"msg": "用户已存在"})
            else:
                usermodel = UserModel(username=username, password=password)
                db.session.add(usermodel)
                db.session.commit()
                session['user'] = username
                return jsonify({"code": 1})
    return render_template("register.html")


@mod.route("/logout")
def logout():
    del session["user"]
    return render_template("login.html")
