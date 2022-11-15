import AWS from 'aws-sdk'
import { awsKey } from '../config/awsKey.js'
import { countryCode } from '../config/translate.js'
const s3 = new AWS.S3(awsKey.s3key)
const translate = new AWS.Translate(awsKey.translateKey)

export const uploadFile = async (file) => {
  const base64Data = new Buffer.from(file.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
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

export const translateText = async (text, source='en', target) => {
  const translatedPack = new Array();
  if (target[0]) {
    const params = {
      Text: text,
      SourceLanguageCode: source,
      TargetLanguageCode: target[0],
    }
    try {
      const response = await translate.translateText(params).promise()
      translatedPack.push(
        {
          language: countryCode[target[0]],
          text: response.TranslatedText
        }
      )
    } catch (error) {
      return { error: error.code };
    }
  }
  if (target[1]) {
    const params = {
      Text: text,
      SourceLanguageCode: source,
      TargetLanguageCode: target[1],
    }
    try {
      const response = await translate.translateText(params).promise()
      translatedPack.push(
        {
          language: countryCode[target[1]],
          text: response.TranslatedText
        }
      )
    } catch (error) {
      return { error: error.code };
    }
  }
  return translatedPack;
}