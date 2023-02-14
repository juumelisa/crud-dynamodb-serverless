'use strict';

const { getDetail, updateData } = require("../lib/ddb");

module.exports.handler = async(event) => {
  try{
    const body = JSON.parse(event.body);
    const result = await updateData(body.pk, body.id, body.dataToUpdate);
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'success',
          success: 0,
          result
        },
        null,
        2
      ),
    };
  }catch(err){
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: String(err),
          success: 1,
        },
        null,
        2
      ),
    };
  }
}