import { create } from "zustand";
import { TripFormData } from "@/mocks/trip";

type TripStore = {
  trips: TripFormData[];
  addTrip: (trip: Omit<TripFormData, "id">) => void;
  updateTrip: (id: string, trip: Omit<TripFormData, "id">) => void;
  deleteTrip: (id: string) => void;
};

export const useTripStore = create<TripStore>((set) => {
  return {
    trips: [],
    addTrip: (trip) =>
      set((state) => ({
        trips: [...state.trips, { ...trip, id: crypto.randomUUID() }],
      })),
    updateTrip: (id, trip) =>
      set((state) => ({
        trips: state.trips.map((t) => (t.id === id ? { ...trip, id } : t)),
      })),
    deleteTrip: (id) =>
      set((state) => ({
        trips: state.trips.filter((t) => t.id !== id),
      })),
  };
});
