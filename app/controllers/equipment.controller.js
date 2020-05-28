const db = require("../models");
const config = require("../config/auth.config");
const Equipment = db.equipment;

exports.findAll = (req, res) => {
    Equipment.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving equipments."
      });
    });
};

exports.findOne = (req, res) => {
    const mac = req.params.mac;
    Equipment.findByPk(mac)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Equipment with MAC=" + mac
        });
    });
};

exports.update = (req, res) => {
    const mac = req.params.mac;
  
    Equipment.update(req.body, {
      where: { mac: mac }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Equipment was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Equipment with mac=${mac}. Maybe Equipment was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Equipment with id=" + mac
        });
      });
  };