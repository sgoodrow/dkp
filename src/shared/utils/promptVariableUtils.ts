import { difference, uniq } from "lodash";

export const PROMPT_VARIABLE_START_SYMBOL = "@";
const PROMPT_VARIABLE_INVALID_CHARACTERS = new RegExp(/[^A-Za-z0-9_@]/g);

export const promptVariableUtils = {
  isNameInvalid: (name: string) => {
    return PROMPT_VARIABLE_INVALID_CHARACTERS.test(name);
  },

  /**
   * @returns the list of required variable names in the prompt draft text.
   */
  getPromptDraftTextUsedRequiredNames: (promptDraftText: string) => {
    const words = promptDraftText.split(/\W+/);
    return uniq(
      words
        .filter((w) => w.includes(PROMPT_VARIABLE_START_SYMBOL))
        .map((w) => w.replace(PROMPT_VARIABLE_INVALID_CHARACTERS, ""))
        .filter((w) => w.startsWith(PROMPT_VARIABLE_START_SYMBOL))
        .map((w) => w.slice(1)),
    );
  },

  /**
   * @returns the list of required variable names in the prompt draft text that are missing from the list of variable assignment names.
   */
  getPromptDraftTextMissingVariablesNames: (
    promptDraftText: string,
    variableAssignmentNames: string[],
  ) => {
    return difference(
      promptVariableUtils.getPromptDraftTextUsedRequiredNames(promptDraftText),
      variableAssignmentNames,
    );
  },
};
