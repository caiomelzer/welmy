const { authJwt } = require("../middleware");
const controller = require("../controllers/measurement.controller");

module.exports = function(app) {
    //Set Headers parameters
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //Show All Measurements
    app.get(
        "/api/equipments/:mac/measurements/", 
        controller.findLastMeasurementByEquipment
    );

    //Find specific Measurement
    app.post(
        "/api/equipments/:mac/measurements/", 
        [authJwt.verifyToken],
        controller.addMeasurement
    );

    //Find specific Measurement
    app.put(
        "/api/equipments/:mac/measurements/:id", 
        controller.setWeightToMeasurement
    );

    //Show All Measurements from User
    app.get(
        "/api/users/:id/measurements/", 
        controller.findAllMeasurementByUser
    );

};
