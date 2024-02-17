

const {login}=require("../controllers/Login.Controllers")
const {registration}=require("../controllers/Registration.Controller")
module.exports = (app) => {
    app.route("/login").get(login);
    app.route("/registration").post(registration);
    
}