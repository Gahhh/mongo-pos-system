import React,{useEffect, useState} from 'react';
import { getCurrentOrdersRequest, completeOneOrdersRequest, getProfileRequest } from '../utils/apiRequests';
import { Button, Modal, message, } from 'antd';
import {CaretLeftOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';

const styles = {
  backButton: {
    float: 'left',  
    fontWeight: 'bold',
    fontSize: '16px',
    border: 'none',
    height: '30px', 
    width: '30px',
  },
  mainPage: {
    height:"100vh",
    width:"100vw", 
    display:'flex',
    flexDirection:'column'
  },
  orderCard: {
    margin: 5,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    maxHeight: '94vh',
    minWidth: 260,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottom: '1px solid #e8e8e8',
    padding: 10,
  },
  itemsWindow:{
    display: 'flex',
    flexDirection: 'column',
  },
  waitTime: {
    width:250,
    textAlign: 'center',
    marginTop:10,
  },
  itemsHeaderbar:{
    display: 'flex',
    flexDirection: 'row',
    width:'100%',
    justifyContent: 'space-between',
    marginTop:5,
    paddingInline: 10,
  },
  pageHeader:{
    color: '#fff',
    backgroundColor: '#001529',
    fontSize: '1.5em',
    height: 30,
    width: '100%',
  },
  itemsList:{
    // Height:'78vh', 
    paddingInline: 10,
    marginBottom: 10,
    maxHeight:'78vh',
    overflowY:'scroll'
  },
  cardList:{
    display: 'flex', 
    flexDirection: 'row', 
    overflowX: 'scroll',
    width: '100%',
    minHeight: '100%',
  },
  oneItem:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop:10,
    marginBottom:10,
    borderTop:'1px dotted grey'
  }
}
let siteId = '';
const KitchenPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const getOrders = async (site) => {
    const res = await getCurrentOrdersRequest(site);
    if (!res.ok){
      Modal.error({
        title: 'Error',
        content: 'Failed to get orders',
      });
      return;
    }else{
      res.json().then(data => {
        // console.log(data.orders);
        const tempOrders = data.orders;
        // sort tempOrders by order time
        tempOrders.sort((a,b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setOrders(tempOrders);
      });
    }
  }

  const updateOrdersByMsg = async (msg) => {
    if (msg.siteId === siteId) {
      getOrders(siteId);
    }
  }
  
  useEffect(() => {
    const initialSetup = async () => {
      const res = await getProfileRequest();
      if (!res.ok){
        Modal.error({
          title: 'Error',
          content: 'Failed to get profile',
        });
        return;
      }
      else{
        res.json().then(data => {
          getOrders(data._id);
          const tempSiteId = data._id;
          siteId = tempSiteId;
        });
      }
    }
    initialSetup();
    socket.io.reconnectionAttempts(3);
    socket.on('newOrder', (msg) => {
      updateOrdersByMsg(msg);
    });
    socket.on('orderReady', (msg) => {
      updateOrdersByMsg(msg, 'orderReady');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const OneItem = (prop) => {
    const item = prop.item;
    const tableNumber = prop.tableNumber;

      // add call waiter function here
    const callWaiter = (e,number, itemname) => {
      message.success('Waiter has been called');
      console.log('call waiter', number, itemname);
      socket.emit('callForDishes', {siteId: siteId, tableNumber: number, itemname: itemname});
    }

    return(
      <div style={styles.oneItem}>
        <div style={{width:'70%'}}>
          <div style={{fontWeight:'bold', backgroundColor:'lightblue', paddingLeft:3}}>{item.item}</div>
          {item.extras.length>0 &&
            <div style={{ marginTop:3, paddingLeft:3 }}>
              Extras:
              {item.extras.map((extra, index) => {
                return(
                  <div key={index} style={{paddingLeft:20}}>{extra}</div>
                )
              })}
            </div>
          }
        </div>
        <div style={{width:'28%', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <div style={{fontWeight:'bold'}}>{item.quantity}</div>
          <Button size='small' type='primary' ghost 
          onClick={(e)=>callWaiter(e,tableNumber, item.item)}
          >Call</Button>
        </div>
      </div>
    )
  }

  const ItemsInOrder = (prop) => {
    const addOn = prop.addOn;
    const items = prop.items;
    const tableNumber = prop.tableNumber;
    const itemsList = [];
    for (let i=0; i<items.length; i++){
      itemsList.push(<OneItem item={items[i]} active={false} tableNumber={tableNumber} key={i}/>);
    }
    return (
      <div>
      {addOn&&itemsList.length>0
        ?<div style={{backgroundColor:'grey', color:'white', fontSize:'1.2em', textAlign:'center'}}>Additional Items</div>
        :null}
      {itemsList}
      </div>
    )
  }

  const orderReady = async (id, tableNumber) => {
    const res = await completeOneOrdersRequest({orderId:id});
    if (!res.ok){
      Modal.error({
        title: 'Error',
        content: 'Failed to complete order',
      });
      return;
    }else{
      message.success(`Table ${tableNumber} order is ready!`);
      socket.emit('orderReady', {tableNumber: tableNumber, siteId: siteId});
      getOrders(siteId);
    }
  }

  const openConfirmModal = (order) =>{
    Modal.confirm({
      title: `Are you sure table ${order.tableNumber}'s order is ready?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        orderReady(order._id, order.tableNumber);
      },
      onCancel() {
      },
    });
  }

  const OrderCard = (prop) => {
    const order = prop.order;
      // calculate wait time for all orders
    const WaitTimeDisplay = (prop) => {
      const [currentTime, setCurrentTime] = useState(new Date());
      useEffect(() => {
        const interval = window.setInterval(() => {
          setCurrentTime(()=>new Date());
        }, 1000);
        return () => {
          window.clearInterval(interval);
        }
      }, []);

      const createTime = new Date(prop.createdAt);
      const waitTime = currentTime - createTime;
      const allseconds = Math.floor(waitTime/1000);
      const minutes = Math.floor(allseconds/60);
      const seconds = allseconds%60;
      return (
        <span style={{color:'blue'}}>{minutes} m {seconds}s</span>
      )
    }

    const items = order.order;
    return (
      <div className='orderCard' 
      style={styles.orderCard}
      >
        <div style={styles.cardHeader}>
          <div style={{ fontSize:'1.5em'}}>{`Table ${order.tableNumber}`}</div>
          <Button type='primary' size="small" onClick={()=>openConfirmModal(order)}>Ready</Button>
        </div>

        <div style={styles.waitTime}>Wait Time: <WaitTimeDisplay createdAt={order.createdAt}/> </div>
        <div style={styles.itemsHeaderbar}>
          <div style={{width:'70%',backgroundColor:'grey', color:'white', fontSize:'1.2em', paddingLeft:3}}>Item</div>
          <div style={{width:'28%',backgroundColor:'grey', color:'white', fontSize:'1.2em', paddingLeft:3}}>Qty</div>
        </div>
        <div className="itemsList" style={styles.itemsList}>
          <ItemsInOrder addOn={false} items={items} tableNumber={order.tableNumber}/>
          <ItemsInOrder addOn={true} items={order.addOn} tableNumber={order.tableNumber}/>
          
          {order.specialRequest &&
          <div style={{borderTop:'1px solid lightgray', padding:3,
             wordBreak: 'break-word'
          }}>
            <span style={{fontWeight:'bold'}}>Special Request:</span><br/>  {
              // remove specific words from special request
              order.specialRequest.replace(/(undefined)/g, '')
            }
          </div>
          }
        </div>
        
      </div>
    )
  };

  const renderOrderCards = () => {
    if (orders.length>0){
        return orders.map(order => <OrderCard order={order} key={order._id}/>);
    }else{
      return <div style={{width:'100%',textAlign:'center', fontSize:'2em'}}>No Orders here...</div>
    }
  }




  return (
    <React.Fragment >
    <div style={styles.mainPage}>
      <div style={styles.pageHeader}>
        <Button 
          style={styles.backButton} 
          ghost 
          block 
          onClick={()=>navigate('/roles')}
          icon={<CaretLeftOutlined />}
        >
          Go Back
        </Button>
        <div style={{display:'flex',justifyContent:'center'}}>Kitchen Display System</div>
      </div>
      <div className="page" style={{ height:'100%'}}>
        <div className="cardList" style={styles.cardList}>
          {renderOrderCards()}
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}

export default KitchenPage;