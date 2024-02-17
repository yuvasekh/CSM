const { getlogin } = require("../utils/sqlQueries.js");
const { ProcessUploadedFile } = require("../utils/resourcefunction.js");
module.exports.uploadFiles = async (req, res) => {
  let data = req.files;
  let userId = req.params.userId;
  console.log(data, "yuva");
  try {
    var result1 = await ProcessUploadedFile(data, userId);
    console.log(result1, "inside");
    res.status(200).json({ data: result1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed To Uplaod" });
  }
};
