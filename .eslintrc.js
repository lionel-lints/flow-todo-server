module.exports = {
  "extends": [
    "airbnb",
  ],
  "plugins": [
    "import"
  ],
  "ecmaFeatures": {
    "modules": true,
    "experimentalObjectRestSpread": true
  },
  "globals": {},
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "no-console": 1,
    "comma-dangle": 2,
    "no-unreachable": 2,
    "no-unused-vars": 0,
    "no-var": 2,
    "semi": 2,
    "object-shorthand": 2,
    "prefer-arrow-callback": 2,
    "prefer-const": 2,
    "prefer-spread": 2,
    "prefer-template": 2
  }
};
