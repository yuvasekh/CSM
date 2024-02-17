const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const DB_CONNECTION_POOL_SIZE = 25;
const config = {
  server: process.env.server,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
  options: {
    enableArithAbort: true,
    encrypt: true,
  },
  pool: {
    max: DB_CONNECTION_POOL_SIZE,
    min: 0,
  },
};
var pool;
sql
  .connect(config)
  .then((data) => {
    console.log(
      "SqlQueries: SQL DB connected with pool size: ",
      DB_CONNECTION_POOL_SIZE
    );
    pool = data;
  })
  .catch((error) => {
    console.log(error, " connecting to DB");
  });
// async function getlogin(projectId) {
//   try {
//     console.log("inside projects", projectId);
//     let selectQuery = `select * from ProjectFiles where ProjectId = '${projectId}' and Processed = 0`;
//     console.log("selectQuery", selectQuery);
//     // let pool = await sql.connect(config);
//     let dbResp = await pool.request().query(selectQuery);
//     // console.log("dbResp", dbResp.recordset);
//     return dbResp.recordset;
//   } catch (error) {
//     console.log("error", error);
//   }
// }
async function insertDocument(
  splitFileId,
  mainPDFId,
  originalname,
  splitFileBlobName,
  i,
  projectId,
  startPageNumber,
  fileType
) {
  const query = `INSERT INTO dbo.PdfSplitFiles 
  VALUES (@Id,@ProjectFileId,@SplitFileName,@FileRelativeURL,@ProjectId,@Processed,@Isprivate,@StartPageNumber,@MainFileName,@Type)`;
  try {
    // let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("Id", splitFileId)
      .input("ProjectFileId", mainPDFId)
      .input("SplitFileName", i + 1 + "_" + originalname)
      .input("FileRelativeURL", splitFileBlobName)
      .input("ProjectId", projectId)
      .input("Processed", 0)
      .input("Isprivate", 0)
      .input("StartPageNumber", startPageNumber)
      .input("MainFileName", originalname)
      .input("Type", fileType)

      .query(query);
    // console.log("Inserted PDF Split file to DB")
    return response;
  } catch (error) {
    console.log(error);
  }
}
async function insertDocumentQuestions(
  splitFileId,
  mainPDFId,
  originalname,
  splitFileBlobName,
  i,
  projectId,
  startPageNumber,
  fileType
) {
  const query = `INSERT INTO dbo.PdfSplitFiles 
  VALUES (@Id,@ProjectFileId,@SplitFileName,@FileRelativeURL,@ProjectId,@Processed,@Isprivate,@StartPageNumber,@MainFileName,@Type)`;
  try {
    // let pool = await sql.connect(config);
    let response = await pool
      .request()
      .input("Id", splitFileId)
      .input("ProjectFileId", mainPDFId)
      .input("SplitFileName", i + 1 + "_" + originalname)
      .input("FileRelativeURL", splitFileBlobName)
      .input("ProjectId", projectId)
      .input("Processed", 0)
      .input("Isprivate", 0)
      .input("StartPageNumber", startPageNumber)
      .input("MainFileName", originalname)
      .input("Type", fileType)

      .query(query);
    // console.log("Inserted PDF Split file to DB")
    return response;
  } catch (error) {
    console.log(error);
  }
}
module.exports.insertDocument = insertDocument;
module.exports.insertDocumentQuestions = insertDocumentQuestions;
