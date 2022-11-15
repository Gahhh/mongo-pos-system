import { User } from '../models/db.js'
import { verifyToken, generateToken, hashPassword } from './util.js'

export const updateProfile = (req, res) => {
  const { userName, companyName, email, password, adminPin, profilePhoto, siteInformation } = req.body;
  try {
    const emailToken = verifyToken(req.headers.authorization.replace("Bearer ", ""));
    if (!emailToken) {
      res.status(401).send({ "message": "Unauthorized" });
      retrun
    }
    if (password) {
      const hashedPassword = hashPassword(password);
      User.updateOne({ email: emailToken }, { $set: { passwordEncoded: hashedPassword } }, (err, result) => {
        if (err) {
          res.status(500).send({ "message": "Password change fail, please try again." });
        }
      });
    }
    User.findOneAndUpdate({ email: emailToken }, { userName, companyName, email, adminPin, profilePhoto, siteInformation } , (err, user) => {
      if (err) {
        res.status(500).send({ "message": "Profile update fail, please try again." });
      } else if (!user) {
        res.status(400).send({ "message": "User does not exist" });
      }
      res.status(200).send({ "message": "User updated successfully" });
    })
  } catch (err) {
    res.status(400).send({ "message": "Invalid information" });
  }
}

export const getProfile = (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send({ "message": "Unauthorized" });
    return
  }
  const emailToken = verifyToken(req.headers.authorization.replace("Bearer ", ""));
  if (!emailToken) {
    res.status(401).send({ "message": "Unauthorized" });
    return
  }
  try {
    User.findOne({ email: emailToken }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({ "message": "User does not exist" });
      } else {
        res.status(200).send(user);
      }
    })
  }
  catch (err) {
    res.status(400).send({ "message": "Invalid information" });
  }
}

export const getSiteId = (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const email = verifyToken(token);
    if (!email) {
      res.status(401).send({ "message": "Unauthorized" });
      return
    }
    User.findOne({ email }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({ "message": "Invalid email" });
      } else {
        res.status(200).send({ "siteId": user._id });
      }
    })
  } catch (err) {
    res.status(401).send({ "message": "Invalid Token" });
  }
}