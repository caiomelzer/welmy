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

    //Show All Measurements from Equipament
    app.get(
        "/api/equipments/:mac/measurements/last", 
        controller.findLastMeasurementByEquipment
    );

    //Show Specific Measurement from Equipament
    app.get(
        "/api/equipments/:mac/measurements/:measurement/", 
        controller.findMeasurementSpecificByEquipment
    );

    //Add Measurement from Equipament
    app.post(
        "/api/equipments/:mac/measurements/", 
        [authJwt.verifyToken],
        controller.addMeasurement
    );

    //Update specific Measurement
    app.put(
        "/api/equipments/:mac/measurements/:id", 
        controller.setWeightToMeasurement
    );
};
