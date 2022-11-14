import React, {useState, useEffect} from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { updateProfileRequest, verifyPasswordRequest, userLoginRequest } from '../utils/apiRequests';
import { Parallax } from 'react-parallax';
import bg from '../assets/security.jpg';
import HeaderBar from '../components/HeaderBar';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
  },
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    margin: 'auto',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    height: '100vh',
    marginTop: 100,
  },
  formTitle: {
    fontSize: '30px',
    fontWeight: '600',
    margin: '0 auto',
    marginButtom: '20px',
    textAlign: 'center'
  },
  formBackground: {
    backgroundColor: '#f5f5f5',
    borderRadius: '25px',
    padding: '20px',
    margin: '0 auto',
    width: '60vw',
    minWidth: '280px',
    maxWidth: '400px',
    opacity: '0.9',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px',
    justifyContent: 'space-between',
  },
  logo: {
    height: '30px',
    width: '30px',
    margin: 'auto 10px'
  },
  logoText: {
    fontSize: '25px',
    fontWeight: 'bold',
    color: '#545453',
  },
}

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [disabledPassword, setDisabledPassword] = useState(true);
  const [disabledAdminPin, setDisabledAdminPin] = useState(true);
  const [PasswordEmpty, setPasswordEmpty] = useState(true);
  const [AdminPinEmpty, setAdminPinEmpty] = useState(true);
  const [notVerifyed, setNotVerifyed] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, []);

  const onFinish = async (values) => {
    if (notVerifyed){
      if (token){
        const res = await verifyPasswordRequest(values);
        if (res.ok){
          setNotVerifyed(false);
        }
        else {
          Modal.error({
            title: 'Error',
            content: 'Password is not correct',
          });
        }
      } else {
        const res = await userLoginRequest(values);
        if (res.ok){
          const data = await res.json();
          localStorage.setItem('token', data.token);
          setNotVerifyed(false);
        }
        else {
          Modal.error({
            title: 'Error',
            content: 'Email or Password is not correct',
          });
        }
      }
    }
    else {
      const newValue = {};
      if (values?.newPassword && values?.newPassword !== ''){
        newValue.password = values.newPassword;
      }
      if (values?.adminPin && values?.adminPin !== ''){
        newValue.adminPin = values.adminPin;
      }
      const res = await updateProfileRequest(newValue);
      if (res.ok){
        Modal.success({
          title: 'Success',
          content: 'Password updated successfully',
        });
      }
      else {
        Modal.error({
          title: 'Error',
          content: 'Password update failed',
        });
      }
    }
  };

  const newPasswordOnChange = (e) => {
    if (e.target.value === ''){
      setPasswordEmpty(true);
    }
    else{
      setPasswordEmpty(false);
    }
  }

  const newAdminPinOnChange = (e) => {
    if (e.target.value === ''){
      setAdminPinEmpty(true);
    }
    else{
      setAdminPinEmpty(false);
    }
  }

  useEffect(() => {
    if (PasswordEmpty){
      form.resetFields(['confirmPassword']);
      setDisabledPassword(true);
    }
    else{
      setDisabledPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PasswordEmpty]);

  useEffect(() => {
    if (AdminPinEmpty){
      form.resetFields(['confirmAdminPin']);
      setDisabledAdminPin(true);
    }
    else{
      setDisabledAdminPin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AdminPinEmpty]);

  return (
    <Parallax style={styles.background} blur={0} bgImage={bg} strength={100} bgImageStyle={{minHeight:"100vh"}}>
    <div style={styles.container}>
    <HeaderBar styles={styles}/>
    <div style={styles.loginForm}>
        <div style={styles.formBackground}>
          <div style={styles.formTitle}>Security</div>
    <Form
    {...formItemLayout}
    layout="vertical"
    onFinish={onFinish}
    form={form}
    style={{ marginTop: '30px' }}
    >
    {token? null: <Form.Item
      label="Email"
      name="email"
      rules={[
        {
          required: true,
          message: 'Please input your email address!',
        },
      ]}
    >
      {notVerifyed ? <Input /> : <Input disabled/>}
    </Form.Item>}

    <Form.Item
      label="Original Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      {notVerifyed ? <Input.Password /> : <Input.Password disabled/>}
    </Form.Item>

    {notVerifyed ? null:
    <Form.Item
      label="Password"
      name="newPassword"
      rules={[
        {
          required: false,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password 
        onChange={newPasswordOnChange}/>
    </Form.Item>
    }

    {notVerifyed ? null:
    <Form.Item
      label="Confirm Password"
      name="confirmPassword"
      rules={[
        {
          required: !disabledPassword,
          message: 'Please confirm your password!',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
          },
        })
      ]}
    >
      {disabledPassword ? <Input.Password disabled/> : <Input.Password/>}
    </Form.Item>
    } 

    {notVerifyed ? null:
    <Form.Item
      label="Admin Pin"
      name="adminPin"
      rules={[
        {
          required: false,
          message: 'Please input your AdminPin!',
        },
      ]}
    >
      <Input.Password onChange={newAdminPinOnChange}/>
    </Form.Item>
    }

    {notVerifyed ? null:
    <Form.Item
      label="Confirm Admin Pin"
      name="confirmAdminPin"
      rules={[
        {
          required: !disabledAdminPin,
          message: 'Please confirm your AdminPin!',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('adminPin') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two adminPin that you entered do not match!'));
          },
        })
      ]}
    >
      <Input.Password disabled={disabledAdminPin}/>
    </Form.Item>
    }

    <Form.Item>
      {notVerifyed ? 
      <Button type="primary" 
      htmlType="submit">
        Verify
      </Button>
      :
      <Button
        type="primary"
        htmlType="submit"
        >Save
      </Button>
      }
        <Button
        htmlType="button"
        style={{ marginLeft: 10 }}
        onClick={() => {
            navigate('/roles');
        }}
        >Back</Button>
    </Form.Item>
  </Form>
  </div>
  </div>
  </div>
  </Parallax>
  );
};

export default ChangePasswordPage;