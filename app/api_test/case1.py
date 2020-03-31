import requests

# res = requests.get(url="http://www.httpbin.org/cookies", cookies={"user": "haha"})
#
# print(res.text)
cookies = {"user": "haha"}
s = requests.Session()
s.cookies = requests.utils.cookiejar_from_dict(cookies, cookiejar=None, overwrite=True)
res = s.get(url="http://www.httpbin.org/cookies")
print(res.text)
res = s.get(url="http://www.httpbin.org/cookies")
print(res.text)