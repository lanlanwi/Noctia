export default {
  extends: ['stylelint-config-standard-scss'],

  ignoreFiles: ['node_modules/**', 'dist/**', 'dev/**'],

  rules: {
    'no-empty-source': null,
    'selector-class-pattern': null,
    'declaration-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'scss/dollar-variable-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'scss/dollar-variable-colon-space-after': null,

    'hue-degree-notation': 'angle',
    'color-hex-length': 'long',
    'color-function-notation': 'modern',
    'color-function-alias-notation': null,
    'alpha-value-notation': 'number',

    'value-keyword-case': null,
    'scss/operator-no-newline-before': null,
    'scss/operator-no-newline-after': null,
  },
};
