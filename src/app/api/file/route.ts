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
  // FileBrowser may return token as plain string or as JSON
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
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const FB_URL = process.env.NEXT_PUBLIC_FILEBROWSER_URL;

    // Get fresh token for each request
    const TOKEN = await getAuthToken();

    // Use X-Auth header for authentication
    const downloadUrl = `${FB_URL}/api/raw${encodeURI(filePath)}`;

    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'X-Auth': TOKEN,
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ error: 'Authentication Failed' }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: `FileBrowser Error: ${response.status}` }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Check if it's HTML (error page)
    if (contentType.includes('text/html')) {
      return NextResponse.json({ error: 'Received HTML instead of file' }, { status: 500 });
    }

    const fileName = filePath.split('/').pop() || 'file';

    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600'
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
