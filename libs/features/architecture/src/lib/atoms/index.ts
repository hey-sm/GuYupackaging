import { atom } from 'jotai';
import { Resource } from '../types';

export const resourcesAtom = atom<Resource[]>([]);
