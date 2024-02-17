const { login } = require("../controllers/Login.Controllers");
const { registration } = require("../controllers/Registration.Controller");
const { uploadFiles } = require("../controllers/upload.Controller");
module.exports = (app) => {
  app.route("/login").get(login);
  app.route("/registration").post(registration);
  app.route("/uploadFile").post(uploadFiles);
};
