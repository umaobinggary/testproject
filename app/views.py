from flask import render_template, session
from app import app
from app.view.user import authorize
from app.log import log


@app.route("/")
@app.route("/index")
@authorize
def index():
    username = session.get('user', None)
    log().logger.info(f"当前登录的用户为：{username}")
    return render_template("index.html", username=username)
