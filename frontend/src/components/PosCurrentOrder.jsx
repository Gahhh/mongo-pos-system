import React from 'react';
import { Card, Row, Col, Button, Divider, Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { getUnpaidOrdersRequest, paidOneOrdersRequest } from '../utils/apiRequests';
import { socket } from '../utils/socket';


const styles = {
  itemPrice: {
    marginRight:"5px", 
    maxWidth:'60px', 
    minWidth:'60px',
    margin: 'auto 0',
  },
  title: {
    fontWeight: 'bold',
  },
  container: {
    overflow: "scroll",
  },
  cardContainer: {
    width: '250px',
    height: '300px',
    overflow: 'scroll',
  }
}


const PosCurrentOrder = (props) => {
  const { siteId, changeOrderStatus } = props;
  const [orderList, setOrderList] = React.useState([]);

  const getOrderList = async () => {
    const response = await getUnpaidOrdersRequest(siteId);
    const data = await response.json();
    setOrderList(data.orders);
  }

  React.useEffect(() => {
    getOrderList();
  }, []);

  const handlePaid = (order) => {
    paidOneOrdersRequest({orderId: order._id});
    changeOrderStatus();
    setOrderList(orderList.filter(item => item._id !== order._id));
  }

  React.useEffect(() => {
    socket.io.reconnectionAttempts(3);
    socket.on('newOrder', (msg) => {
      if (msg.siteId === siteId) {
        getOrderList();
      }
    });
    socket.on('orderReady', (msg) => {
      if (msg.siteId === siteId) {
        getOrderList();
      }
    });
    // eslint-disable-next-line
  }, []);

  const cardTitle = (order) => {
    switch (order.isCompleted) {
      case true:
        return (
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>Table {order.tableNumber}</div>
            <Tag icon={<CheckCircleOutlined />} color="success">
              Completed
            </Tag>
          </div>);
      case false:
        return (
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>Table {order.tableNumber}</div>
            <Tag icon={<SyncOutlined spin />} color="processing">
              Preparing
            </Tag>
          </div>);
      default:
        return (
          <div></div>
        )
    }
  }

  return (
    <Row gutter={[16, 16]} justify='left'>
      {orderList.map((order, index) => {
        return (
          <Col key={index}>
            <Card key={index} title={cardTitle(order)} style={styles.cardContainer}>
              {order.order.map((item, index) => {
                return (<div key={index}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ marginRight: "5px", fontWeight: "bold", maxWidth: '25px', minWidth: '25px' }}>x{item.quantity}</div>
                    <div>
                      <div style={styles.title}>{item.item}</div>
                      <div>{item.extras?.map((option, extraIndex) => {
                        return <div key={extraIndex}>{option}</div>;
                      })}</div>
                    </div>
                  </div>
                </div>);
              })}

              {order.addOn.length > 0 &&
              <div>
                <Divider plain>Additional Order</Divider>
                {order.addOn.map((item, index) => {
                  return (<div key={index}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div style={{ marginRight: "5px", fontWeight: "bold", maxWidth: '25px', minWidth: '25px' }}>x{item.quantity}</div>
                      <div>
                        <div style={styles.title}>{item.item}</div>
                        <div>{item.extras?.map((option, extraIndex) => {
                          return <div key={extraIndex}>{option}</div>;
                        })}</div>
                      </div>
                    </div>
                  </div>);
                })}
              </div>}
            
            </Card>
            <Button type='primary' block onClick={() => {handlePaid(order)}}>Paid</Button>
          </Col>
        )})}
    </Row>
  );
};

export default PosCurrentOrder;