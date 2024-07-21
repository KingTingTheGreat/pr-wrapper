import { NextRequest, NextResponse } from 'next/server';
import { createPull } from '@/lib/github/createPR';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function POST(req: NextRequest) {
  // read file from req
  //   const file = req.body?.file;
  const form = await req.formData();
  const articleFile = form.get('file') as File;
  const authorEmail = form.get('authorEmail') as string;
  const journalTitle = form.get('journalTitle') as string;
  if (!articleFile || !authorEmail || !journalTitle) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  // create PR
  const result = await createPull(authorEmail, journalTitle, articleFile);
  //   console.log(result);

  return NextResponse.json(result);
}
