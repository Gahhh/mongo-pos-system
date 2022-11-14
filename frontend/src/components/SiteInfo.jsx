import React, {useState, useEffect} from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Modal,
  Image,
  Slider,
  Row,
  Col,
  Select,
  Layout
} from 'antd';
import { updateProfileRequest, getProfileRequest } from '../utils/apiRequests';
import { hourOptions } from '../config/timeOption';

const { Content } = Layout;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 22,
      offset:1
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
      offset:1
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
    Modal.error({
      title: 'Error',
      content: 'Something went wrong. Please try again later.',
    });
    return {};
  }
  else{
    const data = await res.json();
    if (data?.siteInformation){
      const siteInfo = data.siteInformation;
      if (data?.profilePhoto){
        const profile = data.profilePhoto;
        siteInfo.profilePhoto = profile;
      }
      return siteInfo;
    } else if (data?.profilePhoto){
      const profile = data.profilePhoto;
      return {profilePhoto: profile};
    }
    return {};
  }
}

const DashboardProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState('');
  const [form] = Form.useForm();
  const [originTradingTimes, setOriginTradingTimes] = useState({});
  const [checkedList, setCheckedList] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [abledList, setAblesList] = useState({
    ...checkedList,
  });

  const setupInitialForm = (formValues) => {
    form.resetFields();
    if (formValues?.tradingTimes){
      const tradingTimes = formValues.tradingTimes;
      delete formValues.tradingTimes;
      setOriginTradingTimes(tradingTimes);
      for (const day in tradingTimes){
        if (tradingTimes[day]?.endTime || tradingTimes[day]?.startTime){
          const newCheckedList = checkedList;
          newCheckedList[day] = true;
          setCheckedList(newCheckedList);
          const newAbledList = abledList;
          newAbledList[day] = true;
          setAblesList(newAbledList);
        }
      }
    }
    form.setFieldsValue(formValues);
    setProfilePhoto(formValues.profilePhoto);
  }

  const resetForm = async () => {
    const formValues = await initialForm();
    setupInitialForm(formValues);
  }

  useEffect(() => {
    const fetchData = async () =>{
      const formValues = await initialForm();
      setupInitialForm(formValues);
    }
    fetchData().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tradeSelector = (day, initial, isChecked) => {
    return (<Row>
      <Col span={10}><Checkbox 
      checked={isChecked}
      onClick={()=>{
        if (isChecked){
          const newOriginalTradingTimes = originTradingTimes;
          delete newOriginalTradingTimes[day];
          setOriginTradingTimes(newOriginalTradingTimes);
        }
      setCheckedList({...checkedList, [day]: !checkedList[day]});
      setAblesList({...abledList, [day]: !abledList[day]})
      }}
      >{
        day
      }</Checkbox></Col>

      <Col span={7}><Form.Item name= {`${day}Start`}><Select 
        options={hourOptions}
        placeholder="StartTime"
        defaultValue={initial?.startTime}
        disabled={!abledList[day]}
        onChange={(value) => {
          let dayValue = {};
          if (day in originTradingTimes){
            dayValue = originTradingTimes[day];
          }
          dayValue = {...dayValue, startTime: value};
          const newTradingTimes = {...originTradingTimes, [day]: dayValue};
          setOriginTradingTimes(newTradingTimes);
        }}
        ></Select></Form.Item></Col>

      <Col span={7}><Form.Item name={`${day}End`}><Select 
        options={hourOptions}
        placeholder="EndTime"
        defaultValue={initial?.endTime}
        disabled={!abledList[day]}
        onChange={(value) => {
          let dayValue = {};
          if (day in originTradingTimes){
            dayValue = originTradingTimes[day];
          }
          dayValue = {...dayValue, endTime: value};
          const newTradingTimes = {...originTradingTimes, [day]: dayValue};
          setOriginTradingTimes(newTradingTimes);
        }}
        ></Select></Form.Item></Col>
    </Row>
    );
  }


  const onFinish = async (values) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for (const id in days){
      delete values[`${days[id]}Start`];
      delete values[`${days[id]}End`];
    }
    values.tradingTimes = originTradingTimes;
    const body = {siteInformation: values};
    const res = await updateProfileRequest(body);
    if (!res.ok) {
      Modal.error({
        title: 'Error',
        content: 'Bad Internet Connection',
      });
    } else {
      Modal.success({
        title: 'Success',
        content: 'Profile updated',
      });
    } 
  };


  return(
    <Layout>
      <Content
        style={{
          height: '100vh',
          maxWidth: '700px',
          marginLeft: 30,
          marginRight: 30,
        }}
      >
      <Form
        {...formItemLayout}
        layout="vertical"
        onFinish={onFinish}
        form={form}
        style={{ marginTop: 40 }}
      >
        <Form.Item>
          <Image width={102} height={102} src={profilePhoto}/>
        </Form.Item>
          
        <Form.Item 
        label="Site name"
        name="siteName"
        rules={[
          {
            message: 'The input is not valid name',
          },
        ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            pattern: new RegExp(/^[0-9]*$/),
            message: 'Please input a valid phone number!',
          }
        ]}
      >
        <Input/>
        </Form.Item>

        <Form.Item
          name="tableRange"
          label="Table Number Range"
          extra="The range of table numbers that can be used for this site (0-100)"
        >
        <Slider range defaultValue={[10, 50]} />
        </Form.Item>

        <Form.Item style={{fontWeight:'bold', fontSize:'1.5em'}}>Site Address</Form.Item>

        <Form.Item 
        label="Street Address"
        name="streetAddress"
        >
          <Input />
        </Form.Item>

        <Form.Item 
        label="City(suburb)"
        name="cityOrSuburb"
        >
          <Input />
        </Form.Item>

        <Form.Item 
        label="State"
        name="state"
        >
          <Input />
        </Form.Item>

        <Form.Item 
        label="Postcode"
        name="postcode"
        >
          <Input />
        </Form.Item>
        
        <Form.Item
        label="Trading times"
        >
        {tradeSelector('Monday',originTradingTimes.Monday,checkedList.Monday)}
        {tradeSelector('Tuesday',originTradingTimes.Tuesday,checkedList.Tuesday)}
        {tradeSelector('Wednesday',originTradingTimes.Wednesday,checkedList.Wednesday)}
        {tradeSelector('Thursday',originTradingTimes.Thursday,checkedList.Thursday)}
        {tradeSelector('Friday',originTradingTimes.Friday,checkedList.Friday)}
        {tradeSelector('Saturday',originTradingTimes.Saturday,checkedList.Saturday)}
        {tradeSelector('Sunday',originTradingTimes.Sunday,checkedList.Sunday)}
        </Form.Item>

        <Form.Item>
          <Row>
            <Col span={6}>
          <Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
          </Col>
          <Form.Item>
            <Button type="default" htmlType='button' onClick={resetForm}>
              Cancel
            </Button>
          </Form.Item>
          </Row>
        </Form.Item>
      </Form>
      </Content>
    </Layout>
  );
}

export default DashboardProfile;