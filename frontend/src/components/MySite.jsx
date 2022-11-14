import React from 'react';
import { Statistic, Card, Modal, Layout } from 'antd';
import { getSalesRequest } from '../utils/apiRequests';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: '10px',
    maxWidth: '800px',
    margin: 'auto',
  },
  title: {
    fontSize: '30px',
    marginTop: '20px',
    marginBottom: '20px',
  }
};

const MySite = () => {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const getData = async () => {
    const response = await getSalesRequest();
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setLoading(false);
    } else {
      const pack = {
        totalSales: 0,
        bestHour: 0,
        bestHourSales: 0,
        orderCount: 0,
        avgSales: 0,
      }
      setData(pack);
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return null
  }

  return (
  <Layout >
  <div style={styles.container}>
    <div style={styles.title}>Today's Sales Summary</div>
    <Card
      title="Total Sales"
      bordered={false}
      style={{ marginBottom: '10px' }}
    >
    <Statistic value={data.totalSales} prefix='$' precision={2} />
    </Card>
    <Card
      title="Order Count"
      bordered={false}
      style={{ marginBottom: '10px' }}
    >
    <Statistic value={data.orderCount} />
    </Card>
    <Card
      title="Average sales per order"
      bordered={false}
      style={{ marginBottom: '10px' }}
    >
    <Statistic value={data.avgSales} prefix='$' precision={2}/>
    </Card>
    <Card
      title="Best Hour"
      bordered={false}
      style={{ marginBottom: '10px' }}
    >
    <Statistic value={data.bestHour} suffix=': 00' />
    </Card>
    <Card
      title="Best Hour Sales"
      bordered={false}
      style={{ marginBottom: '10px' }}
    >
    <Statistic value={data.bestHourSales} prefix='$' precision={2} />
    </Card>
  </div>
  </Layout>);
}

export default MySite;