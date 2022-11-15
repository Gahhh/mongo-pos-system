import requests
import json

from common import Common

class TestMenu:
    
    def setup(self):
        self.com = Common()
  
    def test1(self):
      url = "/menu/create"
      payload = json.dumps({
        "itemName": "aaaaaa",
        "category": "Food",
        "price": "5.00",
        "description": "Bread, Bacon, Egg",
        "dietary": [
          "Gluten Free",
          "Vegan"
        ],
        "translationLanguage": [
          "ja",
          "ko"
        ],
        "options": [
          "Option 1",
          "Option 2"
        ]
      })
      headers = {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inp6QHp6LmNvbSIsImlhdCI6MTY2NjQzMTY0OSwiZXhwIjoxNjc1MDcxNjQ5fQ._YydPfJdY9OqeQWeQNBvMR2ATmrMQiDtiIpvCJk_qu8',
            'Content-Type': 'application/json'
            }
      response = self.com.post(url, data = payload, headers = headers)
      assert response.status_code == 400






