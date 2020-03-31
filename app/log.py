import os
import logzero
import logging
import get_path


class log:
    def __init__(self):
        self.logfile = get_path.cwd_path()+"/app/log/flask.txt"
        logzero.logfile(self.logfile, maxBytes=16, backupCount=3, encoding="utf-8")
        formatter = logging.Formatter('%(asctime)-15s - [%(filename)s: %(lineno)s] -%(levelname)s: %(message)s')
        logzero.formatter(formatter)
        logzero.loglevel(logging.INFO)
        self.logger = logzero.logger
