"use client";
import { useTripStore } from "@/store/TripaStore";
import { SummaryTestCard } from "@/components/summaryCard/SummaryCard";

export default function dashboard() {
  const trips = useTripStore((state) => state.trips);
  console.log(trips.length);
  return (
    <div>
      {trips.length > 0 ? (
        <SummaryTestCard tripList={trips} />
      ) : (
        <p className="no-trip">일정이 없습니다.</p>
      )}
    </div>
  );
}
