from app import create_app
from app.view import user, api

app = create_app()
app.register_blueprint(user.mod, url_prefix="/user")
app.register_blueprint(api.mod, url_prefix="/api")

if __name__ == '__main__':
    app.run(debug=True)
