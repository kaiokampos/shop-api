// Importa as configurações base de cada ferramenta
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  // Configurações recomendadas do ESLint puro
  eslint.configs.recommended,

  // Configurações recomendadas do TypeScript
  ...tseslint.configs.recommended,

  // Configurações recomendadas do Prettier
  // Deve vir por último — desativa regras que conflitam com formatação
  prettierConfig,

  {
    // Define o ambiente onde o código roda
    languageOptions: {
      globals: {
        // Adiciona variáveis globais do Node.js (process, console, __dirname, etc)
        ...globals.node,
      },
    },

    // Registra o plugin do Prettier
    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // Mostra erros de formatação do Prettier como erros do ESLint
      "prettier/prettier": "error",

      // Proíbe variáveis declaradas mas nunca usadas
      // "warn" mostra aviso amarelo ao invés de erro vermelho
      "@typescript-eslint/no-unused-vars": "warn",

      // Permite usar "any" em casos específicos sem erro
      // Útil para iniciantes — removeremos essa regra futuramente
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
