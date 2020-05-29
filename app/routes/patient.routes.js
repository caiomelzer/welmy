const { authJwt } = require("../middleware");
const controller = require("../controllers/patient.controller");

module.exports = function(app) {
    //Set Headers parameters
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    //Add Patients 
    app.post(
        "/api/doctors/:doctorId/patients/", 
        [authJwt.verifyToken, authJwt.isDoctor],
        controller.addPatient
    );

    //List All Patients from Doctor
    app.get(
        "/api/doctors/:doctorId/patients/", 
        [authJwt.verifyToken, authJwt.isDoctor],
        controller.listPatientsByDoctor
    );

    //List All Measurement From Patient
    app.get(
        "/api/patients/:patientId/measurements/:viewType?", 
        [authJwt.verifyToken],
        controller.listMeasurementByPatient
    );

    //List data From Patient
    app.get(
        "/api/patients/:patientId/", 
        [authJwt.verifyToken],
        controller.listPatient
    );

};




