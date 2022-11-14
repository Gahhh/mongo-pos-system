import { Button, Avatar, Input, Form, Modal } from 'antd';
import React from 'react';
import 'antd/dist/antd.min.css';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAdminAccessRequest, getProfileRequest } from '../utils/apiRequests';
import HeaderBar from './HeaderBar';
const styles ={
  profilePhoto: {
    width: '128px',
    height: '128px',
    borderRadius: '50%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    margin: 'auto',
  },
  companyName: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  verifyForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100px',
  },

  verifyFormTitle:{
    fontSize: '2em',
    color: '#000000',
    textAlign: 'center',
  },

  verifyFormDescription: {
    color: 'grey',
    textAlign: 'center',
    marginBottom: '30px',
  },
  password: {
    marginTop: '20px',
    marginBottom: '10px',
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

const VerifyAdminForm = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  if (!localStorage.getItem('token')) {
    navigate('/login');
  }

  const onFinish = async (values) => {
    const res = await getAdminAccessRequest (values);
    if (!res.ok) {
      Modal.error({
        title: 'Error',
        content: 'Invalid AdminPin',
      });
    } else {
      navigate('/dashboard/mysite');
      sessionStorage.setItem('verified', true);
    } 
  };

  const getUserInfo = async () => {
    if (localStorage.getItem('token')) {
      const res = await getProfileRequest();
      if (!res.ok) {
        const message = await res.json();
        Modal.error({
          title: 'Error',
          content: message.message});
      } else {
        const data = await res.json();
        setUserInfo(data);
      }
    }
  }
  React.useEffect(() => {
  getUserInfo();
   setLoading(false);}
  ,[]);
  const page = () => {
    return (
    <div style={styles.container}>
    <HeaderBar styles={styles}/>
    <div style={styles.verifyForm}>
      <div style={styles.verifyFormTitle}>Back Office</div>
      <div style={styles.verifyFormDescription}>MONGOMAGIC PLATFORM POS</div>
      <div>
      <Avatar size={128} src={userInfo.profilePhoto} style={styles.profilePhoto} icon={<UserOutlined/>}/>
      </div>
      <div className="user-name">{userInfo.userName}</div>

      <Form
      name="AdminPin"
      initialValues={{
        remember: false,
      }}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      >

      <Form.Item
        name="adminPin"
        style={styles.password}
        rules={[
          {
            required: true,
            message: 'Please input your admin pin!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
        }}
      >
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Form.Item>
      </Form>

      <div><Button type="link" onClick={()=>navigate('/changepassword')}>Change Password</Button></div>
    </div>
    </div>
    );
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (<div>
       {page()}
  </div>
    
  );
};

export default VerifyAdminForm;