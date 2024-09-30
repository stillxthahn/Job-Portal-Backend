const { unmarshall } = require("@aws-sdk/util-dynamodb");
const {
 GetCommand,
 PutCommand,
 DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../client");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config({ path: "./.env" });

const TAGS_TABLE = process.env.TAGS_TABLE;

const getListTag = async (req, res) => {
 const params = {
  TableName: TAGS_TABLE,
 };
 try {
  const { Items } = await docClient.send(new ScanCommand(params));
  if (Items && Items.length > 0) {
   const unmarshalledItems = Items.map((item) => unmarshall(item));
   res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
   });
   res.json(unmarshalledItems);
  } else {
   res.status(404).json({ error: "Cannot get list tags" });
  }
 } catch (error) {
  res.status(500).json({ error });
 }
};

module.exports = { getListTag };
