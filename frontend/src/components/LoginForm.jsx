import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import 'antd/dist/antd.min.css';
import { userLoginRequest } from '../utils/apiRequests';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    const res = await userLoginRequest(values);
    if (!res.ok) {
      const message = await res.json();
      Modal.error({
        title: 'Error',
        content: message.message,
      });
    } else {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/roles');
    } 
  };

  return (
    <Form
      name="login"
      initialValues={{
        remember: true,
      }}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
      <div style={{display:'flex', justifyContent:'center'}}> 
        <Button type="primary" htmlType="submit">
          Login
        </Button>
        </div>
      </Form.Item>

      <Form.Item>
        <div style={{display:'flex', justifyContent:'center'}}> 
          <Button type="link" onClick={() => navigate('/changepassword')}>Change Password</Button>
        </div>
      </Form.Item>

    </Form>
  );
};

export default LoginForm;