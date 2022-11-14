import React from "react";
import { 
  HomeOutlined,
  ClockCircleOutlined,
  DesktopOutlined,
  WhatsAppOutlined,
  PhoneOutlined,
  CompassOutlined,
  QuestionCircleOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import {
  Divider,
  Tag,
  Button,
  Drawer,
  notification,
  Popover
} from 'antd';
import OptionDrawer from './OptionDrawer';
import CartDetailDrawer from './CartDetailDrawer';
import { socket } from '../utils/socket';
import MenuItemList from "./MenuItemList";
import LuckyDrawWheel from "./LuckyDrawWheel";

const styles = {
  restaurantPage: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
    maxWidth: '700px',

  },
  companyName: {
    fontSize: '25px',
    fontWeight: 'bold',
    alignItems: 'center',
    margin: 'auto',
    padding: '10px',
  },
  detailFont: {
    fontSize: '14px',
    fontWeight: 'bold',

  },
  divider: {
    borderBlockColor: '#b1b3b5',
  },
  icon: {
    margin: '0 10px',
    fontSize: '17px'
  },
  tableNumber: {
    margin: '0 6px'
  },
  itemGap: {
    marginTop: '10px'
  },
  tag: {
    width:'fit-content'
  },
  cartButton: {
    margin: '10px 0',
    width: '100%',
    maxWidth: '450px',
    position: 'fixed',
    bottom: '0',
    zIndex: '1000'
  },
  category: {
    fontSize: '30px',
    fontWeight: 'bold',
    margin: '0 20px'
  },
  dividerTitle: {
    margin: '5px 0',
    borderBlockColor: '#b1b3b5',
  }

}


const RestaurantMenu = (props) => {
  const siteData = props.siteInfo;
  const siteId = props.siteId;
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [shoppingCart, setShoppingCart] = React.useState([]);
  const [openCart, setOpenCart] = React.useState(false);
  const [openLuckyDraw, setOpenLuckyDraw] = React.useState(false);
  const [helpButton, setHelpButton] = React.useState(false);

  const onDrawerClose = () => {
    setOpenDrawer(false);
  }

  const onCartItemDelete = (items) => {
    setShoppingCart(items);
  }

  const onItemClick = (item) => {
    setSelectedItem(item);
    setOpenDrawer(true);
  }

  const onAddToCart = (item) => {
    setShoppingCart(shoppingCart=>[...shoppingCart, item]);
    setOpenDrawer(false);
  }

  const onOpenCart = () => {
    setOpenCart(true);
  }

  const onCartClose = () => {
    setOpenCart(false);
  }

  const onLuckyDrawClose = () => {
    setOpenLuckyDraw(false);
  }

  const openLuckyDrawDrawer = () => {
    setOpenLuckyDraw(true);
  }

  const handleHelpButton = () => {
    socket.emit('help', {tableNumber: sessionStorage.getItem('tableNumber'), siteId: siteId});
    notification.success({
      message: 'Help Request Sent',
      description: 'A staff member will be with you shortly, you can press the help button again after 5 seconds to send another request',
      placement: 'top',
      duration: 5,
    });
    setHelpButton(true);
    setTimeout(() => {
      setHelpButton(false);
    }
    , 5000);
  }

  const handleBillButton = () => {
    socket.emit('requestPay', {tableNumber: sessionStorage.getItem('tableNumber'), siteId: siteId});
    notification.success({
      message: 'Bill Request Sent',
      description: 'A staff member will process your bill shortly',
      placement: 'top',
      duration: 5
    });
    setHelpButton(true);
    setTimeout(() => {
      setHelpButton(false);
    }
    , 5000);
  }

  const getToday = () => {
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
    return today;
  }

  const lackyDrawContent = (
    <div>
      <p>If you have no idea what to order today, no worries, our lucky draw will help you to choose</p>
    </div>
  )

  return (<div style={styles.restaurantPage}>
    <div style={styles.companyName}>
    {siteData.companyInfo?.siteName}
    </div>
    <div style={styles.detailFont}>
      <HomeOutlined style={styles.icon}/>
      {`${siteData.companyInfo?.streetAddress}, ${siteData.companyInfo?.cityOrSuburb} ${siteData.companyInfo?.state}`}
    </div>
    <div style={styles.detailFont}>
      <ClockCircleOutlined style={styles.icon}/>
      {`${getToday()} ${siteData.companyInfo?.tradingTimes[getToday()]?.startTime} - ${siteData.companyInfo?.tradingTimes[getToday()]?.endTime}`}
    </div>
    <div style={styles.detailFont}>
      <PhoneOutlined style={styles.icon}/>
      {siteData?.companyInfo?.phone}
    </div>
    <Divider style={styles.divider}/>
    <div style={styles.detailFont}>
      <DesktopOutlined style={styles.icon}/>
      Table Number:  
      <Tag color="blue" style={styles.tableNumber}>
        {sessionStorage.getItem("tableNumber") ? sessionStorage.getItem("tableNumber") : 'Not Set'}
      </Tag>
    </div>
    <div style={styles.itemGap}>
      <WhatsAppOutlined style={styles.icon}/>
      <Button shape="round" onClick={handleHelpButton} disabled={helpButton}>
        Help
      </Button>
    </div>
    <div style={styles.itemGap}>
      <CompassOutlined style={styles.icon}/>
      <Button shape="round" onClick={openLuckyDrawDrawer}>
        Lucky Draw
      </Button>
      <Popover content={lackyDrawContent} trigger="click">
        <QuestionCircleOutlined style={styles.icon} />
      </Popover>
    </div>
    <div style={styles.itemGap}>
      <DollarCircleOutlined style={styles.icon}/>
      <Button shape="round" onClick={handleBillButton}>
        Request Bill
      </Button>
    </div>
    <Divider style={styles.divider}/>
    {Object.keys(siteData?.category?.category).map((category, index) => {
      return (
        <React.Fragment key={index}>
           <div style={styles.category}>
            {category === 'default' ? '' : category.replace(category[0], category[0].toUpperCase())}
          </div>
          <MenuItemList 
            categoryItems={siteData?.category?.category[category]} 
            onItemClick={onItemClick}
            menuItemList={siteData?.menu}
          />
        </React.Fragment>
      )
    })}
    {openDrawer ?
      (<Drawer 
        title="Item Details" 
        placement="bottom" 
        onClose={onDrawerClose}
        open={openDrawer}
        destroyOnClose={true}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <OptionDrawer item={selectedItem} addToCart={onAddToCart} isPos={false} />
        </div>
      </Drawer>) : null
    }
    <Drawer
      title="Order Summary"
      placement="top"
      onClose={onCartClose}
      open={openCart}
      height="100%"
    >
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <CartDetailDrawer cart={shoppingCart} editCart={onCartItemDelete} siteId={siteId}/>
      </div>
    </Drawer>
    <Drawer
      title="Lucky Draw"
      placement="top"
      onClose={onLuckyDrawClose}
      open={openLuckyDraw}
      height="100%"
      destroyOnClose={true}
    >
      <LuckyDrawWheel addCart={onAddToCart} menuList={siteData.menu} closeDrawer={onLuckyDrawClose} />
    </Drawer>

    <Button type="primary" shape="round" style={styles.cartButton} onClick={onOpenCart}>
      Order Summary
    </Button>
  </div>)
};

export default RestaurantMenu;