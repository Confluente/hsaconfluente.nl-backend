var express = require("express");

var User = require("../models/user");
var Enrollment = require("../models/enrollment");
var Group = require("../models/group");
var permissions = require("../permissions");

var router = express.Router();

router.route("/")
.all(permissions.requireAll({type: "USER_MANAGE"}))
.get(function (req, res, next) {
  User.findAll({
    attributes: ["id", "email", "displayName"],
    include: [{
      model: Enrollment,
      attributes: ["year", "track", "partial"]
    }, {
      model: Group,
      attributes: ["id", "displayName"],
      through: {attributes: ["func"]}
    }]
  }).then(function (results) {
    res.send(results);
  });
})
.post(function (req, res) {
  return User.create(req.body, {include: Enrollment})
  .then(function (result) {
    //console.log(result);
    res.status(201).send("ok");
  }).done();
});

router.route("/:id")
.all(function (req, res, next) {
  console.log("caught!");
  next();
})
.get(function (req, res) {
  res.send("k");
});

//router.route("/:id/enrollments");

module.exports = router;
