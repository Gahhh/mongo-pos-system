import React from "react";
import RestaurantMenu from "../components/RestaurantMenu";
import { getMenuRequest } from "../utils/apiRequests";
import { useParams } from 'react-router-dom';
import closePic from '../assets/closedheader.jpg';
import { useNavigate } from 'react-router-dom';
import { 
  Modal,
  Spin,
  Empty,
  Select,
  Button
 } from 'antd';
import { 
  DesktopOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const styles = {
  detailFont: {
    fontSize: '15px',
    fontWeight: 'bold',
    width: '100%',
  },
  icon: {
    margin: '0 15px'
  },
  tableNumber: {
    margin: '0 15px'
  },
  title: {
    display: 'flex',
    margin: '15px 0',
  },
  container: {
    maxWidth: '450px',
    margin: '0 auto',
  }
}

const RestaurantPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [visible, setVisible] = React.useState(true);
  const [tableNumber, setTableNumber] = React.useState('');
  const [siteData, setSiteData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [duringOpenHours, setDuringOpenHours] = React.useState(false);
  const [isMenu, setIsMenu] = React.useState(true);

  const getMenuData = async () => {
    const response = await getMenuRequest(id);
    const data =  await response.json();
    if (!response.ok) {
      setIsMenu(false);
      setLoading(false);
    } else {
      if (checkOpenDays(data.companyInfo?.tradingTimes)) {
        setDuringOpenHours(true);
      }
      setSiteData(data);
      setLoading(false);
    }
  }

  const getMinTable = () => {
    if (siteData) {
      return siteData.companyInfo?.tableRange[0];
    }
    return 0;
  }

  const getMaxTable = () => {
    if (siteData) {
      return siteData.companyInfo?.tableRange[1];
    }
    return 0;
  }

  const tableNumRange = () => {
    const optionArray = [];
    for (let i = getMinTable(); i <= getMaxTable(); i++) {
      optionArray.push(<Option value={i}>{i}</Option>);
    }
    return optionArray.map((option) => option);
  }


  React.useEffect(() => {
    if (sessionStorage.getItem("tableNumber")) {
      setVisible(false);
      setTableNumber(sessionStorage.getItem("tableNumber"));
    }
    getMenuData();
  }, []);

  const handleOk = () => {
    if (tableNumber) {
      sessionStorage.setItem("tableNumber", tableNumber);
      setVisible(false);
    }
  }
  const handleFinish = (values) => {
    setTableNumber(values);
  }

  const checkOpenDays = (tradingDay) => {
    const date = new Date();
    const day = date.getDay();
    let today = '';
    switch (day) {
      case 1:
        today = 'Monday';
        break;
      case 2:
        today = 'Tuesday';
        break;
      case 3:
        today = 'Wednesday';
        break;
      case 4:
        today = 'Thursday';
        break;
      case 5:
        today = 'Friday';
        break;
      case 6:
        today = 'Saturday';
        break;
      case 0:
        today = 'Sunday';
        break;
      default:
        today = '';
        break;
    }
    if (tradingDay[today]) {
      return true;
    }
    return false;
  }


  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Spin size="large" />
        <h1 style={{marginLeft: '10px'}}>Loading...</h1>
      </div>
    )
  }

  if (!isMenu) {
    return (
      <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Empty description="No Menu" style={{marginBottom:"30px"}} />
        <Button type="primary" onClick={() => navigate('/roles')}>Go Back</Button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
    { duringOpenHours ? (visible ? (
        <Modal open={visible} onOk={handleOk} centered={true} >
          <div style={styles.detailFont}>
            <div style={styles.title}>
              <DesktopOutlined style={styles.icon}/>
              Table Number:
            </div>
            <Select
              style={{
                width: 200,
              }}
              onChange={handleFinish}
            >
              {tableNumRange()}
            </Select>
          </div>
        </Modal>) 
    : (<RestaurantMenu siteInfo={siteData} siteId={id} />)
    ) : (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <Empty
            image={closePic}
            imageStyle={{
              height: 150,
            }}
            description={
              <span>
                Trading Hours:
                {Object.keys(siteData.companyInfo.tradingTimes).map((key, idx) => {
                  return <div key={idx}>{key}: {siteData.companyInfo.tradingTimes[key].startTime} - {siteData.companyInfo.tradingTimes[key].endTime}</div>})}
              </span>
            }
          >
          </Empty>
        </div>)}
    </div>
  );
};

export default RestaurantPage;