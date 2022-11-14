import React, { useState, useRef } from 'react'
import { SlotMachine } from '@lucky-canvas/react'
import { Button } from 'antd';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  playButton: {
    marginTop: '20px',
  },
  pickContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
}


const LuckyDrawWheel = (props) => {
  const { menuList, addCart, closeDrawer } = props;
  const [selection, setSelection] = useState(null);
  const [isResult, setIsResult] = useState(false);

  const selectionList = menuList.map((item) => {
    return {
      imgs: [{
        src: item.thumbnail,
        width: 180,
        height: 150,
      }],
      fonts: [{
        text: item.itemName,
        top:"70%",
      }],
      key: item
    }
  })
  const [blocks] = useState([
    { padding: '10px', background: '#545453' },
    { padding: '10px', background: '#e3e3e3' },
  ])
  const [prizes] = useState(selectionList)
  const myLucky = useRef()

  const handlePlay = (e) => {
    myLucky.current.play();
    setTimeout(() => {
      myLucky.current.stop([Math.floor(Math.random() * selectionList.length)]);
    }, 1000)
  }

  const handleAddCart = (e) => {
    const item = {
      item: selection.itemName,
      price: selection.price,
      quantity: 1,
      extras: [],
    }
    addCart(item);
    closeDrawer();
  }

  return <div style={styles.container}>
    <SlotMachine
        ref={myLucky}
        width="320px"
        height="290px"
        blocks={blocks}
        prizes={prizes}
        slots={[{speed: 10}]}
        onStart={() => {
          setTimeout(() => {
            myLucky.current.stop([0])
          }, 500)
        }}
        onEnd={prize => {
          setSelection(prize.key);
          setIsResult(true);
        }}
      />
    <Button style={styles.playButton} type="primary" shape='round' onClick={handlePlay}>
      Start
    </Button>
    {isResult && <div style={styles.pickContainer}>
        <div style={{fontSize:"14px", fontWeight:'bold'}}>Today's pick for you is</div>
        <div style={{fontSize:"18px", fontWeight:'bold', padding: "15px 0"}}>{selection.itemName}</div>
        <div style={{fontSize:"14px"}}>{selection.description}</div>
        <Button type="primary" shape='round' onClick={handleAddCart} style={{margin: "15px"}}>
          Add to Cart
        </Button>
      </div>
    }
  </div>
}

export default LuckyDrawWheel;