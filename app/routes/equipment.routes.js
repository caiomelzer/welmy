const { authJwt } = require("../middleware");
const controller = require("../controllers/equipment.controller");

module.exports = function(app) {
    var routeName = "/api/equipments";  
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //Show All Equipments
    app.get("/api/equipments/", controller.findAll);

    //Find specific equipment
    app.get("/api/equipments/:mac", controller.findOne);

    //Find specific equipment
    app.put("/api/equipments/:mac", controller.findOne);

};
