const yaml = require('js-yaml');

export const getAllJournals = async () => {
  const response = await fetch('/journals/journals.yml');
  const text = await response.text();
  return yaml.load(text);
};
