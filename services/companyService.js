const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../client");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config({ path: "./.env" });

const COMPANY_TABLE = process.env.COMPANY_TABLE;

const getListCompany = async (req, res) => {
 const params = {
  TableName: COMPANY_TABLE,
 };
 try {
  const { Items } = await docClient.send(new ScanCommand(params));
  if (Items && Items.length > 0) {
   const unmarshalledItems = await Items.map((item) => unmarshall(item));
   res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
   });
   res.json(unmarshalledItems);
  } else {
   res.status(404).json({ error: "Cannot get job list" });
  }
 } catch (error) {
  res.status(500).json({ error });
 }
};

const getCompany = async (req, res) => {
 const params = {
  TableName: COMPANY_TABLE,
  Key: {
   id: parseInt(req.params.id, 10),
  },
 };
 try {
  const { Item } = await docClient.send(new GetCommand(params));
  if (Item) {
   res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
   });
   res.json(Item);
  } else {
   res.status(404).json({
    error: `Could not find Company with provided id=${req.params.id}`,
   });
  }
 } catch (error) {
  res.status(500).json({ error });
 }
};

const login = async (req, res) => {
 const params = {
  ExpressionAttributeValues: {
   ":e": { S: req.params.email },
   ":p": { S: req.params.password },
  },
  TableName: COMPANY_TABLE,
  FilterExpression: "email = :e and password = :p",
 };
 try {
  const { Items } = await docClient.send(new ScanCommand(params));
  if (Items && Items.length > 0) {
   const parsedData = unmarshall(Items[0]);
   console.log(parsedData);
   res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
   });
   res.json(parsedData);
  } else {
   res.status(404).json({
    error: `Could not find Company with provided email=${req.params.email} and password=${req.params.password}`,
   });
  }
 } catch (error) {
  res.status(500).json({ error: error });
 }
};

const checkExist = async (req, res) => {
 console.log(req.attribute, req.value);
 const params = {
  TableName: COMPANY_TABLE,
  ExpressionAttributeValues: {
   ":a": { S: req.params.value },
  },
  FilterExpression: `${req.params.attribute} = :a`,
 };
 console.log(params);
 try {
  const { Items } = await docClient.send(new ScanCommand(params));
  console.log(Items);
  if (Items && Items.length > 0) {
   const parsedData = unmarshall(Items[0]);
   res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
   });
   res.json(parsedData);
  } else {
   res.status(404).json({
    error: `Could not find Company with provided attribute=${req.params.attribute} and value=${req.params.value}`,
   });
  }
 } catch (error) {
  res.status(500).json({ error: error });
 }
};

const createCompany = async (req, res) => {
 console.log(req.body);
 const company = { ...req.body, id: Date.now() };
 const params = {
  TableName: COMPANY_TABLE,
  Item: company,
 };
 try {
  await docClient.send(new PutCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json(company);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Could not create company" });
 }
};

const editCompany = async (req, res) => {
 const company = { id: parseInt(req.params.id, 10), ...req.body };
 console.log(company);
 const params = {
  TableName: COMPANY_TABLE,
  Item: company,
 };
 try {
  await docClient.send(new PutCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json(company);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Cloud not update company" });
 }
};

module.exports = {
 getCompany,
 login,
 checkExist,
 createCompany,
 editCompany,
 getListCompany,
};
