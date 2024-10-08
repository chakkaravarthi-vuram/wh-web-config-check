module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
        },
      },
    },
    extends: ['plugin:react/recommended'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react', 'react-hooks'],
    rules: {
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'no-bitwise': [0],
      'arrow-body-style': [
        'error',
        'as-needed',
        { requireReturnForObjectLiteral: true },
      ],
      'linebreak-style': [0],
      'react/state-in-constructor': [0],
      'no-console': [0],
      'no-underscore-dangle': [0],
      'react/sort-comp': [
        1,
        {
          order: [
            'static-methods',
            'lifecycle',
            'render',
            '/^on.+$/',
            'everything-else',
          ],
        },
      ],
      'max-len': [0, { code: 125, tabWidth: 2 }],
      camelcase: [0],
      'react/button-has-type': [0],
      'jsx-a11y/control-has-associated-label': [0],
      'react/prop-types': 0,
      'react/jsx-indent': 0,
      'react/jsx-indent-props': 0,
      'implicit-arrow-linebreak': 0,
      'operator-linebreak': 0,
      'object-curly-newline': 0,
      'no-shadow': 0,
      'no-param-reassign': 0,
      'react/jsx-curly-newline': 0,
      'no-case-declarations': 0,
      indent: 0,
      'react/no-unused-prop-types': 0,
      'import/no-extraneous-dependencies': 0,
      'prefer-arrow-callback': 0,
      'no-unused-expressions': 0,
      'react/no-array-index-key': 0,
      'no-plusplus': 0,
      'no-else-return': 0,
      'valid-typeof': 0,
      'no-lone-blocks': 0,
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      // 'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
      'no-lonely-if': 0,
      'no-nested-ternary': 0,
      'object-shorthand': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'no-confusing-arrow': 0,
      'import/no-named-as-default-member': 0,
      'react/forbid-prop-types': 0,
      'import/no-cycle': 0,
      'class-methods-use-this': 'off',
      'react/jsx-props-no-spreading': 'off',
      'default-param-last': 'off',
      'react/no-unstable-nested-components': 0,
      // 'no-undef': 0,
      'no-promise-executor-return': 0,
      'react/require-default-props': 0,
      'import/prefer-default-export': 0,
      'function-paren-newline': 0,
      'react/jsx-wrap-multilines': 0,
      'react/no-unknown-property': 0,
    },
  };
  