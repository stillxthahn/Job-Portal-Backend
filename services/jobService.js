const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");
const {
 GetCommand,
 PutCommand,
 DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../client");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config({ path: "./.env" });

const JOBS_TABLE = process.env.JOBS_TABLE;

const createJobDetails = async (req, res) => {
 let jobs = [];
 let companies = [];
 const scanJob = {
  TableName: JOBS_TABLE,
 };
 try {
  const { Items } = await docClient.send(new ScanCommand(scanJob));
  if (Items && Items.length > 0) {
   jobs = await Items.map((item) => unmarshall(item));
  }
 } catch (error) {
  console.log(error);
 }

 const scanCompany = {
  TableName: "job-portal-company",
 };
 try {
  const { Items } = await docClient.send(new ScanCommand(scanCompany));
  if (Items && Items.length > 0) {
   companies = await Items.map((item) => unmarshall(item));
  }
 } catch (error) {
  console.log(error);
 }

 const updatedJobs = jobs.map((job) => {
  const company = companies.find((company) => company.id === job.idCompany);
  if (company) {
   return {
    ...job,
    logoUrl: company.logoUrl,
    companyName: company.companyName,
   };
  }
  return job;
 });
 const putJobs = updatedJobs.map(async (job) => {
  const params = {
   TableName: JOBS_TABLE,
   Item: job,
  };
  try {
   await docClient.send(new PutCommand(params));
   res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
   });
   //  res.json(req.body);
   console.log("oke");
  } catch (error) {
   //  res.status(500).json({ error: error.message });
   console.log("ERROR", error);
  }
 });
 putJobs;
};

const getJob = async (req, res) => {
 const params = {
  TableName: JOBS_TABLE,
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
   res.status(404).json({ error: `Could not get job by id=${req.params.id}` });
  }
 } catch (error) {
  res.status(500).json(error);
 }
};

const getJobSearch = async (req, res) => {
 console.log(req.params.keyword, req.params.city);
 let expression;
 if (req.params.keyword != "__" && req.params.city != "__") {
  expression = {
   FilterExpression:
    "(#name = :n or contains (#tags, :t))  and contains (#city, :c)",
   ExpressionAttributeValues: {
    ":n": { S: req.params.keyword },
    ":t": { S: req.params.keyword },
    ":c": { S: req.params.city },
   },
   ExpressionAttributeNames: {
    "#name": "name",
    "#tags": "tags",
    "#city": "city",
   },
  };
 } else if (req.params.keyword != "__") {
  expression = {
   FilterExpression: "#name = :n or contains (#tags, :t)",
   ExpressionAttributeValues: {
    ":n": { S: req.params.keyword },
    ":t": { S: req.params.keyword },
   },
   ExpressionAttributeNames: {
    "#name": "name",
    "#tags": "tags",
   },
  };
 } else if (req.params.city != "__") {
  expression = {
   FilterExpression: "contains (#city, :c)",
   ExpressionAttributeValues: {
    ":c": { S: req.params.city },
   },
   ExpressionAttributeNames: {
    "#city": "city",
   },
  };
 }
 const params = {
  TableName: JOBS_TABLE,
  ...expression,
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
   res.status(404).json({
    error: `Cannot find job by params ${req.params.keyword} and ${req.params.city}`,
   });
  }
 } catch (error) {
  res.status(500).json({ error });
 }
};

const createJob = async (req, res) => {
 const job = { id: Date.now(), ...req.body };
 const params = {
  TableName: JOBS_TABLE,
  Item: job,
 };
 try {
  await docClient.send(new PutCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json(job);
 } catch (error) {
  res.status(500).json({ error });
 }
};

const updateJob = async (req, res) => {
 const params = {
  TableName: JOBS_TABLE,
  Item: req.body,
 };
 try {
  await docClient.send(new PutCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json(req.body);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

const deleteJob = async (req, res) => {
 const params = {
  TableName: JOBS_TABLE,
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
  res.status(500).json({ error: "Could not delete job" });
 }
};

const getJobsByCompanyId = async (req, res) => {
 const params = {
  TableName: JOBS_TABLE,
  FilterExpression: "idCompany = :i",
  ExpressionAttributeValues: {
   ":i": { N: req.params.id },
  },
 };
 console.log("PARAMS", params);
 try {
  const { Items } = await docClient.send(new ScanCommand(params));
  console.log("ITEMS", Items);
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
    .json({ error: `Cannot find job by idCompany=${req.params.id}` });
  }
 } catch (error) {
  res.status(500).json({ error });
 }
};

const getJobList = async (req, res) => {
 const params = {
  TableName: JOBS_TABLE,
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
module.exports = {
 getJob,
 createJob,
 updateJob,
 deleteJob,
 getJobsByCompanyId,
 getJobList,
 getJobSearch,
 createJobDetails,
};
