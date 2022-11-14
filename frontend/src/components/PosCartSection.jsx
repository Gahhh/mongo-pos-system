import React from 'react';
import { Select, Button, List, Drawer, Modal } from 'antd';
import { DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import { addNewOrderRequest, editOrderRequest } from "../utils/apiRequests";
import { socket } from '../utils/socket';
const { Option } = Select;

const GST_ADDUP = 1.1;
const GST = 0.1;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '350px',
    height: '100vh',
  },
  tableSelect: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '25px',
    borderBottom: '1px solid #c5c6c7',
  },
  priceSection: {
    padding: '15px',
  },
  itemSection: {
    height: '100%',
    overflow: 'auto',
    flex: 1,
    borderBottom: '1px solid #c5c6c7',
    padding: '15px',
  },
  orderButton: {
    width: '100%',
    height: '70px',
    fontSize: '20px',
  },
  totalPrice: {
    fontSize: '25px',
    fontWeight: 'bold',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  itemPrice: {
    marginRight:"5px", 
    maxWidth:'60px', 
    minWidth:'60px',
    margin: 'auto 0',
  },
  requestButton: {
    width: '100%',
    height: '40px',
    fontSize: '20px',
  }
}

const PosCartSection = (props) => {
  const { cart, deleteItem, assistanceList, completedRequest, tableRange, siteId, clearCart } = props;
  const [tableNumber, setTableNumber] = React.useState('');
  const [isRequesting, setIsRequesting] = React.useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = React.useState(false);
  const [isTable, setIsTable] = React.useState(true);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };
  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const handleFinish = (value) => {
    setTableNumber(value);
    setIsTable(false);
  }

  const getTotals = () => {
    const totalPrice = cart.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
    return totalPrice/GST_ADDUP;
  }

  React.useEffect(() => {
    if(assistanceList.length > 0) {
      setIsRequesting(false);
    } else {
      setIsRequesting(true);
    }
  }, [assistanceList])

  const getMinTable = () => {
    if (tableRange.length > 0) {
      return tableRange[0];
    }
    return 0;
  }

  const getMaxTable = () => {
    if (tableRange.length > 0) {
      return tableRange[1];
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

  const handleRequestClick = () => {
    showDrawer();
  }

  const handleCheckout = async () => {
    const pack = {
      siteId,
      order: cart,
      tableNumber,
      totalPrice: String(getTotals() * GST_ADDUP),
    }
    const respone = await addNewOrderRequest(pack);
    const body = await respone.json();
    if (respone.status === 201) {
      socket.emit('newOrder', {
        siteId,
        tableNumber: sessionStorage.getItem("tableNumber"),
      });
      clearCart();
      setTableNumber(null);
      setIsTable(true);
    } else if (respone.status === 200) {
      const newPack = {
        orderId: body.orderInfo._id,
        addOn: [...body.orderInfo.addOn, ...cart],
        totalPrice: String(Number(getTotals() * GST_ADDUP) + Number(body.orderInfo.totalPrice)),
      }
      const newRespone = await editOrderRequest(newPack);
      const newBody = await newRespone.json();
      if (newRespone.status === 200) {
        socket.emit('newOrder', {
          siteId,
          tableNumber: sessionStorage.getItem("tableNumber"),
        });
        clearCart();
        setTableNumber(null);
        setIsTable(true);
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
    <div style={styles.container}>
      <Button onClick={handleRequestClick} style={styles.requestButton} danger disabled={isRequesting} icon={<ExclamationCircleOutlined/>}>
        Customer Requests
      </Button>
      <Drawer title="Current service requests" placement="right" onClose={onCloseDrawer} open={isDrawerVisible}>
        <List
          itemLayout="horizontal"
          dataSource={assistanceList}
          renderItem={item => (
            <List.Item>
              {console.log(item)}
              <List.Item.Meta title={`Table ${item.table} required ${item.msg}`}/>
              <Button danger onClick={() => completedRequest(item)}>Done</Button>
            </List.Item>
          )}
        />
      </Drawer>
      <div style={styles.tableSelect}>
        <div style={{margin:"auto 0"}}>
          Table Number:
        </div>
        <Select
          style={{
            width: "60px"
          }}
          onChange={handleFinish}
          value={tableNumber}
        >
          {tableNumRange()}
        </Select>
      </div>
      <div style={styles.itemSection}>
        <List
          style={{minHeight: '250px'}}
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={(item,index) => (
            <List.Item key={`${index}+${item}`} style={styles.listItem}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{marginRight:"5px", fontWeight:"bold", maxWidth:'25px', minWidth:'25px'}}>x{item.quantity}</div>
                <div>
                  <div>{item.item}</div>
                  <div>{item.extras?.map((option, extraIndex) =>{
                    return <div key={`${extraIndex}+${option}`}>{option}</div>
                  })}</div>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={styles.itemPrice}>$ {Number(item.price).toFixed(2)}</div>
                <Button style={styles.deleteButton} onClick={(e) => deleteItem(e, index)} type='text' icon={<DeleteOutlined />} />
              </div>
            </List.Item>
          )}
        />
      </div>
      <div style={styles.priceSection}>
        <div>
          Subtotal: 
          <span style={{float:'right'}}>$ {Number(getTotals().toFixed(2))}</span>
        </div>
        <div>
          GST:
          <span style={{float:'right'}}>$ {Number((getTotals() * GST).toFixed(2))}</span>
        </div>
        <div style={styles.totalPrice}>Total:
          <span style={{float:'right'}}>$ {Number((getTotals() * GST_ADDUP).toFixed(2))}</span>
        </div>
      </div>
      <Button type="primary" onClick={handleCheckout} style={styles.orderButton} disabled={isTable} >Send Order</Button>
    </div>
  );
}

export default PosCartSection;