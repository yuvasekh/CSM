const { getlogin } = require("../utils/sqlQueries.js");
const ProcessUploadedFile = require("../utils/resourcefunction.js");
module.exports.uploadFiles = async (req, res) => {
  let data = req.files;
  let userId = req.params.userId;
  console.log(data, "yuva");
  try {
    await ProcessUploadedFile(data, userId);

    res.status(200).json({ data: "uploaded" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed To Uplaod" });
  }
};
