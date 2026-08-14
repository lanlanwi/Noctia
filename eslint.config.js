import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', 'dev/**'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },

    rules: {
      'no-console': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['scripts/**/*.js', 'config/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
