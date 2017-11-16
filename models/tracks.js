var tracks = {
  "BD": {
    name: "Big Data"
  },
  "CPPS": {
    name: "Competitive programming and problem solving"
  },
  "EHW": {
    name: "Empowerment for Health and Wellbeing"
  },
  "ET": {
    name: "Energy Transition"
  },
  "HTS": {
    name: "High Tech Systems"
  },
  "SU": {
    name: "SensUs"
  },
  "SC": {
    name: "Smart Cities"
  },
  "SM": {
    name: "Smart Mobility"
  }
};

module.exports = {
  getKeys: function () {
    return Object.keys(tracks);
  },
  getFullName: function (track) {
    return tracks[track].name;
  }
};
