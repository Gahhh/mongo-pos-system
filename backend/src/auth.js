import { User } from '../models/db.js'
import { hashPassword, generateToken, verifyToken } from './util.js'

export const userRegister = (req, res) => {
  const { userName, companyName, email, password, adminPin } = req.body;
  try {
    const passwordEncoded = hashPassword(password);
    const user = new User({ userName, companyName, email, passwordEncoded, adminPin })
    user.save((err) => {
      if (err) {
        res.status(400).send({ "message": "User already exists" });
      } else {
        const token = generateToken(email);
        res.status(200).send({ "token": token })
      }
    })
  }
  catch (err) {
    res.status(400).send({ "message": "Invalid information" });
  }
}

export const userLogin = (req, res) => {
  const { email, password } = req.body;
  try{
    const passwordEncoded = hashPassword(password);
    User.findOne({ email, passwordEncoded }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({ "message": 'Invalid email or password'});
      } else {
        const token = generateToken(email);
        res.status(200).send({ "token": token })
      }
    })
  }
  catch(err){
    res.status(400).send({ "message": 'Invalid email or password'});
  }
}

export const getAdminAccess = (req, res) => {
  const { adminPin } = req.body;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    User.findOne({ email, adminPin }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({ "message": "Invalid adminPin" });
      } else {
        res.status(200).send({ "message": "Successful" });
      }
    })
  } catch (err) {
    res.status(401).send({ "message": "Invalid Token" });
  }
}

export const verifyPassword = (req, res) => {
  const { password } = req.body;
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    const passwordEncoded = hashPassword(password);
    User.findOne({ email, passwordEncoded }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({ "message": "Invalid password" });
      } else {
        res.status(200).send({ "message": "Correct password" });
      }
    })
  } catch (err) {
    res.status(401).send({ "message": "Invalid Token" });
  }
}

