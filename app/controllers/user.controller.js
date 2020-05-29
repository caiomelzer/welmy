const db = require("../models");
const config = require("../config/auth.config");
const Measurement = db.measurement;
const Equipment = db.equipment;
const User = db.user;
const Patient = db.patient;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};




