var assert = require("assert");
var tracks = require("../../models/tracks");

describe("models/tracks", function () {

  it("can get all tracks ids", function () {
    var keys = tracks.getKeys();
    assert.deepEqual(keys, [
      "BD", "CPPS", "EHW", "ET", "HTS", "SU", "SC", "SM"
    ]);
  });

  it("can get the name from a track id", function () {
    var trackname = tracks.getFullName("HTS");
    assert.equal(trackname, "High Tech Systems");
  });

});
