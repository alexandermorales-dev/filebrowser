'use server';

import { FileBrowserService } from '@/services/filebrowser';
import { ClientInfo } from '@/types/client';

export async function getClientInfo(clientName: string): Promise<ClientInfo | null> {
  try {
    const fileBrowser = new FileBrowserService();
    const clientInfo = await fileBrowser.getClientInfo(clientName);
    return clientInfo;
  } catch (error) {
    console.error('Error fetching client info:', error);
    return null;
  }
}

export async function validateClient(clientName: string): Promise<boolean> {
  try {
    const fileBrowser = new FileBrowserService();
    const exists = await fileBrowser.checkClientExists(clientName);
    return exists;
  } catch (error) {
    console.error('Error validating client:', error);
    return false;
  }
}

export async function validateClientPassword(clientName: string, password: string): Promise<boolean> {
  try {
    const fileBrowser = new FileBrowserService();
    return await fileBrowser.validateUser(clientName, password);
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
}

export async function createClientUser(clientName: string, password: string): Promise<boolean> {
  try {
    const fileBrowser = new FileBrowserService();
    return await fileBrowser.createUser(clientName, password);
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
}
