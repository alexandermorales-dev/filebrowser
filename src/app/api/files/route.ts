import { NextRequest, NextResponse } from 'next/server';

async function getAuthToken(): Promise<string> {
  const FB_URL = process.env.NEXT_PUBLIC_FILEBROWSER_URL;
  const ADMIN_USERNAME = process.env.FILEBROWSER_ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.FILEBROWSER_ADMIN_PASSWORD;

  const response = await fetch(`${FB_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data;
  } catch {
    return text;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientName = searchParams.get('clientName');
    const path = searchParams.get('path') || '';

    if (!clientName) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
    }

    const FB_URL = process.env.NEXT_PUBLIC_FILEBROWSER_URL;
    const TOKEN = await getAuthToken();

    const fullPath = path ? `${FB_URL}/api/resources/clientes/${clientName}${path}` : `${FB_URL}/api/resources/clientes/${clientName}`;
    
    const response = await fetch(fullPath, {
      method: 'GET',
      headers: {
        'X-Auth': TOKEN,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `FileBrowser Error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
