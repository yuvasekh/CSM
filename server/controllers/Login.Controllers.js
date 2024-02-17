const { getlogin } = require("../Utils/SqlQueries.js");
module.exports.login = async (req, res) => {
    const projectId = req.params.id;
    if (projectId) {
      try {
        var projectdetails = await getlogin(projectId);
  
        res.status(200).json(projectdetails[0]);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(400).json("Invalid Params");
    }
  };