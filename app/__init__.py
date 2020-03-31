from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap

app = Flask(__name__)
app.config.from_pyfile("../config.cfg")
bootstrap = Bootstrap(app)
db = SQLAlchemy()


def create_app():
    db.init_app(app)

    # @app.before_first_request
    # def create_tables():
    #     db.create_all()

    # @app.route("/hello")
    # def hello():
    #     return jsonify({"a": 1})

    from app import views
    from .view import user, api
    app.register_blueprint(user.mod)
    app.register_blueprint(api.mod)
    return app
