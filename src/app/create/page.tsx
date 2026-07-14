import ScheduleList from "@/components/ScheduleList";
export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div className="create-box">
      <ScheduleList tripId={searchParams.q} />
    </div>
  );
}
