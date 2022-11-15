import requests
import json
import pymongo

from common import Common

class TestAuth:
    
    def setup(self):
        self.com = Common()
    
    # test correct register
    def test_register(self):
      url = "/user/register"
      payload = json.dumps({
        "userName": "John Doe",
        "companyName": "Acme Inc.",
        "email": "christian@unsw.edu.au",
        "password": "adummypassword",
        "adminPin": "ffnq34fiu43ng"
      })
      headers = {
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 400
    
    # test correct email and password
    def test_login_1(self):
      url = "/user/login"
      payload = json.dumps({
        "email": "christian@unsw.edu.au",
        "password": "adummypassword"
      })
      headers = {
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 200
    
    # test incorrect email
    def test_login_2(self):
      url = "/user/login"
      payload = json.dumps({
        "email": "A@unsw.edu.au",
        "password": "adummypassword"
      })
      headers = {
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 400
    
    # test incorrect password
    def test_login_3(self):
      url = "/user/login"
      payload = json.dumps({
        "email": "christian@unsw.edu.au",
        "password": "avxs"
      })
      headers = {
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 400
    
    # test correct adminpin
    def test_adminpin_1(self):
      url = "/user/adminpin"
      payload = json.dumps({
        "adminPin": "ffnq34fiu43ng"
      })
      headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 200
    
    # test incorrect adminpin with correct token
    def test_adminpin_2(self):
      url = "/user/adminpin"
      payload = json.dumps({
        "adminPin": "aaaa"
      })
      headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 400
    
    # test correct adminpin with incorrect token
    def test_adminpin_3(self):
      url = "/user/adminpin"
      payload = json.dumps({
        "adminPin": "ffnq34fiu43ng"
      })
      headers = {
        'Authorization': 'Bearer ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 401
    
    # test verify correct password with correct token
    def test_verifypassword_1(self):
      url = "/user/verifypassword"
      payload = json.dumps({
        "password": "adummypassword"
      })
      headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 200
    
    # test verify incorrect password with correct token
    def test_verifypassword_2(self):
      url = "/user/verifypassword"
      payload = json.dumps({
        "password": "aaaa"
      })
      headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 400
    
    # test verify correct password with incorrect token
    def test_verifypassword_3(self):
      url = "/user/verifypassword"
      payload = json.dumps({
        "password": "adummypassword"
      })
      headers = {
        'Authorization': 'Bearer ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.post(url, headers=headers, data=payload)
      assert response.status_code == 401
    
    # test get profile with correct token
    def test_profile_1(self):
      url = "/user/profile"
      payload={}
      headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY'
      }
      response = self.com.get(url, headers=headers, data=payload)
      assert response.status_code == 200
    
    # test get profile with correct token
    def test_profile_2(self):
      url = "/user/profile"
      payload={}
      headers = {
        'Authorization': 'Bearer ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY'
      }
      response = self.com.get(url, headers=headers, data=payload)
      assert response.status_code == 401
    
    # test update profile with correct token
    def test_update_profile_1(self):
      url = "/user/profile/update"
      payload = json.dumps({
        "userName": "John Doe",
        "companyName": "Acme Inc.",
        "email": "christian@unsw.edu.au",
        "password": "adummypassword",
        "adminPin": "ffnq34fiu43ng"
      })
      headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.patch(url, headers=headers, data=payload)
      assert response.status_code == 200
    
    # test update profile with incorrect email
    # def test_update_profile_2(self):
    #   url = "/user/profile/update"
    #   payload = json.dumps({
    #     "userName": "John Doe",
    #     "companyName": "Acme Inc.",
    #     "email": "aaa@unsw.edu.au",
    #     "password": "adummypassword",
    #     "adminPin": "ffnq34fiu43ng"
    #   })
    #   headers = {
    #     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
    #     'Content-Type': 'application/json'
    #   }
    #   response = self.com.patch(url, headers=headers, data=payload)
    #   assert response.status_code == 400
    
    # test update profile with correct token
    def test_update_profile_3(self):
      url = "/user/profile/update"
      payload = json.dumps({
        "userName": "John Doe",
        "companyName": "Acme Inc.",
        "email": "christian@unsw.edu.au",
        "password": "adummypassword",
        "adminPin": "ffnq34fiu43ng"
      })
      headers = {
        'Authorization': 'Bearer ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdGlhbkB1bnN3LmVkdS5hdSIsImlhdCI6MTY2NzEwNTgxMywiZXhwIjoxNjc1NzQ1ODEzfQ.YdpAJ2q1_dmz6kknKJb5uurqftnNIc1I_KTMwmpNoFY',
        'Content-Type': 'application/json'
      }
      response = self.com.patch(url, headers=headers, data=payload)
      assert response.status_code == 401
    
    