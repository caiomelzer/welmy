const db = require("../models");
const config = require("../config/auth.config");
const Measurement = db.measurement;
const Equipment = db.equipment;
const User = db.user;

exports.addMeasurement = (req, res) => {
    const mac = req.params.mac;
    const userId = req.body.userId;
    if(!userId)
        return res.status(404).send({ message: "User Not found." });
    if(!mac)
        return res.status(404).send({ message: "Mac Not found." });
    Equipment.findByPk(mac)
    .then(equipment => {
        Measurement.create({})
        .then(measurement => {
            console.log(measurement.get('id'));
            equipment.addMeasurement(measurement).then(() => {
                User.findOne({
                    where: {id : userId}
                })
                .then(user => {
                    console.log(measurement.get('id'));
                    user.addMeasurement(measurement.get('id')).then(() => {
                        res.send({ message: "Measurement registered successfully!" });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "User not found."
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

exports.findAllMeasurementByUser = (req, res) => {
    const userId = req.params.id;
    if(!userId)
        return res.status(404).send({ message: "User Not found." });
    User.findOne({
        attributes: ['id','username'],
        where: {
            id : userId
        },
        include: [{
            model: Measurement,
            order: [ [ 'createdAt', 'ASC' ]]
        }]        
    })
    .then(user => {
        user.getMeasurements()
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