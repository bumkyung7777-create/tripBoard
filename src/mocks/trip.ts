export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  img?: string;
};

export type TripFormData = Trip & {
  travelers: number;
  transport: string;
  notes: string;
};
