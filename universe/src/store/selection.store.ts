"use client";

import { create } from "zustand";

interface SelectionState {
  selectedColorId: number | null;
  selectedColorName: string | null;
  selectedCityName: string | null;
  selectedNodeId: string | null;
  setSelectedColor: (payload: {
    id: number | null;
    name: string | null;
  }) => void;
  setSelectedCityName: (name: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedColorId: null,
  selectedColorName: null,
  selectedCityName: null,
  selectedNodeId: null,
  setSelectedColor: ({ id, name }) =>
    set({
      selectedColorId: id,
      selectedColorName: name,
      selectedNodeId: name,
    }),
  setSelectedCityName: (name) => set({ selectedCityName: name }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  clearSelection: () =>
    set({
      selectedColorId: null,
      selectedColorName: null,
      selectedCityName: null,
      selectedNodeId: null,
    }),
}));
