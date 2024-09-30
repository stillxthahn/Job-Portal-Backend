const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../client");
require("dotenv").config({ path: "./.env" });

const CITY_TABLE = process.env.CITY_TABLE;

// Define the city route as a function
const getListCity = async (req, res) => {
 const params = {
  TableName: CITY_TABLE, // Ensure this is coming from the environment or passed in
 };
 try {
  const { Items } = await docClient.send(new ScanCommand(params));
  res.set({
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Credentials": true,
  });
  res.json(Items);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Could not retrieve cities" });
 }
};

module.exports = { getListCity };
