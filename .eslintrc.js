module.exports = {
  "parserOptions": {
    "ecmaVersion": 2022
  },
  "extends": ["eslint:recommended", "prettier"],
  "env": {
        "es6": true,
        "node": true,
        "jest": true
  },
  "rules": { "no-console": "warn" },
  globals: {
    describe: true,
    before: true,
    beforeEach: true,
    it: true,
    after: true,
    afterEach: true,
    expect: true,
    Set: true,
    Map: true,
  },
}
