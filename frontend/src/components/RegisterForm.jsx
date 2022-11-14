import { Button, Checkbox, Form, Input, Modal } from 'antd';
import React from 'react';
import 'antd/dist/antd.min.css';
import { userRegisterRequest } from '../utils/apiRequests';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const res = await userRegisterRequest(values);
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
      name="register"
      initialValues={{
        remember: true,
      }}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="userName"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
        
      </Form.Item>

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
        label="Company"
        name="companyName"
        rules={[
          {
            required: true,
            message: 'Please input your company name!',
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
          {
            pattern: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})'),
            message: 'Password must be at least 6 characters, with at least one lowercase letter, one uppercase letter and one number'
          }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Admin Pin"
        extra='This pin is for manager or owner to log into the back office.'
        name="adminPin"
        rules={[
          {
            required: true,
            message: 'Please input the password for your management system!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Admin Pin"
        name="confirmAdminPin"
        rules={[
          {
            required: true,
            message: 'Please confirm your pin!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('adminPin') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
      >
        <div style={{display:'flex', justifyContent:'center'}}> 
        <Checkbox>
          I have read the <a href="/">agreement</a>
        </Checkbox>
        </div>
      </Form.Item>

      <Form.Item>
      <div style={{display:'flex', justifyContent:'center'}}> 
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;