'use client';
import { approvePR } from '@/lib/github/approvePR';
import { viewAllPulls } from '@/lib/github/viewAllPulls';
import { useState, useEffect } from 'react';
import { AllJournals } from '@/types';
import { getAllJournals } from '@/lib/journals/getJournals';
import { createPull } from '@/lib/github/createPR';
const yaml = require('js-yaml');

export default function Home() {
  const [pulls, setPulls] = useState<{ number: number; title: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [journals, setJournals] = useState<AllJournals>({});

  const approve = async (pull_number: number) => {
    console.log(`Calling approvePR(${pull_number})...`);
    const res = await approvePR(pull_number);
    console.log(res);
  };

  const submit = async (event: Event) => {
    event.preventDefault();
    console.log('Submitting...');
    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('authorEmail', 'jting@bu.edu');
    formData.append('journalTitle', file.name);
    fetch('/submit', {
      method: 'POST',
      body: formData,
    }).then((res) => console.log(res));
  };

  useEffect(() => {
    const loadPulls = async () => {
      setPulls(await viewAllPulls());
    };
    const loadJournals = async () => {
      setJournals(await getAllJournals());
    };
    loadPulls();
    loadJournals();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <div>
        <h2>Upload a file</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button onClick={(e: any) => submit(e)}>Log file</button>
      </div>
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
      <div>
        <h2>Journals</h2>
        <ul>
          {Object.entries(journals).map(([semester, journalTitles]) => (
            <li key={semester}>
              <h3>{semester}</h3>
              <ul>
                {journalTitles.map((journalTitle) => (
                  <li key={journalTitle}>
                    {journalTitle}
                    <br />
                    <object
                      data={`/journals/${semester}/${journalTitle}`}
                      type="application/pdf"
                      width="800px"
                      height="600px"
                    >
                      <p>
                        Alternative text - include a link{' '}
                        <a href={`/journals/${semester}/${journalTitle}`}>
                          to the PDF!
                        </a>
                      </p>
                    </object>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
