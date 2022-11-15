import { TempOrder, TransactionHistory, User } from '../models/db.js'
import { verifyToken } from './util.js';

export const getSalesData = async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }
    const { _id } = user;
    const siteId = String(_id);
    const todayZero = new Date()
    todayZero.setHours(0, 0, 0, 0);
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999);

    const orders = await TransactionHistory.find({siteId, $and: [{createdAt: {$gte: todayZero}}, {createdAt: {$lte: todayEnd}}]});
    if (!orders) {
      return res.status(400).json({
        message: 'No orders found',
      });
    }
    const totalSales = orders.reduce((acc, order) => acc + Number(order.totalPrice), 0);
    const bestHour = orders.reduce((acc, order) => {
      const hour = order.createdAt.getHours();
      if (acc[hour]) {
        acc[hour] += Number(order.totalPrice);
      } else {
        acc[hour] = Number(order.totalPrice);
      }
      return acc;
    }, {});
    const bestHourKey = Object.keys(bestHour).reduce((a, b) => bestHour[a] > bestHour[b] ? a : b);

    const pack = {
      totalSales,
      bestHour: bestHourKey,
      bestHourSales: bestHour[bestHourKey],
      orderCount: orders.length,
      avgSales: (Number(totalSales)/Number(orders.length)).toFixed(2) || 0,
    }
    res.status(200).json(pack);
  }
  catch(err){
    res.status(400).send({ "message": 'Invalid token'});
  }
}
