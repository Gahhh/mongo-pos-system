import React from 'react';
import { Card, Col, Row, Modal } from 'antd';
import OptionDrawer from './OptionDrawer';

const styles = {
  card: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '10%',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  itemName: {
    textAlign: 'center',
  },
  itemPrice: {
    textAlign: 'center',
    fontWeight: 'bold',
  }
}

const PosMenuItem = (props) => {
  const { items, addCart } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleModalCancel = () => {
    setIsModalOpen(false);
  }


  const handleCardClick = (e, item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }

  const onAddToCart = (item) => {
    addCart(item);
  }

  return (<React.Fragment>
     <Row gutter={[16, 16]} justify='left'>
      {items.map((item, id) => {
        return (
          <Col key={id} style={{height: '150px', width:'150px'}}>
            <Card 
              style={styles.card}
              bodyStyle={styles.cardBody}
              hoverable
              onClick={(e) => handleCardClick(e, item)}
            >
              <div style={styles.itemName}>{item.itemName}</div>
              <div style={styles.itemPrice}>${item.price}</div>
            </Card>
          </Col>
        );
      }
      )}
    </Row>
    <Modal open={isModalOpen} onCancel={handleModalCancel} destroyOnClose footer={null} title='Item Details'>
      <OptionDrawer item={selectedItem} addToCart={onAddToCart} isPos={true} madalCancel={handleModalCancel}/>
    </Modal> 
  </React.Fragment>
  )

}

export default PosMenuItem;