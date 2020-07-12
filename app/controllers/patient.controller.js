const db = require("../models");
const config = require("../config/auth.config");
const Measurement = db.measurement;
const Equipment = db.equipment;
const User = db.user;
const Patient = db.patient;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { QueryTypes } = require('sequelize');


exports.addPatient = (req, res) => {
    const doctorId = req.params.doctorId;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const username = req.body.username;
    if(!doctorId)
        return res.status(404).send({ message: "doctorId Not found." });
    if(!fullname)
        return res.status(404).send({ message: "Fullname Not found." });
    if(!email)
        return res.status(404).send({ message: "Email Not found." });
    if(!username)
        return res.status(404).send({ message: "Username Not found." });
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (!user) {
            User.create({
                username: username,
                email: email,
                password: bcrypt.hashSync(username, 8)
            })    
            .then(user => {
                user.setRoles([1]).then(() => {
                    Patient.create({
                        id: user.get('id'),
                        fullname: fullname,
                        email: email
                    })
                    .then(patient => {
                        user.addPatient(patient.get('id'))
                        .then(() => {
                            patient.addUser(doctorId)
                            .then(()=> {
                                res.send({ message: "Patient registered successfully!" });
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message: err.message || "User not found."
                                });
                            }); 
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || "User not found."
                            });
                        }); 
                    });
                });   
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
        }
        else{
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
        }
    })   
};
exports.listPatientsByDoctor = (req, res) => {
    const patientId = req.params.patientId;
    var stringSQL = '';
    stringSQL = 'SELECT * FROM patients ORDER BY fullname ASC'    
    db.sequelize.query(
        stringSQL,
        {
          type: QueryTypes.SELECT
        }
    )
    .then(patient => {
        res.send(patient);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving equipments."
        });
    });
    // const doctorId = req.params.doctorId;
    // if(!doctorId)
    //     return res.status(404).send({ message: "Patient Not found." });
    // User.findOne({
    //     attributes: ['id','username'],
    //     where: {
    //         id : doctorId
    //     },
    //     include: [{
    //         model: Patient,
    //         order: [ [ 'createdAt', 'ASC' ]]
    //     }]  
    // })
    // .then(user => {
    //     user.getPatients()
    //     .then(data => {
    //         res.send(data);
    //     });
    // })
    // .catch(err => {
    //     res.status(500).send({
    //     message:
    //         err.message || "Some error occurred while retrieving equipments."
    //     });
    // });
};
exports.listMeasurementByPatient = (req, res) => {
    const patientId = req.params.patientId;
    var viewType = 'last_7_days';
    var stringSQL = '';
    if(!patientId)
        return res.status(404).send({ message: "Patient Not found." });
    if(req.params.viewType)
        viewType = req.params.viewType;
    stringSQL = 'SELECT * FROM `vw_patient_measurements_`'+viewType+' where id = '+patientId+' ORDER BY x ASC'    
    db.sequelize.query(
        stringSQL,
        {
          type: QueryTypes.SELECT
        }
    )
    .then(patient => {
        res.send(patient);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving equipments."
        });
    });
};

exports.listLastMeasurementByPatient = (req, res) => {
    const patientId = req.params.patientId;
    var stringSQL = '';
    if(!patientId)
        return res.status(404).send({ message: "Patient Not found." });
    if(req.params.viewType)
        viewType = req.params.viewType;
    stringSQL = 'SELECT `id`,`fullname`,`weight`,`updatedAt` as computedAt FROM `vw_patient_measurements` where id = '+patientId+' ORDER BY computedAt DESC LIMIT 0,1'    
    db.sequelize.query(
        stringSQL,
        {
          type: QueryTypes.SELECT
        }
    )
    .then(measure => {
        res.send(measure);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving equipments."
        });
    });
};

exports.listPatient = (req, res) => {
    console.log('aidsadas');    

    const patientId = req.params.patientId;
    if(!patientId)
        return res.status(404).send({ message: "Patient Not found." });
    console.log('aidsadas', patientId);    
    Patient.findOne({
        where: {
            id : patientId
        }
    })
    .then(patient => {
        res.send(patient);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving equipments."
        });
    });

};


exports.listPatientMeasurements = (req, res) => {
    db.sequelize.query("SELECT * FROM patients", { type: sequelize.QueryTypes.SELECT})
    .then(function(users) {
        res.send(users);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving measurements."
        });
    });
}
