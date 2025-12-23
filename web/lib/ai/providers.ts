import { isTestEnvironment } from "../constants";

export const myProvider = {
  languageModel: (modelId: string) => ({
    modelId,
    // Placeholder for language model
  }),
};
