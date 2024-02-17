const {registration}=require("../controllers/Registration.Controller")
module.exports = (app) => {
    app.route("/registration").post(registration);
    
}