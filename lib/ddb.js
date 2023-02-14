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
        pk: props.grade,
        id: crypto.randomBytes(16).toString("hex"),
        firstName: props.firstName,
        lastName: props.lastName,
        birthdate: props.birthdate,
      }
    };
    return await ddb.put(params).promise();
  }catch(err){
    return Promise.reject(err);
  }
}

const getAllDataByGrade = async(pk, limit, startKey) => {
  try{
    const params = {
      TableName: 'studentData',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
      Limit: limit
    };
    if(startKey){
      params.ExclusiveStartKey = {
        pk: startKey.pk,
        id: startKey.id
      }
    }
    const results = await ddb.query(params).promise();
    return results;
  }catch(err){
    return Promise.reject(err);
  }
}

const getAllData = async() => {
  try{
    const params = {
      TableName: 'studentData'
    };
    const results = await ddb.scan(params).promise();
    return results;
  }catch(err){
    return Promise.reject(err);
  }
}

const deleteData = async(pk, id) => {
  try{
    const params = {
      TableName: 'studentData',
      Key: {
        pk,
        id
      },
      ReturnValues: 'ALL_OLD'
    };
    return await ddb.delete(params).promise();
  }catch(err){
    return Promise.reject(err);
  }
}

module.exports = {
  createData,
  getAllDataByGrade,
  getAllData,
  deleteData
}