"use client";
import { useTripStore } from "@/store/TripaStore";
import { SummaryTestCard } from "@/components/summaryCard/SummaryCard";

export default function dashboard() {
  const trips = useTripStore((state) => state.trips);
  return (
    <div>
      <SummaryTestCard tripList={trips} />
    </div>
  );
}
