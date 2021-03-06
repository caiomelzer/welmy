const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Patient = db.patient;


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Register User
  console.log(req.body);
  User.create({
    username: req.body.username,
    email: req.body.email,
    full: req.body.fullname,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
      Patient.create({
        id: user.get('id'),
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username
      })
      .then((patient) =>{
        user.setPatients(patient);
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Signin User if Exists
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    console.log('Entrou');
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        fullname: user.full
      });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};
