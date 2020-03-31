import hashlib
import requests


class ApiManage:
    def md5(self, content):
        m = hashlib.md5()
        m.update(content.encode("utf-8"))
        return m.hexdigest()

    def get_sign(self, para_info, sign_list, app_key):
        paraPand = ''
        for para in sign_list:
            if para == "appKey":
                paraPand += app_key
            else:
                paraPand += str(para_info[para])
                print(para_info[para])
        return self.md5(paraPand)

    def api_sign(self, para_info, sign_list, app_key):
        para_info["osgin"] = self.get_sign(para_info, sign_list, app_key)
        return para_info

    def send_req(self, url):
        headers = {'Content-type': 'application/json;charset=utf8'}
        rep_content, rep_header = "", ""
        try_time = 3
        while try_time:
            try:
                res = requests.get(url=url, headers=headers)
                if res.status_code == 200:
                    rep_content, rep_header = res.text, res.headers
                    break
                else:
                    res = requests.get(url=url, headers=headers)
                    rep_content, rep_header = res.text, res.headers
            except Exception as e:
                rep_content, rep_header = "error", e
            finally:
                try_time += -1
        return rep_header, rep_content


if __name__ == '__main__':
    a = ApiManage()
    print(a.send_req("http://www.httpbin.org/get?a=1&b=2"))
