"use server";
import { Octokit } from "octokit";

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

export const viewAllPulls = async () => {
	console.log("Viewing all pulls...");
	try {
		const result = await octokit.request(`GET /repos/${process.env.OWNER}/${process.env.REPO}/pulls`);

		console.log(result.data[0]);
		return result.data;
	} catch (error: any) {
		console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
		return { error: error.response.data.message };
	}
};
