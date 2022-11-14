import express from 'express';
import bodyParser from 'body-parser';
import cros from 'cors';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { 
  userRegister,
  userLogin,
  getAdminAccess,
  verifyPassword,
} from './src/auth.js';
import swaggerDocument from './swagger.json' assert {type: 'json'};
import { 
  createMenu,
  getMenu,
  addCategory,
  getCategory,
  deleteItem,
  getPosMenu,
  editMenuItem
} from './src/menu.js';
import { 
  updateProfile,
  getProfile,
  getSiteId
} from './src/account.js';
import {
  addNewOrder,
  getOneOrder,
  updateOrder,
  paidOrder,
  getCurrentOrders,
  getCompletedOrders,
  completeOneOrder,
  getUnpaidOrders,
} from './src/orderManagement.js';
import {
  getSalesData,
} from './src/siteManagement.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: {origin: '*'}});
app.use(bodyParser.json());
app.use(cros());
app.use(bodyParser.json());

app.get('/', (req, res) => res.redirect('/docs'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/user/register', userRegister);
app.post('/user/login', userLogin);
app.post('/user/verifypassword', verifyPassword);
app.post('/user/adminpin', getAdminAccess);
app.patch('/user/profile/update', updateProfile);
app.get('/user/profile', getProfile);
app.get('/user/siteid', getSiteId);

app.post('/menu/create', createMenu);
app.get('/menu/getmenu', getMenu);
app.patch('/menu/category/add', addCategory);
app.get('/menu/category/get', getCategory); 
app.delete('/menu/deleteitem', deleteItem);
app.get('/menu/pos', getPosMenu);
app.patch('/menu/edit', editMenuItem);

app.post('/order/create', addNewOrder);
app.patch('/order/update', updateOrder);

app.post('/order/status/paid', paidOrder);
app.post('/order/status/finishone', completeOneOrder);

app.get('/order/get/one', getOneOrder);
app.get('/order/get/current', getCurrentOrders);
app.get('/order/get/unpaid', getUnpaidOrders);
app.get('/order/get/completed',getCompletedOrders);

app.get('/admin/sales', getSalesData);


io.on('connection', (socket) => {
  socket.on('help', (msg) => {
    socket.emit('help', 'received');
    socket.broadcast.emit('help', msg);
  });

  socket.on('newOrder', (msg) => {
    socket.emit('newOrder', msg);
    socket.broadcast.emit('newOrder', msg);
  });

  socket.on('orderReady', (msg) => {
    socket.emit('orderReady', msg);
    socket.broadcast.emit('orderReady', msg);
  });

  socket.on('callForDishes', (msg) => {
    socket.emit('callForDishes', msg);
    socket.broadcast.emit('callForDishes', msg);
  });

  socket.on('requestPay', (msg) => {
    socket.emit('requestPay', msg);
    socket.broadcast.emit('requestPay', msg);
  });
});


const port = process.env.PORT || 5001;
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
