import { TempOrder, TransactionHistory } from '../models/db.js'
import { verifyToken } from './util.js';

export const addNewOrder = async (req, res) => {
  const { siteId, tableNumber, order, totalPrice, specialRequest } = req.body;
  if (!siteId || !tableNumber || !order || !totalPrice) {
    return res.status(400).json({
      message: 'Please provide all required fields',
    });
  }
  TempOrder.findOne({siteId, tableNumber}, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
    if (data) {
      return res.status(200).json({
        message: 'Previous order have not been completed',
        orderInfo: data,
      });
    }
    const newOrder = new TempOrder({
      siteId,
      tableNumber,
      order,
      totalPrice,
      specialRequest,
    });
    newOrder.save((err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      return res.status(201).json({
        message: 'Order created successfully',
        orderId: data._id,
      });
    });
  });

}

export const updateOrder = async (req, res) => {
  const { orderId, addOn, totalPrice, specialRequest } = req.body;
  if (!orderId || !addOn || !totalPrice) {
    return res.status(400).json({
      message: 'Please provide all required fields',
    });
  }
  TempOrder.findOneAndUpdate({ _id: orderId }, { addOn, totalPrice, specialRequest }, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
    if (!data) {
      return res.status(400).json({
        message: 'Order not found',
      });
    }
    return res.status(200).json({
      message: 'Order updated successfully',
    });
  });
}



export const paidOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    if (!orderId) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    const deleteTempOrder = await TempOrder.findOneAndDelete({ _id: orderId });
    if (!deleteTempOrder) {
      return res.status(400).json({
        message: 'Order not found',
      });
    } 
    const totalOrder = deleteTempOrder.order.concat(deleteTempOrder.addOn);
    const newTransaction = new TransactionHistory({
      siteId: deleteTempOrder.siteId,
      tableNumber: deleteTempOrder.tableNumber,
      order: totalOrder,
      totalPrice: deleteTempOrder.totalPrice,
    });
    newTransaction.save((err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      return res.status(200).json({
        message: 'Order paid successfully',
      });
    });
  }catch(err){
    res.status(400).send({ "message": 'Invalid token'});
  }
}

export const getOneOrder = async (req, res) => {
  const { siteId, tableNumber } = req.query;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    if (!siteId || !tableNumber) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    TempOrder.find({siteId, tableNumber}, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      if (!data) {
        return res.status(400).json({
          message: 'No orders found',
        });
      }
      return res.status(200).json({'orders': data});
    });
  }catch(err){
    res.status(400).send({ "message": 'Invalid token'});
  }
}

export const getUnpaidOrders = async (req, res) => {
  const { siteId } = req.query;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    if (!siteId) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    try{
      const orders = await TempOrder.find({siteId});
      if (!orders) {
        return res.status(400).json({
          message: 'No orders found',
        });
      }
      const currentOrders = orders.filter((order) => {
        return order.isPaid === false;
      });
      return res.status(200).json({'orders': currentOrders});
    } catch (err) {
      return res.status(500).json({
        message: 'Cannot find orders',
      });
    }
  }catch(err){
    res.status(400).send({ "message": 'Invalid token'});
  }
}

export const getCurrentOrders = async (req, res) => {
  const { siteId } = req.query;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    if (!siteId) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    try{
      const orders = await TempOrder.find({siteId});
      if (!orders) {
        return res.status(400).json({
          message: 'No orders found',
        });
      }
      const currentOrders = orders.filter((order) => {
        return order.isCompleted === false;
      });
      return res.status(200).json({'orders': currentOrders});
    } catch (err) {
      return res.status(500).json({
        message: 'Cannot find orders',
      });
    }
  }catch(err){
    res.status(400).send({ "message": 'Invalid token'});
  }
}

export const getCompletedOrders = async (req, res) => {
  const { siteId, page, dateStart, dateEnd } = req.query;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    if (!siteId) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    try{
      const orders = await TransactionHistory.find({siteId, $and: [{createdAt: {$gte: dateStart}}, {createdAt: {$lte: dateEnd}}]}).sort({createdAt: -1}).skip((page) * 5).limit(5);
      if (!orders) {
        return res.status(400).json({
          message: 'No orders found',
        });
      }
      return res.status(200).json({'orders': orders});
    } catch (err) {
      return res.status(500).json({
        message: 'Cannot find orders',
      });
    }
  }catch(err){
    res.status(400).send({ "message": 'Invalid token'});
  }
}

export const completeOneOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    if (!orderId) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    TempOrder.findOneAndUpdate({ _id: orderId }, { isCompleted: true }, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      if (!data) {
        return res.status(400).json({
          message: 'Order not found',
        });
      }
      return res.status(200).json({
        message: 'Order completed successfully',
      });
    });
  }catch(err){
    res.status(400).send({ "message": 'Invalid token'});
  }
}