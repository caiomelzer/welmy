const db = require("../models");
const config = require("../config/auth.config");
const Measurement = db.measurement;
const Equipment = db.equipment;
const User = db.user;
const Patient = db.patient;
const sequelize = require('sequelize');

exports.addMeasurement = (req, res) => {
    const mac = req.params.mac;
    const patientId = req.body.patientId;
    if(!patientId)
        return res.status(404).send({ message: "User Not found." });
    if(!mac)
        return res.status(404).send({ message: "Mac Not found." });
    Equipment.findByPk(mac)
    .then(equipment => {
        Measurement.create({})
        .then(measurement => {
            equipment.addMeasurement(measurement).then(() => {
                Patient.findOne({
                    where: {id : patientId}
                })
                .then(patient => {
                    patient.addMeasurement(measurement.get('id'))
                    .then(() => {
                        res.send({ message: "Measurement registered successfully!" });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Patient not found."
                        });
                    }); 
                });  
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Measurement not created"
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Equipament not found."
            });
        });
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Equipment with MAC=" + mac
        });
    });
};

exports.findMeasurementSpecificByEquipment = (req, res) => {
    const mac = req.params.mac;
    if(!mac)
        return res.status(404).send({ message: "Mac Not found." });
    const measurementId = req.params.measurement;
    if(!measurementId)
        return res.status(404).send({ message: "Measurement Not found." });
    Equipment.findOne({
        limit: 1,
        attributes: ['mac'],
        where: {
            mac : mac
        },
        include: [{
            attributes: ['id','weight'],
            model: Measurement,
            where: [{
                weight : null
            }]
        }]        
    })
    .then(equipment => {
        equipment.getMeasurements({
            where:[{
                id: measurementId
            }],
            order: [ [ 'id', 'ASC' ]]
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Measurements."
            });
        });   
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Measurement."
      });
    });
};

exports.findLastMeasurementByEquipment = (req, res) => {
    const mac = req.params.mac;
    if(!mac)
        return res.status(404).send({ message: "Mac Not found." });
    Equipment.findOne({
        limit: 1,
        attributes: ['mac'],
        where: {
            mac : mac
        },
        include: [{
            attributes: ['id','weight'],
            model: Measurement,
            where: [{
                weight : null
            }]
        }]        
    })
    .then(equipment => {
        equipment.getMeasurements({
            limit:1,
            order: [ [ 'id', 'ASC' ]]
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Measurements."
            });
        });   
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Measurement."
      });
    });
};

exports.findAllMeasurementByPatient = (req, res) => {
    const patientId = req.params.id;
    if(!patientId)
        return res.status(404).send({ message: "Patient Not found." });
    Patient.findOne({
        attributes: ['id','username'],
        where: {
            id : patientId
        },
        include: [{
            model: Measurement,
            order: [ [ 'createdAt', 'ASC' ]]
        }]        
    })
    .then(patient => {
        patient.getMeasurements()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Measurements."
            });
        }); 
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Measurement."
      });
    });
};

exports.setWeightToMeasurement = (req, res) => {
    const id = req.params.id;
    if(!req.body.weight)
        return res.status(500).send({ message: "Weight Cannot be empty." });
    if(!id)
        return res.status(404).send({ message: "Measurement Not found." });
    Measurement.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Measurement was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Measurement with id=${id}. Maybe Measurement was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Measurement with id=" + id
        });
      });
  };
