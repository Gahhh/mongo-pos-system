import React from "react";

import { 
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Divider,
  Tag,
  Button,
  List,
  Modal,
  Input
} from 'antd';
import { socket } from '../utils/socket';
import { addNewOrderRequest, editOrderRequest } from "../utils/apiRequests";
const { TextArea } = Input;

const GST_ADDUP = 1.1;
const GST = 0.1;

const styles = {
  tableNumber: {
    margin: '5px auto',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginRight: '10px',
    maxWidth: '170px',
    minWidth: '170px',
  },
  deleteButton: {
    margin: '10px',
  },

}

const CartDetailDrawer = (props) => {
  const { cart, editCart, siteId } = props;
  const [cartItem, setCartItem] = React.useState(cart);
  const [isOrdering, setIsOrdering] = React.useState(false);
  const [SpecialRequest, setSpecialRequest] = React.useState('');

  React.useEffect(() => {
    if (cartItem.length === 0) {
      setIsOrdering(true);
    } else {
      setIsOrdering(false);
    }
  }, [cartItem, cart]);

  React.useEffect(() => {
    setCartItem(cart);
  }, [cart]);

  const onDeleteItem = (e, index) => {
    const newCart = cartItem.filter((item, i) => i !== index);
    setCartItem(newCart);
    editCart(newCart);
  }

  const getTotals = () => {
    let total = 0;
    cartItem.forEach(item => {
      total += item.price;
    })
    return total/GST_ADDUP;
  }

  const onTextEnter = (e) => {
    setSpecialRequest(e.target.value);
  }

  const handleCheckout = async () => {
    const pack = {
      siteId,
      order: cartItem,
      tableNumber: sessionStorage.getItem("tableNumber"),
      totalPrice: String(getTotals() * GST_ADDUP),
      specialRequest: SpecialRequest,
    }
    const respone = await addNewOrderRequest(pack);
    const body = await respone.json();
    if (respone.status === 201) {
      socket.emit('newOrder', {
        siteId,
        tableNumber: sessionStorage.getItem("tableNumber"),
      });
      editCart([]);
      setCartItem([]);
      setIsOrdering(true);
      Modal.success({
        title: 'Order Success',
        content: 'Your order has been sent to the kitchen',
      });
    } else if (respone.status === 200) {
        const newPack = {
          orderId: body.orderInfo._id,
          addOn: [...body.orderInfo.addOn, ...cartItem],
          totalPrice: String(Number(getTotals() * GST_ADDUP) + Number(body.orderInfo.totalPrice)),
          specialRequest: body.orderInfo.specialRequest + ' ' + SpecialRequest,
        }
      const newRespone = await editOrderRequest(newPack);
      const newBody = await newRespone.json();
      if (newRespone.status === 200) {
        socket.emit('newOrder', {
          siteId,
          tableNumber: sessionStorage.getItem("tableNumber"),
        });
        editCart([]);
        setCartItem([]);
        setIsOrdering(true);
        Modal.success({
          title: 'Order Success',
          content: 'Your add-on order has been sent to the kitchen and added to your total bill',
        });
      } else {
        Modal.error({
          title: 'Error',
          content: newBody.message,
        });
      }
    } else {
      Modal.error({
        title: 'Error',
        content: body.message,
      });
    }
  }

  return (
    <React.Fragment>
      <div style={styles.tableNumber}>
        Table Number:
      </div>
      <Tag color="blue" style={styles.tableNumber}>
        {sessionStorage.getItem("tableNumber") ? sessionStorage.getItem("tableNumber") : 'Not Set'}
      </Tag>
      <Divider style={{margin:'10px auto'}} />
      <List
        style={{height: '350px', overflow:'scroll'}}
        itemLayout="horizontal"
        dataSource={cartItem}
        renderItem={(item,index) => (
          <List.Item key={index}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <div style={{marginRight:"15px", fontWeight:"bold", maxWidth:'25px', minWidth:'25px'}}>x{item.quantity}</div>
              <div>
                <div style={styles.title}>{item.item}</div>
                <div>{item.extras?.map((option, extraIndex) =>{
                  return <div key={extraIndex}>{option}</div>
                })}</div>
              </div>
              <div style={{marginRight:"5px", maxWidth:'60px', minWidth:'60px'}}>$ {Number(item.price).toFixed(2)}</div>
              <Button style={styles.deleteButton} onClick={(e) => onDeleteItem(e, index)} type='text' icon={<DeleteOutlined />} />
            </div>
          </List.Item>
        )}
      />
      <Divider style={{margin:'10px auto'}} />
      <TextArea placeholder="Special Instructions" showCount maxLength={100} onChange={onTextEnter} />
      <Divider style={{margin:'10px auto'}} />
      <div>
        <div>
          Subtotal: 
          <span style={{float:'right'}}>$ {Number(getTotals().toFixed(2))}</span>
        </div>
        <div>
          GST:
          <span style={{float:'right'}}>$ {Number((getTotals() * GST).toFixed(2))}</span>
        </div>
        <div>Total:
          <span style={{float:'right'}}>$ {Number((getTotals() * GST_ADDUP).toFixed(2))}</span>
        </div>
      </div>
      <Divider style={{margin:'10px auto'}} />
      <Button type="primary" shape="round" style={{width:'100%'}} onClick={handleCheckout} disabled={isOrdering} >Send Order</Button>
    </React.Fragment>
  )
}

export default CartDetailDrawer;
