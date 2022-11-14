import React from "react";
import { List, Skeleton, DatePicker } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCompletedOrdersRequest } from '../utils/apiRequests';

const { RangePicker } = DatePicker;

const styles = {
  orderContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    height: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    margin: '30px auto',
  },
  description: {
    fontSize: '20px',
    margin: '15px 0',
  },
  itemPrice: {
    fontWeight: 'bold',
  }

}

const PosCompletedOrder = (props) => {
  const { siteId } = props;
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [dateStart, setDateStart] = React.useState(null);
  const [dateEnd, setDateEnd] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);

  const formatTime = (time) => {
    const date = new Date(time);
    return `${date.toLocaleTimeString()}`;
  }

  const formatDate = (time) => {
    const date = new Date(time);
    return `${date.toLocaleDateString()}`;
  }

  const fetchOrders = async () => {
    if (dateStart && dateEnd) {
      const response = await getCompletedOrdersRequest(siteId, pageCount, dateStart, dateEnd);
      const orderData = await response.json();
      if (orderData?.orders?.length > 0) {
        setData(data.concat(orderData.orders));
        setPageCount(pageCount + 1);
      } else {
        setHasMore(false);
      }
    } else {
      return;
    }
  }

  const onDateSelectChange = (dates, dateStrings) => {
    setDateStart(dateStrings[0]);
    const endDate = new Date(dateStrings[1]);
    endDate.setDate(endDate.getDate() + 1);
    setDateEnd(endDate.toISOString());
  }

  React.useEffect(() => {
    setData([]);
    setPageCount(0);
    setIsFetching(true);
  }, [dateStart, dateEnd]);

  React.useEffect(() => {
    if (isFetching) {
      fetchOrders();
      setIsFetching(false);
    }
  }, [isFetching]);

  return (
    <div style={styles.container}>
      <div style={styles.title}>Order History</div>
      <div style={styles.description}>Please select a date range:</div>
      <RangePicker
        onChange={onDateSelectChange}
      />
      <div
        id="scrollableDiv"
        style={{
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
          marginTop: '100px',
          backgroundColor: 'white',
        }}
      >
        <InfiniteScroll
          dataLength={data.length}
          hasMore={hasMore}
          next={fetchOrders}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={data}
            renderItem={(item, idx) => (
              <List.Item key={idx}>
                <div style={styles.orderContainer}>
                <div>
                  Table: {item.tableNumber}
                </div>
                <div>
                  Order Items:
                  {console.log(item)}
                  {item.order.map((orderItem) => {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div style={{ marginRight: "5px", maxWidth: '25px', minWidth: '25px' }}>x{orderItem.quantity}</div>
                      <div>
                        <div style={styles.itemTitle}>{orderItem.item}</div>
                        </div>
                    </div>
                    )
                  })}
                </div>
                <div style={styles.itemPrice}>
                  Total: ${Number(item.totalPrice).toFixed(2)}
                </div>
                <div style={styles.itemPrice}>
                  Date: {formatDate(item.createdAt)}
                </div>
                <div style={styles.itemPrice}>
                  Time: {formatTime(item.createdAt)}
                </div>
                </div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PosCompletedOrder;
