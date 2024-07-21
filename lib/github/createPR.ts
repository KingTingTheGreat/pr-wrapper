'use server';
import { Octokit } from 'octokit';
import { getAllJournals } from '../journals/getJournals';
import { generateBranchName } from './generateBranchName';
import { OWNER, REPO } from '@/constants';
const yaml = require('js-yaml');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const createPull = async (
  authorEmail: string,
  journalTitle: string,
  file: File,
) => {
  console.log('Creating pull request...');
  try {
    // add file to branch then pr
    const current_sem = 'fall-2024'; // add logic to decide current semester

    // clean up filename
    const filename =
      journalTitle.replace(/ /g, '-').toLowerCase() +
      authorEmail.substring(0, authorEmail.indexOf('@'));

    // include this new file in yaml config
    const journals = await getAllJournals();

    if (journals[current_sem].includes(journalTitle)) {
      return { error: 'Journal already exists' };
    }
    journals[current_sem].push(filename);

    // generate branch name
    console.log('Generating branch name...');
    const branchName = await generateBranchName();

    // get basebranch sha
    console.log('Getting base branch sha...');
    const baseBranch = await octokit.request(
      'GET /repos/{owner}/{repo}/git/ref/{ref}',
      {
        owner: OWNER,
        repo: REPO,
        ref: 'heads/main',
      },
    );

    // create branch in github
    console.log('Creating branch in GitHub...', branchName);
    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
      owner: OWNER,
      repo: REPO,
      ref: `refs/heads/${branchName}`,
      sha: baseBranch.data.object.sha,
    });

    // create pdf file in github
    console.log('Creating pdf file in GitHub...');
    const fileContent = await file.arrayBuffer();
    const fileContentBase64 = Buffer.from(fileContent).toString('base64');
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: OWNER,
      repo: REPO,
      path: `public/journals/${current_sem}/${filename}.pdf`,
      message: `Add ${filename}.pdf`,
      content: fileContentBase64,
      branch: branchName,
    });
    // update yaml file in github
    console.log('Updating yaml file in GitHub...');
    const yamlContent = yaml.dump(journals);
    const yamlContentBase64 = Buffer.from(yamlContent).toString('base64');
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: OWNER,
      repo: REPO,
      path: `public/journals/journals.yaml`,
      message: `Update journals.yaml`,
      content: yamlContentBase64,
      branch: branchName,
    });

    const body = 'Automated PR to add journal to journal list';
    const title = `Add ${journalTitle} to journal list`;

    console.log('Creating pull request...');
    const result = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: OWNER,
      repo: REPO,
      title,
      body,
      head: branchName,
      base: 'main',
    });

    return result;
  } catch (error: any) {
    console.log(
      `Error! Status: ${error.status}. Message: ${error.response.data.message}`,
    );
    return { error: error.response.data.message };
  }
};
