import axios, { type AxiosResponse } from "axios";
import { type Note, type CreateNoteData } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";

// Створюємо екземпляр axios з базовою конфігурацією
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Додаємо інтерсептор для автоматичного додавання токену
apiClient.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Інтерфейси для відповідей API
export interface FetchNotesResponse {
  data: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CreateNoteResponse {
  data: Note;
}

export interface DeleteNoteResponse {
  data: Note;
}

// Параметри для запиту нотаток
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

// Функція для отримання списку нотаток
export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });
  
  if (search && search.trim()) {
    queryParams.append("search", search.trim());
  }
  
  const response: AxiosResponse<FetchNotesResponse> = await apiClient.get(
    `/notes?${queryParams.toString()}`
  );
  
  return response.data;
};

// Функція для створення нової нотатки
export const createNote = async (
  noteData: CreateNoteData
): Promise<CreateNoteResponse> => {
  const response: AxiosResponse<CreateNoteResponse> = await apiClient.post(
    "/notes",
    noteData
  );
  
  return response.data;
};

// Функція для видалення нотатки
export const deleteNote = async (
  noteId: string
): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> = await apiClient.delete(
    `/notes/${noteId}`
  );
  
  return response.data;
};

