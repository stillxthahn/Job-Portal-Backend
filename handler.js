const { getListCity } = require("./services/cityService");
const {
 getCompany,
 login,
 checkExist,
 createCompany,
 editCompany,
 getListCompany,
} = require("./services/companyService");

const {
 getCVByIdCompany,
 getCV,
 createCV,
 deleteCV,
 changeCVStatus,
} = require("./services/cvService");
const {
 getJob,
 createJob,
 updateJob,
 deleteJob,
 getJobsByCompanyId,
 getJobList,
 getJobSearch,
 createJobDetails,
} = require("./services/jobService");

require("dotenv").config({ path: "./.env" });
const express = require("express");
const serverless = require("serverless-http");
const { getListTag } = require("./services/tagService");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// CITY SERVICES
app.get("/city", getListCity);

// COMPANY SERVICES
app.get("/company", getListCompany);
app.get("/company/:id", getCompany);
app.get("/company/login/email=:email&password=:password", login);
app.get("/company/check/:attribute/:value", checkExist);
app.post("/company", createCompany);
app.patch("/company/:id", editCompany);

// CV SERVICES
app.get("/cv/:id", getCV);
app.get("/cv/company/:id", getCVByIdCompany);
app.post("/cv", createCV);
app.delete("/cv/:id", deleteCV);
app.patch("/cv/:id", changeCVStatus);

// JOB SERVICES
app.get("/job/list", getJobList);
app.get("/job/search/keyword=:keyword&city=:city", getJobSearch);
app.get("/job/company/:id", getJobsByCompanyId);
app.get("/job/:id", getJob);
app.post("/job", createJob);
app.put("/job/:id", updateJob);
app.delete("/job/:id", deleteJob);

// TAG SERVIERS
app.get("/tag", getListTag);

module.exports.handler = serverless(app);
