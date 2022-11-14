import AWS from 'aws-sdk'
import { awsKey } from '../config/awsKey.js'
import { Buffer } from 'buffer'

const s3 = new AWS.S3(awsKey)

export const uploadFile = async (file) => {
  const base64Data = new Buffer.from(file.image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const params = {
    Bucket: 'menupicture',
    Key: `${Date.now().toString()}_${file.name}`,
    Body: base64Data,
    ContentEncoding: 'base64',
    ContentType: file.type,
  }
  try {
    const response = await s3.upload(params).promise()
    return response
  } catch (error) {
    return error;
  }
}

export const getPreSignedUrl = async (key) => {
  const params = {
    Bucket: key.Bucket,
    Key: key.Key,
    Expires: 60 * 60 * 24 * 365,
  }
  try {
    const response = await s3.getSignedUrl('getObject', params)
    return response
  } catch (error) {
    return error;
  }
}