'use strict';
const crypto = require("crypto");
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const id = crypto.randomBytes(16).toString("hex");

const tableName = 'studentData'

const createData = async(props) => {
  try{
    const params = {
      TableName: tableName,
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

const getDetail = async(pk, id) => {
  try{
    const params = {
      TableName: tableName,
      Key: {
        pk,
        id
      }
    };
    const { Item } = await ddb.get(params).promise();
    return Item;
  }catch(err){
    return Promise.reject(err);
  }
}

const getAllDataByGrade = async(pk, limit, startKey) => {
  try{
    const params = {
      TableName: tableName,
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
      TableName: tableName
    };
    const results = await ddb.scan(params).promise();
    return results;
  }catch(err){
    return Promise.reject(err);
  }
}

const updateData = async(pk, id, props) => {
  try{
    const params = {
      TableName: tableName,
      Key: {
        pk,
        id
      },
      UpdateExpression: 'SET firstName = :firstName, lastName = :lastName, birthdate = :birthdate',
      ExpressionAttributeValues: {
        ':firstName': props.firstName,
        ':lastName': props.lastName,
        ':birthdate': props.birthdate
      },
      ReturnValues: 'ALL_NEW'
    }
    return await ddb.update(params).promise()
  }catch(err){
    return Promise.reject(err);
  }
}

const deleteData = async(pk, id) => {
  try{
    const params = {
      TableName: tableName,
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

const batchGetData = async(propsA, propsB) => {
  try{
    const params = {
      RequestItems: {
        tableName: {
          Keys: [
            {
              pk: propsA.pk,
              id: propsA.id
            },
            {
              pk: propsB.pk,
              id: propsB.id
            }
          ]
        }
      },
    }
    return await ddb.batchGet(params).promise();
  }catch(err){
    return Promise.reject(err);
  }
}

const batchWriteData = async(propsA, propsB, propsC) => {
  try{
    const params = {
      RequestItems: {
        tableName: [
          {
            // Put item 
            PutRequest: {
              Item: {
                pk: propsA.grade,
                id: crypto.randomBytes(16).toString("hex"),
                firstName: propsA.firstName,
                lastName: propsA.lastName,
                birthdate: propsA.birthdate,
              }
            }
          },
          {
            // Put item 
            PutRequest: {
              Item: {
                pk: propsB.grade,
                id: crypto.randomBytes(16).toString("hex"),
                firstName: propsB.firstName,
                lastName: propsB.lastName,
                birthdate: propsB.birthdate,
              }
            }
          },
          {
            // Delete item
            DeleteRequest: {
              Key: {
                pk: propsC.pk,
                id: propsC.id
              }
            }
          }
        ]
      },
    }
    return await ddb.batchWrite(params).promise();
  }catch(err){
    return Promise.reject(err);
  }
}

module.exports = {
  createData,
  getDetail,
  getAllDataByGrade,
  getAllData,
  updateData,
  deleteData,
  batchGetData,
  batchWriteData
}