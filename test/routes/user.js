var assert = require("assert");

var testData = require("../testData");

describe("routes/user", function () {

  describe("GET /user", function () {
    it("lists all users", function () {
      return testData.adminUserAgent
      .get("/api/user/")
      .expect(200)
      .then(function (res) {
        //console.log(res.body);
        assert(res.body.length > 0);
        res.body.forEach(function (user) {
          assert.equal(typeof user.email, "string");
          assert.equal(typeof user.enrollments.length, 'number');
          assert.equal(typeof user.groups.length, 'number');
        });
      });
    });

    it("requires permission", function () {
      return testData.testUserAgent
      .get("/api/user")
      .expect(403);
    });
  });

  var testUser = {
    email: "t.e.s.t.user@student.tue.nl",
    enrollments: [{
      year: 2017,
      school: "M"
    }]
  };

  describe("POST /users", function () {
    it("creates a new user", function () {
      return testData.adminUserAgent
      .post("/api/user")
      .send(testUser)
      .expect(201)
      .then(function (res) {
        //console.log("res", res.body);
        return testData.adminUserAgent
        .get("/api/user")
        .then(function (res) {
          //console.log(JSON.stringify(res.body));
        });
      });
    });
  });

});
