import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // ... your contact form submission logic ...
  return NextResponse.json({ message: 'Success!' });
}