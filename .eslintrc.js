module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb-base",
        "plugin:wc/best-practice"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    // "rules": {
    //     "wc/rule-name": "error"
    // },
    "plugins": ["wc"]
};