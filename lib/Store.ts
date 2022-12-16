import create from "zustand";
import { GistResults } from "../types";

interface AppState {
  gistResults?: GistResults;
  addToGistResults: (results: Partial<GistResults>) => void;
}

export const useAppStore = create<AppState>()(
  /*persist*/ (set) => ({
    gistResults: undefined,
    addToGistResults: (results) =>
      set((state) => {
        const next = {
          gistResults: {
            ...state.gistResults,
            ...results,
            csvFiles: {
              ...state.gistResults?.csvFiles,
              ...results.csvFiles,
            },
          },
        };
        console.log("next", next);
        return next;
      }),
  })
);
