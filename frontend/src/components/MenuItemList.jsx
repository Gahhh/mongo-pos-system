import React from "react";
import {
  Divider,
  Tag,
  List,
  Popover,
} from 'antd';
import ReactCountryFlag from "react-country-flag"

const styles = {
  tag: {
    width:'fit-content'
  },
  flag: {
    width: '32px',
    height: '32px',
    marginRight: '10px'
  }
}

const MenuItemList = (props) => {
  const { categoryItems, onItemClick, menuItemList } = props;
  const itemList = categoryItems.map((item) => {
    return menuItemList.find((menuItem) => menuItem._id === item);
  });
  if (itemList.length === 0) {
    return null;
  }
  return (
    <List
      itemLayout="vertical"
      dataSource={itemList}
      renderItem={(item) => {
        return (
          <React.Fragment>
            <List.Item
              onClick={(e)=> onItemClick(item, e)}
              key={item?.itemName}
            >
              <img
                width={200}
                src={item?.thumbnail}
                style={{padding: '5px', borderRadius: '5px', margin: '0 15px'}}
                alt={item?.itemName}  
              />
              <div style={{display: 'flex', flexDirection: 'column', margin:"0 20px"}}>
                <div style={{fontSize: '20px', fontWeight: 'bold'}}>{item.itemName}</div>
                <div style={{fontSize: '14px'}}>{item.description}</div>
                <div style={{fontSize: '20px', margin:"5px 0"}}>$ {item.price}</div>
                <div>
                {item.dietary && item.dietary.map((diet) => {
                  return <Tag color="green" key={diet} style={styles.tag}>{diet}</Tag>
                })}
                </div>
              </div>
              <div style={{margin: "0 20px"}}> 
              {item.trsltDesp && item.trsltDesp.map((trslt, idx) => {
                    return <Popover placement="topLeft" 
                                    content={trslt.text} 
                                    key={idx} 
                                    trigger="click" 
                                    onClick={(e) => e.stopPropagation()}
                                    autoAdjustOverflow={false}
                      >
                      <ReactCountryFlag countryCode={trslt.language} svg style={styles.flag}/>
                    </Popover>
                  })}
              </div>
            </List.Item>
            <Divider />
          </React.Fragment>
        )
      }}
    />)
}

export default MenuItemList;