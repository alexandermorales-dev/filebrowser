export interface ClientInfo {
  name: string;
  slug: string;
  shareUrl?: string;
  logoUrl?: string;
  description?: string;
  files?: any[];
}

export interface FileBrowserShare {
  url: string;
  expires?: string;
}

export interface FileBrowserUser {
  id: string;
  username: string;
  scope: string;
}
