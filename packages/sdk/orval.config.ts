import { defineConfig } from "orval";

export default defineConfig({
  axios: {
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
    input: {
      target: "../../backend/src/entrypoints/api/openApi/openapi.json",
      validation: true,
    },
    output: {
      mode: "split",
      target: "./axios/index.ts",
      workspace: "./src/",
    },
  },
  reactQuery: {
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
    input: {
      target: "../../backend/src/entrypoints/api/openApi/openapi.json",
      validation: true,
    },
    output: {
      client: "react-query",
      mode: "split",
      target: "./react-query/index.ts",
      workspace: "./src/",
    },
  },
  zod: {
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
    input: {
      target: "../../backend/src/entrypoints/api/openApi/openapi.json",
      validation: true,
    },
    output: {
      client: "zod",
      mode: "single",
      target: "./zod/index.ts",
      workspace: "./src/",
    },
  },
});
