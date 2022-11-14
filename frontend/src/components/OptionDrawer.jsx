import React, { useState } from "react";
import {
  Divider,
  Button,
  Checkbox
} from 'antd';
import { 
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';

const styles = {
  countSet: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px 0',
  },
  numText: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 10px',
  },
  optionExtra: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px 0',
    fontSize: '16px',
  },
  itemQuanity: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px 0',
  }
}

const OptionDrawer = (props) => {
  const [countItem, setCountItem] = useState(0);
  const [countExtra, setCountExtra] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [buttonFlag, setButtonFlag] = useState(true);
  const { item:selectedItem, addToCart, isPos, madalCancel } = props;
  const incrementCount = () => {
    setCountItem(countItem + 1);
    setButtonFlag(false);
  }
  const decrementCount = () => {
    if (countItem === 1) {
      setCountItem(countItem - 1);
      setButtonFlag(true);
      return;
    }
    if (countItem > 1) {
      setCountItem(countItem - 1);
    } else {
      setButtonFlag(true);
      setCountItem(0);
    }
  }

  const onCheckboxChange = (e) => {
    if (e.target.checked && countExtra.indexOf(e.target.id) === -1) {
      setCountExtra([...countExtra, e.target.id]);
      setTotalPrice(totalPrice + Number(e.target.price));
    }
    if (!e.target.checked && countExtra.indexOf(e.target.id) !== -1) {
      setCountExtra(countExtra.filter(item => item !== e.target.id));
      setTotalPrice(totalPrice - Number(e.target.price));
    }
  }

  const onModalCancel = () => {
    madalCancel();
  }

  const onAddToOrder = () => {
    const price = selectedItem.price*countItem + totalPrice;
    const pack = {
      item: selectedItem.itemName,
      quantity: countItem,
      extras: countExtra,
      price: price
    }
    addToCart(pack);
    if (isPos) {
      onModalCancel();
    }
  }
  const renderOptions = () => {
    const options = selectedItem.options;
    return options.map((option) => {
      return <div key={option.optionName} style={styles.optionExtra}>
      <Checkbox id={option.optionName} price={option.optionPrice} onChange={onCheckboxChange} style={{fontSize:"16px"}}>{option.optionName}</Checkbox>
      <div>$ {option.optionPrice}</div>
      </div>
    })
  }

  return (
    <React.Fragment>
      <div style={styles.itemQuanity}>
        <div style={{margin:"auto 0", fontSize:"16px", fontWeight:"bold"}}> How many do you want? </div>
        <div style={styles.countSet}>
          <Button icon={<MinusOutlined /> } onClick={decrementCount} size={'small'} style={{margin:"auto 0"}}/>
          <div style={styles.numText}>{countItem}</div>
          <Button icon={<PlusOutlined /> } onClick={incrementCount} size={'small'} style={{margin:"auto 0"}}/>
        </div>
      </div>
      {selectedItem.options ? 
      <div>
        <Divider style={{margin:"5px 0"}}/>
        <p style={{fontSize:"20px", margin:"5px 0"}}>Side Options</p>
        {renderOptions()}
      </div> : null}
      {
        isPos 
        ? <div style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly"}}>
            <Button style={{margin:"10px 0", width:"120px"}} onClick={onModalCancel}>Cancel</Button>
            <Button type="primary" disabled={buttonFlag} style={{margin:"10px 0", width:"120px"}} onClick={onAddToOrder}>Add to order</Button>
        </div>
        : <Button block type="primary" disabled={buttonFlag} style={{margin:"10px 0"}} onClick={onAddToOrder}>Add to order</Button>
      }
    </React.Fragment>
  )
    
}

export default OptionDrawer;