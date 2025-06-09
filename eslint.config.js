import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 获取当前文件目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
    // ==================== 基础配置 ====================
    {
        files: ['**/*.{js,mjs,cjs,ts,vue}'],
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            'no-console':
                process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger':
                process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            semi: 'error',
        },
    },

    // ==================== TypeScript 配置 ====================
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.eslint.json',
                tsconfigRootDir: __dirname,
            },
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: path.resolve(__dirname, 'tsconfig.json'),
                },
                alias: {
                    map: [['@', './src']],
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
                },
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },

    // ==================== Vue 配置 ====================
    pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.vue'],
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/html-self-closing': [
                'error',
                {
                    html: {
                        void: 'always',
                        normal: 'never',
                        component: 'always',
                    },
                },
            ],
        },
    },

    // ==================== 忽略文件 ====================
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/coverage/**',
            '**/.vite/**',
            '**/.history/**',
        ],
    },
]);
