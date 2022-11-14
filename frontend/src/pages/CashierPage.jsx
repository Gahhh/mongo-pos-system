import React from 'react';
import { socket } from '../utils/socket';
import { notification, Tabs, Divider, Button } from 'antd';
import { InfoCircleOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { getPOSMenuRequest } from '../utils/apiRequests';
import { useNavigate } from 'react-router-dom';
import PosMenuItem from '../components/PosMenuItem';
import PosCartSection from '../components/PosCartSection';
import PosCurrentOrder from '../components/PosCurrentOrder';
import PosCompletedOrder from '../components/PosCompletedOrder';
import logo from '../assets/logoWhite.png';
import './CashierPage.css';

const styles = {
  logo: {
    height: '20px',
    width: '20px',
    margin: 'auto 5px'
  },
  logoText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px 0',
  },
  tabBar: {
    width: '180px',
    height: '100vh',
    fontWeight: 'bold',
    fontSize: '25px',
    color: '#fff',
    backgroundColor: '#001529',
  },
  backButton: {
    backgroundColor: '#001529',
    fontWeight: 'bold',
    fontSize: '17px',
    border: 'none',
    margin: '35px 0',
  },
}

const CashierPage = () => {
  const [siteId, setSiteId] = React.useState('');
  const [ws, setWs] = React.useState(null);
  const [menu, setMenu] = React.useState(null);
  const [shoppingCart, setShoppingCart] = React.useState([]);
  const [assistance, setAssistance] = React.useState([]);
  const [isOrderChanged, setIsOrderChanged] = React.useState(false);
  const [tableRange, setTableRange] = React.useState([]);

  const navigate = useNavigate();

  const addItemToCart = (item) => {
    setShoppingCart(shoppingCart => [...shoppingCart, item]);
  }

  const changeOrderStatus = () => {
    setIsOrderChanged(!isOrderChanged);
  }

  const clearCart = () => {
    setShoppingCart([]);
  }

  const addAssistance = (table, msg) => {
    const newAssistance = {
      table: table,
      msg: msg,
    }
    setAssistance(assistance => Array.from(new Set([...assistance, newAssistance])));
  }

  const solvedAssistance = (tableNumber) => {
    setAssistance(assistance.filter(item => item !== tableNumber));
  }

  const onCartItemDelete = (e, index) => {
    setShoppingCart(shoppingCart => shoppingCart.filter((item, i) => i !== index));
  }

  const handleClickDashboard = () => {
    navigate('/roles');
  }

  const getPOSMenu = async () => {
    const response = await getPOSMenuRequest();
    const data = await response.json();
    const currentOrderList = {
      label: 'Current Orders',
      key: 'currentOrders',
      children: <PosCurrentOrder siteId={data.siteId} changeOrderStatus={changeOrderStatus}/>,
      forceRender: true,
    }

    const completedOrderList = {
      label: 'Order History',
      key: 'completedOrders',
      children: <PosCompletedOrder siteId={data.siteId}/>,
    }

    const items = Object.keys(data.category).map((key, id) => {
      return data.category[key].length > 0 
      ? {
        label: key.replace(key[0], key[0].toUpperCase()),
        key: id,
        children: <PosMenuItem items={data.category[key]} addCart={addItemToCart}/>,
        forceRender: true,
      }
      : null;
    });
    setSiteId(data.siteId);
    items.push(currentOrderList);
    items.push(completedOrderList);
    setMenu(items);
    setTableRange(data.tableRange);
  };

  const connectToSocket = () => {
    setWs(socket);
  }

  React.useEffect(() => {
    getPOSMenu();
  }, [isOrderChanged]);

  React.useEffect(() => {
    connectToSocket();
  }, [siteId]);

  React.useEffect(() => {
    if(ws) {
      initSocket();
    }
  }, [ws, siteId]);

  const openRequestNotification = (tableNumber) => {
    const key = `open${Date.now()}`;
    notification.open({
      message: 'Customer requested assistance',
      description:
        `Table ${tableNumber} requested assistance`,
      icon: <InfoCircleOutlined style={{ color: '#108ee9' }} />,
      key,
      style: {
        fontWeight: 'bold',
        color:"#E42E41",
      }
    });
  };

  const openKitchenCallNotification = (tableNumber, itemname) => {
    const key = `open${Date.now()}`;
    notification.open({
      message: 'Kitchen call',
      description:
        `${itemname} for Table ${tableNumber} is ready to be served`,
      icon: <InfoCircleOutlined style={{ color: '#108ee9' }} />,
      key,
      style: {
        fontWeight: 'bold',
        color:"#E42E41",
      }
    });
  };

  const openOrderReadyNotification = (tableNumber) => {
    const key = `open${Date.now()}`;
    notification.open({
      message: 'Order ready',
      description:
        `All items for Table ${tableNumber} are ready to be served`,
      icon: <InfoCircleOutlined style={{ color: '#108ee9' }} />,
      key,
      style: {
        fontWeight: 'bold',
        color:"#E42E41",
      }
    });
  };

  const openPayNotification = (tableNumber) => {
    const key = `open${Date.now()}`;
    notification.open({
      message: 'Table ready to pay',
      description:
        `Table ${tableNumber} requested bill`,
      icon: <InfoCircleOutlined style={{ color: '#108ee9' }} />,
      key,
      style: {
        fontWeight: 'bold',
        color:"#E42E41",
      }
    });
  };

  const initSocket = () => {
    socket.io.reconnectionAttempts(3);
    socket.on('help', (msg) => {
      if (msg.siteId === siteId) {
        openRequestNotification(msg.tableNumber);
        addAssistance(msg.tableNumber, 'assistance');
      }
    });
    socket.on('orderReady', (msg) => {
      if (msg.siteId === siteId) {
        openOrderReadyNotification(msg.tableNumber);
      }
    });
    socket.on('callForDishes', (msg) => {
      if (msg.siteId === siteId) {
        openKitchenCallNotification(msg.tableNumber, msg.itemname);
      }
    });
    socket.on('requestPay', (msg) => {
      if (msg.siteId === siteId) {
        openPayNotification(msg.tableNumber);
        addAssistance(msg.tableNumber, 'bill');
      }
    });
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
    <Tabs
      tabBarExtraContent={{
        left: (
          <div style={styles.logoContainer}>
            <img src={logo} alt="logo" style={styles.logo}/>
            <div style={styles.logoText} >Mongo Magic</div>
          </div>
        ),
        right: (
          <Button 
            style={styles.backButton} 
            ghost 
            block 
            onClick={handleClickDashboard}
            icon={<CaretLeftOutlined />}
          >
            Go Back
          </Button>
        )
      }}
        defaultActiveKey="1"
        tabPosition='left'
        style={{
          height: '100vh',
          width:"100%",
        }}
        tabBarStyle={styles.tabBar}
        items={menu}
      />
      <Divider type="vertical" style={{height:"100vh", borderColor: "#c5c6c7", marginRight:'0'}}/>
      <PosCartSection 
        tableRange={tableRange} 
        cart={shoppingCart} 
        deleteItem={onCartItemDelete} 
        assistanceList={assistance} 
        completedRequest={solvedAssistance}
        siteId={siteId}
        clearCart={clearCart}
       />
    </div>
  );
}

export default CashierPage;