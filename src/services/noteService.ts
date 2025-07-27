import axios from 'axios';
import type { Note, CreateNoteData } from '../types/note';

export interface FetchNotesResponse {
  data: Note[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const apiClient = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const response = await apiClient.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await apiClient.post<{ data: Note }>('/notes', noteData);
  return response.data.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await apiClient.delete<{ data: Note }>(`/notes/${noteId}`);
  return response.data.data;
};