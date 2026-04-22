import { ClientInfo, FileBrowserShare } from '@/types/client';

const FILEBROWSER_URL = process.env.NEXT_PUBLIC_FILEBROWSER_URL || '';
const ADMIN_USERNAME = process.env.FILEBROWSER_ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.FILEBROWSER_ADMIN_PASSWORD || '';

export class FileBrowserService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = FILEBROWSER_URL;
  }

  private async authenticate(): Promise<void> {
    // Always authenticate to get a fresh token
    try {
      const response = await fetch(`${this.baseUrl}/api/login`, {
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
        this.token = data;
      } catch {
        // Response is not JSON, use it directly as token
        this.token = text;
      }
    } catch (error) {
      console.error('FileBrowser authentication error:', error);
      throw error;
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    if (!this.token) {
      await this.authenticate();
    }
    return {
      'Content-Type': 'application/json',
      'X-Auth': this.token || '',
    };
  }

  async getClientFiles(clientName: string): Promise<any[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(
        `${this.baseUrl}/api/resources/clientes/${clientName}`,
        { headers }
      );

      if (!response.ok) {
        console.error('Failed to fetch client files');
        return [];
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching client files:', error);
      return [];
    }
  }

  getFileDownloadUrl(path: string): string {
    return `${this.baseUrl}/api/resources${path}?X-Auth=${this.token}`;
  }

  async checkClientExists(clientName: string): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      const url = `${this.baseUrl}/api/resources/clientes`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        return false;
      }

      const resources = await response.json();
      const items = resources.items || [];

      if (!Array.isArray(items)) {
        return false;
      }

      const exists = items.some(
        (resource: any) => resource.name === clientName && resource.isDir === true
      );
      return exists;
    } catch (error) {
      console.error('Error checking client existence:', error);
      return false;
    }
  }

  async getClientInfo(clientName: string): Promise<ClientInfo | null> {
    const exists = await this.checkClientExists(clientName);

    if (!exists) {
      return null;
    }

    const files = await this.getClientFiles(clientName);

    return {
      name: clientName.charAt(0).toUpperCase() + clientName.slice(1),
      slug: clientName,
      shareUrl: undefined,
      files: files,
    };
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    }
  }

  async createUser(username: string, password: string): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/api/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          username,
          password,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }
}
