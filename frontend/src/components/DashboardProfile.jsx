import React, {useEffect, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Upload,
  Modal,
  Image,
  Layout,
} from 'antd';
import { updateProfileRequest, getProfileRequest } from '../utils/apiRequests';
import { getBase64 } from '../utils/utilsFunctions';
const { Content } = Layout;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 22,
      offset: 1,
    },
    lg: {
      span: 16,
      offset: 4,
    }
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 22,
      offset: 1,
    },
    lg: {
      span: 16,
      offset: 4,
    }
  },
};

const initialForm = async() => {
  const res = await getProfileRequest();
  if (!res.ok){
    return {};
  }
  else{
    const data = await res.json();
    return data;
  }
}


const DashboardProfile = () => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [previewOpen, setPreviewOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [previewImage, setPreviewImage] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [userProfilePhoto, setUserProfilePhoto] = useState('');
  
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (fileList.length > 0){
      const baseImg = await getBase64(fileList[0].originFileObj);
      values.profilePhoto = baseImg;
    }
    const res = await updateProfileRequest(values);
    if (!res.ok) {
      Modal.error({
        title: 'Error',
        content: 'Bad Internet Connection',
      });
    } 
    else {
      Modal.success({
        title: 'Success',
        content: 'Profile updated',
      });
    } 
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };



  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleUpload = async (option) => {
    option.onSuccess();
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      Modal.error({
        title: 'You can only upload JPG/PNG file!',
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Modal.error({
        title: 'Image must smaller than 2MB!',
      });
    }
    return isJpgOrPng && isLt2M;
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e && e.fileList;
    }
  }

  const setupInitialForm = async (formValues) => {
    form.setFieldValue('userName', formValues.userName);
    form.setFieldValue('email', formValues.email);
    if (formValues.profilePhoto!==null && formValues.profilePhoto!==''){
      setUserProfilePhoto(formValues.profilePhoto);
    } else {
      setUserProfilePhoto('');
    }
  }

  const resetForm = async () => {
    const formValues = await initialForm();
    form.resetFields();
    setFileList([]);
    setupInitialForm(formValues);
  }

  useEffect(() => {
    const fetchData= async () =>{
      const formValues = await initialForm();
      setupInitialForm(formValues);
    }
    fetchData().then(() => {
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return( 
    <Layout >
      <Content style={{height:'100vh', maxWidth:"700px", 
      marginRight: 25, marginLeft:25}}>
      <Form
        {...formItemLayout}
        layout="vertical"
        onFinish={onFinish}
        form={form}
        style={{ marginTop: 40 }}
      >
      <Form.Item>
        <div style={{display: 'flex', flexDirection:'row'}}>
      <Form.Item>
        {fileList.length >= 1 ? null:
          <Image 
          src={userProfilePhoto}
          alt="avatar" 
          style={{ width: '104px', height:'104px', 
            padding:'8px', border:'1px solid rgb(213,213,213)',borderRadius:'2px', 
            marginRight:'8px'}} />}
      </Form.Item>
      
      <Form.Item
        name="profilePhoto"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      > 
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          customRequest={handleUpload}
          maxCount={1}
        >
          {fileList.length >= 2 ? null : uploadButton}
        </Upload>
      </Form.Item>
      </div>
      </Form.Item>

        <Form.Item 
        label="User Name"
        name="userName">
          <Input />
        </Form.Item>

        <Form.Item 
        label="Email Address"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
        ]}>
          <Input disabled/>
        </Form.Item>

        <Form.Item label="Password&&Pins">
          <Button type="default" onClick={() => navigate('/changepassword')}>Change Password</Button>
        </Form.Item>

        <Form.Item >
          <Button type="primary" htmlType="submit">Save</Button>
          <Button type="default" style={{margin:'10px'}} onClick={resetForm}>Cancel</Button>
        </Form.Item>

      </Form>
      </Content>
    </Layout>
  );
}

export default DashboardProfile;