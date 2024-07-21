"use client";
import { approvePR } from "@/lib/github/approvePR";
import { viewAllPulls } from "@/lib/github/viewAllPulls";
import { useState, useEffect } from "react";

export default function Home() {
	const [pulls, setPulls] = useState<{ number: number; title: string }[]>([]);

	const submit = async () => {
		console.log("Submitting...");
		const res = await viewAllPulls();
		console.log(res);
	};

	const approve = async (pull_number: number) => {
		console.log(`Calling approvePR(${pull_number})...`);
		const res = await approvePR(pull_number);
		console.log(res);
	};

	useEffect(() => {
		const loadPulls = async () => {
			const pulls = await viewAllPulls();
			setPulls(pulls.reverse());
		};
		loadPulls();
	}, []);

	return (
		<div>
			<h1>Home</h1>
			<p>Welcome to the home page!</p>
			<button onClick={() => submit()}>Submit</button>
			<div>
				<h2>Pulls</h2>
				<ul>
					{pulls.map((pull) => (
						<li key={pull.number}>
							{pull.number}: {pull.title}
							<button onClick={() => approve(pull.number)}>Approve</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
