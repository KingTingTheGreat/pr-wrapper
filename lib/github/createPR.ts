"use server";
import { Octokit } from "octokit";

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

export const createPull = async (name: string, journalTitle: string, file: File) => {
	console.log("Creating pull request...");
	try {
		// add file to branch then pr

		const result = await octokit.request(`POST /repos/${process.env.OWNER}/${process.env.REPO}/pulls`, {
			owner: process.env.OWNER,
			repo: process.env.REPO,
			title: `${name} requesting to add ${journalTitle} to journal`,
			head: "main",
			base: "main",
		});

		return result;
	} catch (error: any) {
		console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
		return { error: error.response.data.message };
	}
};
