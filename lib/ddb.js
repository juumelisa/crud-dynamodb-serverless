'use strict';
const crypto = require("crypto");
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const id = crypto.randomBytes(16).toString("hex");

const createData = async(props) => {
  try{
    const params = {
      TableName: 'studentData',
      Item: {
        id: crypto.randomBytes(16).toString("hex"),
        firstName: props.firstName,
        lastName: props.lastName,
        birthdate: props.birthdate,
        grade: props.grade
      }
    }
    return await ddb.put(params).promise();
  }catch(err){
    return Promise.reject(err);
  }
}

module.exports = {
  createData
}