"use server";
import { Octokit } from "octokit";

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.OWNER as string;
const REPO = process.env.REPO as string;

export const approvePR = async (pull_number: number) => {
	try {
		console.log("Approving...", OWNER, REPO, pull_number);

		const result = await octokit.request(`PUT /repos/${OWNER}/${REPO}/pulls/${pull_number}/merge`);

		return result;
	} catch (error: any) {
		console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
		return { error: error.response.data.message };
	}
};
