module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        // Add any additional plugins you are using
    ],
    rules: {
        'no-unused-vars': 'warn', // Change to 'off' to disable
        'react/prop-types': 'off', // Disable prop-types validation
        'eqeqeq': 'off',
        'no-console': 'warn',
        "react/react-in-jsx-scope": "off"
        // Add other custom rules
    },
    settings: {
        react: {
            version: 'detect', // Automatically detect the react version
        },
    },
};
