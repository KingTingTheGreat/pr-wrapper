'use server';
import { AllJournals } from '@/types';
import fs from 'fs';
import path from 'path';
const yaml = require('js-yaml');

export const getAllJournals = async (): Promise<AllJournals> => {
  const filePath = path.join(process.cwd(), 'public', 'journals/journals.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents);
};
