module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb/base", "eslint:recommended"],
  "env": {
    "browser": true,
    "mocha": true,
    "node": true,
    "es6": true,
    "jquery": true
  },
  "rules": {
    "eol-last": [0],
    "no-mixed-requires": [0],
    "no-underscore-dangle": [0],
    "no-unused-vars": "error",
    "eqeqeq": ["error", "always"],
    "indent": ["warn", 2],
    "semi": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-dangle": ["error", "never"],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "max-depth": ["warn", 4]
  },
}