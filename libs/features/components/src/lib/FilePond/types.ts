import { BatchItem } from '@rpldy/uploady';

export interface FileItem extends Partial<BatchItem> {
  id: string;
  name?: string;
  error?: string;
  fetchStatus?: 'idle' | 'fetching' | 'paused' | 'fetched';
}
