from app import db


class UserModel(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), unique=True, nullable=False, info="用户名")
    password = db.Column(db.String(120), nullable=False, info="密码")

    def __repr__(self):
        return self.username


class ApiModel(db.Model):
    __tablename__ = "api"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), unique=True, nullable=False, info="用例名")
    product = db.Column(db.String(20), nullable=False, info="产品")
    module = db.Column(db.String(50), nullable=False, info="模块")
    url = db.Column(db.String(50), nullable=False, info="请求地址")
    paras = db.Column(db.Text, nullable=False, info="参数")
    osign_list = db.Column(db.String(200), info="校验参数")
    description = db.Column(db.String(50), info="描述")
    status = db.Column(db.Integer, nullable=False, default=1, info='1:正常， 0：已删除')

    def __repr__(self):
        return self.name

    def to_dict(self):
        tmp = self.__dict__
        del tmp["_sa_instance_state"]
        return tmp