import requests

class Common:
    def __init__(self):
        self.url_root = "http://127.0.0.1:5001"

    def get(self, uri, data='', headers=''):
        url = self.url_root + uri
        response = requests.get(url, headers=headers, data=data)
        return response

    def post(self, uri, data='', headers=''):
        url = self.url_root + uri
        if len(data) > 0:
            response = requests.post(url, headers=headers, data=data)
        else:
            response = requests.post(url)
        return response
    
    def patch(self, uri, data='', headers=''):
        url = self.url_root + uri
        if len(data) > 0:
            response = requests.patch(url, headers=headers, data=data)
        else:
            response = requests.patch(url)
        return response