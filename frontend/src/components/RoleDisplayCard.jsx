import { Card } from 'antd';
import React from 'react';

const styles = {
  cardDescription: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "0.5rem"
  }
}
const RoleDisplayCard = (props) => (
  <Card
    hoverable
    style={props.cardStyle}
    cover={<img alt="Back Office" src={props.link} />}
    bodyStyle={{ padding: 10 }}
  >
    <div className='role-display-card-title'>Launch</div>
    <div style={styles.cardDescription}>{props.title}</div>
  </Card>
);

export default RoleDisplayCard;