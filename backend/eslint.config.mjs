import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
        "no-unused-vars": "warn",
        "no-async-promise-executor": "warn" 
    },
    languageOptions: { globals: globals.node },
  },
  globalIgnores(['**/__tests__/']),
]);
