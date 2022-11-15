import { verifyToken } from './util.js'
import { Menu, User, Category } from '../models/db.js'
import { translateText } from './awsService.js';

export const createMenu = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Invild token' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  const email = verifyToken(token);
  const menu = req.body;
  if (!email) {
    res.status(400).json({ message: 'Invild token' });
    return;
  }
  const userQuery = User.findOne({ email: email });
  const user = await userQuery;
  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }
  const menuQuery = Menu.findOne({ itemName: menu.itemName, userId: user._id });
  const existingMenu = await menuQuery;
  if (existingMenu) {
    res.status(400).json({ message: 'Menu already exists' });
    return;
  }
  menu.userId = user._id.toString();
  menu.email = email;
  if (menu.translationLanguage) {
   const transPack = await translateText(menu.description, 'en', menu.translationLanguage);
   if (transPack.error) {
     res.status(400).json({ message: transPack.error });
     return;
   }
   menu.trsltDesp = transPack;
  }
  const newMenu = new Menu(menu);
  const savedMenu = await newMenu.save();
  const menuId = savedMenu._id.toString();
  const categoryQuery = Category.findOne({ userId: user._id });
  const findCategory = await categoryQuery;
  if (!findCategory) {
    const newCategory = new Category({
      userId: user._id.toString(),
      email: email,
      category: {
        "default": [menuId]
      }
    });
    newCategory.save((err, data) => {
      if (err) {
        res.status(400).json({ message: 'Failed to save category' });
        return;
      }
      res.status(200).json({ message: 'Menu created' });
    });
  } else {
    Category.updateOne({ userId: user._id }, {
      $push: {
        "category.default": menuId
      }
    }, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Database Error' });
        return;
      }
      res.status(200).json({ message: 'Menu created' });
    })
  }
}

export const editMenuItem = async (req, res) => {
  const { 
    itemId,
    itemName, 
    description, 
    price, 
    translationLanguage, 
    dietary, 
    thumbnail, 
    options, 
    trsltDesp } = req.body;
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Invild token' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  const email = verifyToken(token);
  if (!email) {
    return res.status(400).json({ message: 'Invild token' });
  }
  Menu.findOneAndUpdate({ _id:itemId, email:email }, {
    itemName,
    description,
    price,
    translationLanguage,
    dietary,
    thumbnail,
    options,
    trsltDesp
  }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database Error' });
    } else if (!result) {
      return res.status(400).json({ message: 'Menu not found' });
    }
    return res.status(200).json({ message: 'Menu updated' });
  })
}

export const getMenu = async (req, res) => {  
  if (!req.query.id) {
    res.status(400).json({ message: 'No id provided' });
    return;
  }
  const id = req.query.id;
  User.findOne({ _id: id }, async (err, user) => {
    if (err) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
    if (!user) {
      res.status(400).json({ message: 'Menu is not available' });
      return;
    }
    const menu = await Menu.find({ userId: id });
    const category = await Category.findOne({ userId: id });
    if (!menu || !category) {
      res.status(400).json({ message: 'Menu is not available' });
      return;
    }
    const pack = {
      "menu": menu,
      "category": category,
      "companyInfo": user.siteInformation,
      "companyName": user.companyName
    }
    res.status(200).json(pack);
  })
}

export const deleteItem = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Invild token' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  const email = verifyToken(token);
  const deleteItem = req.body;
  if (!email) {
    res.status(400).json({ message: 'Invild token' });
    return;
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }
  const menu = await Menu.findOneAndDelete({ _id: deleteItem.id });
  if (!menu) {
    res.status(400).json({ message: 'Menu not found' });
    return;
  }
  Category.updateOne({ email }, {
    $set: {
      "category": deleteItem.category
    }
  }, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Database Error' });
      return;
    }
    res.status(200).json({ message: 'Item deleted' });
  })
}




export const addCategory = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Invild token' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  const email = verifyToken(token);
  const category = req.body;
  if (!email) {
    res.status(400).json({ message: 'Invild token' });
    return;
  }
  Category.updateOne({ email }, {
    $set: {
      "category": category.category
    }
  }, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Database Error' });
      return;
    }
    res.status(200).json({ message: 'Category updated' });
  })
}

export const getCategory = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Invild token' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  const email = verifyToken(token);
  if (!email) {
    res.status(400).json({ message: 'Invild token' });
    return;
  }
  const categoryQuery = Category.findOne({ email });
  const category = await categoryQuery;
  const menuQuery = Menu.find({ email });
  const menu = await menuQuery;
  const pack = {
    "categoryInfo": category,
    "menu": menu
  }
  if (!category || !menu) {
    res.status(400).json({ message: 'Category or menu not found' });
    return;
  }
  res.status(200).json(pack);
}

export const getPosMenu = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Invild token' });
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  const email = verifyToken(token);
  if (!email) {
    res.status(400).json({ message: 'Invild token' });
    return;
  }
  try {
    const category = await Category.findOne({ email });
    const menu = await Menu.find({ email });
    const user = await User.findOne({ email });
    if (!category || !menu || !user) {
      res.status(400).json({ message: 'Category or menu not found' });
      return;
    }
    Object.keys(category.category).forEach((key) => {
      category.category[key] = category.category[key].map((id) => {
        return menu.find((menu) => menu._id.toString() === id);
      });
    })
    res.status(200).json({ category: category.category, siteId: category.userId, tableRange: user.siteInformation?.tableRange });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}