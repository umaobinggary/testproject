## A.安装依赖文档
pip install -r requirements.txt

## B.配置数据库

## 初始化数据库,会创建一个migations文件夹,并且会在数据库中生成一个alembic_version表
python run_db.py db init

## 如果是使用mysql8.0以上版本，由于参数变化，请执行以下命令，随后创建迁移历史
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --upgrade sqlalchemy --ignore-installed
python run_db.py db migrate


## 更新数据库
python run_db.py db upgrade
