import React, { useState} from 'react';
import {
  Button,
  Form,
  Input,
  Layout,
  InputNumber,
  Upload,
  Modal,
  Select,
  Space,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { dietaryOption } from '../config/dietaryOption';
import { addMenuItemRequest } from '../utils/apiRequests';
import { getBase64 } from '../utils/utilsFunctions';
import { countryList } from '../config/translate';
import ReactCountryFlag from 'react-country-flag';
import { uploadFile, getPreSignedUrl } from '../utils/awsService';

const { Content } = Layout;
const options = dietaryOption.map((item) => {
  return { label: item, value: item };
});

const { Option } = Select;

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

const CreateMenuItem = () => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList }) => {
    fileList[0].status = 'done';
    setFileList(fileList);
  };

  const handleUpload = async (option) => {
    option.onSuccess();
  }

  const handleSelection = (value) => {
    const max = 2;
    if (value.length > max) {
      value.length = max;
    }
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

  const onFinish = async (values) => {
    values.thumbnail = '';
    const photo = fileList[0];
    if (photo) {
      const photoUrl = await getBase64(photo.originFileObj);
      const photoPack = {
        name: photo.name,
        image: photoUrl,
        type: photo.type
      }
      const awsRes = await uploadFile(photoPack);
      const url = await getPreSignedUrl(awsRes);
      values.thumbnail = url;
    }
    const response = await addMenuItemRequest(values);
    const responseInfo = await response.json();
    if (!response.ok) {
      Modal.error({
        title: 'Failed to create menu item',
        content: responseInfo.message,
      });
    } else {
      Modal.success({
        title: 'Successfully created menu item',
        content: responseInfo.message,
      });
      form.resetFields();
      setFileList([]);
    }

  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
  }

  const translateOptions = countryList.map((country) => {
    return (
      <Option key={country.language_name} value={country.language_code}>
        <ReactCountryFlag countryCode={country.country_code.toUpperCase()} svg />
        <span style={{marginLeft: '10px'}}>{country.language_name}</span>
      </Option>
    );
  });
  
  return (
    <Layout >
      <Content style={{height:'100vh', maxWidth:"700px", 
      marginRight: 25, marginLeft:25}}>
    <Form
      {...formItemLayout}
      form={form}
      name="addMenuItem"
      onFinish={onFinish}
      scrollToFirstError
      style={{marginTop: 40}}
      layout="vertical"
    >
      <Form.Item
        name="itemName"
        label="Item Name: "
        rules={[
          {
            required: true,
            message: 'Please input your item name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price: "
        rules={[
          {
            required: true,
            message: 'Please input your item price!',
          },
        ]}
      >
         <InputNumber
      defaultValue={0}
      min={0}
      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}/>
      </Form.Item>

      <Form.Item
        name="dietary"
        label="Dietary attributes: "
        extra="Please select dietary attributes or enter your own"
      >
        <Select
          mode="tags"
          style={{
            width: '100%',
          }}
          tokenSeparators={[',']}
          options={options}
        />
      </Form.Item>

      <Form.Item
        label="Photo: "
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Please upload a photo of your item"
      >
        <Upload
        listType="picture-card"
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        customRequest={handleUpload}
        fileList={fileList}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      </Form.Item>
      
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>

      <Form.Item
        name="description"
        label="Description: "
        rules={[
          {
            required: true,
            message: 'Please input your item description!',
          },
        ]}
      >
        <Input.TextArea showCount maxLength={150} size={'large'} placeholder='Please add item description and ingredients' />
      </Form.Item>

      <Form.Item
        name="translationLanguage"
        label="Translation Language: "
        extra="Please select the languages for translation of your item description (Max 2)"
      >
        <Select
          mode="multiple"
          style={{
            width: '100%',
          }}
          placeholder="select one or two languages"
          onChange={handleSelection}
          optionLabelProp="key"
        >
          {translateOptions}
        </Select>
      </Form.Item>

      <Form.Item
        label="Option Set: "
        extra="Please add additional options for your item if applicable"
      >
        <Form.List name="options">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'optionName']}
                  rules={[{ required: true, message: 'Missing option name' }]}
                >
                  <Input placeholder="Option name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'optionPrice']}
                  rules={[{ required: true, message: 'Missing option price' }]}
                >
                   <InputNumber
                      placeholder='Option price'
                      defaultValue={0}
                      min={0}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}/>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      </Form.Item>

      <Form.Item >
        <div style={{display:'flex', justifyContent:'center', marginBottom:30}}>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
        </div>
      </Form.Item>
    </Form>
    </Content>
    </Layout>
  )
}

export default CreateMenuItem;