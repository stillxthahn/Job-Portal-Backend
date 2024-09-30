const { unmarshall } = require("@aws-sdk/util-dynamodb");
const {
 GetCommand,
 PutCommand,
 DeleteCommand,
 UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../client");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config({ path: "./.env" });

const CVS_TABLE = process.env.CVS_TABLE;

const getCVByIdCompany = async (req, res) => {
 const params = {
  TableName: CVS_TABLE,
  FilterExpression: "idCompany = :i",
  ExpressionAttributeValues: {
   ":i": { N: req.params.id },
  },
 };
 console.log(params);
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
   res
    .status(404)
    .json({ error: `Cannot find CV by idCompany=${req.params.id}` });
  }
 } catch (error) {
  res.status(500).json({ error });
 }
};

const getCV = async (req, res) => {
 const params = {
  TableName: CVS_TABLE,
  Key: {
   id: parseInt(req.params.id, 10),
  },
 };
 console.log(params);
 try {
  const { Item } = await docClient.send(new GetCommand(params));
  if (Item) {
   res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
   });
   res.json(Item);
  } else {
   res.status(404).json({ error: `Cannot find CV by id=${req.params.id}` });
  }
 } catch (error) {
  res.status(500).json({ error });
 }
};

const createCV = async (req, res) => {
 const params = {
  TableName: CVS_TABLE,
  Item: req.body,
 };
 console.log(params);
 try {
  await docClient.send(new PutCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json(req.body);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Could not create CV" });
 }
};

const deleteCV = async (req, res) => {
 const params = {
  TableName: CVS_TABLE,
  Key: {
   id: parseInt(req.params.id, 10),
  },
 };
 try {
  await docClient.send(new DeleteCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json({ status: "succeed" });
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Could not delete CV" });
 }
};

const changeCVStatus = async (req, res) => {
 const status = req.body.statusRead;
 console.log(status);
 const params = {
  TableName: CVS_TABLE,
  Key: {
   id: parseInt(req.params.id),
  },
  UpdateExpression: "set statusRead =:a",
  ExpressionAttributeValues: {
   ":a": req.body.statusRead,
  },
  ReturnValues: "ALL_NEW",
 };
 try {
  const { Item } = await docClient.send(new UpdateCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json(Item);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Could not update CV" });
 }
};

module.exports = {
 getCVByIdCompany,
 getCV,
 createCV,
 deleteCV,
 changeCVStatus,
};
