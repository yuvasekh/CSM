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
  async function getlogin(projectId) {
    try {
      console.log("inside projects", projectId);
      let selectQuery = `select * from ProjectFiles where ProjectId = '${projectId}' and Processed = 0`;
      console.log("selectQuery", selectQuery);
      // let pool = await sql.connect(config);
      let dbResp = await pool.request().query(selectQuery);
      // console.log("dbResp", dbResp.recordset);
      return dbResp.recordset;
    } catch (error) {
      console.log("error", error);
    }
  }
  export default getlogin