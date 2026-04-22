// Usage: node set-password.js <client-name> <password>
// This script creates a user in FileBrowser with the given credentials

const FILEBROWSER_URL = process.env.NEXT_PUBLIC_FILEBROWSER_URL || 'https://files.yourvps.com';
const ADMIN_USERNAME = process.env.FILEBROWSER_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.FILEBROWSER_ADMIN_PASSWORD || 'your_password';

// Get command line arguments
const clientName = process.argv[2];
const password = process.argv[3];

if (!clientName || !password) {
  console.log('Usage: node set-password.js <client-name> <password>');
  console.log('Example: node set-password.js lefer mypassword123');
  process.exit(1);
}

async function createFileBrowserUser(username, userPassword) {
  try {
    // First, authenticate as admin
    const authResponse = await fetch(`${FILEBROWSER_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      throw new Error('Admin authentication failed');
    }

    const token = await authResponse.text();

    // Create the user
    const createResponse = await fetch(`${FILEBROWSER_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth': token,
      },
      body: JSON.stringify({
        username,
        password: userPassword,
        scope: '',
        rules: [],
      }),
    });

    if (createResponse.ok) {
      console.log(`✓ User created successfully: ${username}`);
    } else {
      const error = await createResponse.text();
      console.error(`✗ Failed to create user: ${error}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createFileBrowserUser(clientName, password);
