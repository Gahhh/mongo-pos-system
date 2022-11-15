import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/db.js'

export const hashPassword = (rawPass) => {
  const hash = crypto.createHash('md5');
  const password = hash.update(rawPass).digest('hex');
  return password;
};

const SECRET_KEY = '9mon9goMa0gic0';

export const generateToken = (email) => {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: '100day' }, { algorithm: 'HS256' });
}

export const verifyToken = (token) => {
  try {
    const { email } = jwt.verify(token, SECRET_KEY, { algorithm: 'HS256' });
    if (User.findOne({ email })) {
      return email;
    }
    return null;
  } catch (err) {
    return null;
  }
}

