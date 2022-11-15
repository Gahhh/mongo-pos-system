import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://sam:sam@cluster0.ubskf.mongodb.net/9900', {
    useNewUrlParser: true
})

const UserSchema = new mongoose.Schema({
  userName: { type: String },
  companyName: { type: String },
  email: { type: String, unique: true, index: true },
  passwordEncoded: { type: String },
  adminPin: { type: String },
  profilePhoto: { type: String },
  siteInformation: { type: Object },
  createdAt: { type: Date, default: Date.now },
})

const MenuSchema = new mongoose.Schema({
  itemName: { type: String },
  category: { type: String },
  price: { type: String },
  description: { type: String },
  dietary: { type: Array },
  thumbnail: { type: String },
  email: { type: Object },
  translationLanguage: { type: Object },
  options: { type: Object },
  userId: { type: String },
  trsltDesp: { type: Array },
  createdAt: { type: Date, default: Date.now },
})

const categorySchema = new mongoose.Schema({
  userId: { type: String, index: true, unique: true },
  email: { type: String, index: true, unique: true },
  category: { type: Object },
})

const tempOrderSchema = new mongoose.Schema({
  siteId: { type: String },
  tableNumber: { type: String },
  order: { type: Array },
  createdAt: { type: Date, default: Date.now },
  isPaid: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  addOn: { type: Array, default: [] },
  totalPrice: { type: String },
  specialRequest: { type: String },
})

const transactionHistorySchema = new mongoose.Schema({
  siteId: { type: String },
  tableNumber: { type: String },
  order: { type: Array },
  totalPrice: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.model('User', UserSchema);
export const Menu = mongoose.model('Menu', MenuSchema);
export const Category = mongoose.model('Category', categorySchema);
export const TempOrder = mongoose.model('TempOrder', tempOrderSchema);
export const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

