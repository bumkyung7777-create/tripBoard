"use client";
import { Trip, TripFormData } from "@/mocks/trip";
import { useState, useEffect } from "react";
import { useTripStore } from "@/store/TripaStore";
import { useRouter } from "next/navigation";

export default function TripScheduleForm({ tripId }: { tripId?: string }) {
  const router = useRouter();
  const addTrip = useTripStore((state) => state.addTrip);
  const updateTrip = useTripStore((state) => state.updateTrip);
  const deleteTrip = useTripStore((state) => state.deleteTrip);
  const trips = useTripStore((state) => state.trips);

  useEffect(() => {
    const foundTrip = trips.find((t) => t.id === tripId);

    if (foundTrip) {
      setFormData(foundTrip);
    }
  }, [tripId, trips]);

  const [formData, setFormData] = useState<TripFormData>({
    id: "",
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: 0,
    travelers: 1,
    transport: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "travelers" ? Number(value) : value,
    }));
  };

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, img: imageUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tripId) {
      updateTrip(tripId, formData);
    } else {
      addTrip(formData);
    }

    router.push("/dashboard");
  };

  const deleteTripBox = () => {
    if (tripId) {
      deleteTrip(tripId);
    }
    router.push("/dashboard");
  };

  return (
    <section className="mx-auto w-full  rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-sky-600">Travel Planner</p>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 ">
          여행 일정 폼
        </h2>
        <p className="mt-2 text-2lg text-slate-500 ">
          여행 기본 정보를 입력하고 일정을 정리해보세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              여행 이름
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 제주도 2박 3일"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="img"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              여행 이미지
            </label>
            <input
              id="img"
              name="img"
              type="file"
              accept="image/*"
              onChange={fileChange}
              className="w-full rounded-2xl   bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="destination"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              목적지
            </label>
            <input
              id="destination"
              name="destination"
              type="text"
              value={formData.destination}
              onChange={handleChange}
              placeholder="예: 도쿄"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="travelers"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              인원 수
            </label>
            <input
              id="travelers"
              name="travelers"
              type="number"
              min={1}
              value={formData.travelers}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              출발일
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              도착일
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="budget"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              예산
            </label>
            <input
              id="budget"
              name="budget"
              type="text"
              value={formData.budget}
              onChange={handleChange}
              placeholder="예: 100만원"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="transport"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              이동 수단
            </label>
            <select
              id="transport"
              name="transport"
              value={formData.transport}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="plane">비행기</option>
              <option value="train">기차</option>
              <option value="bus">버스</option>
              <option value="car">자동차</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="mb-2 block text-2lg font-semibold text-slate-700"
            >
              요청사항 / 메모
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              value={formData.notes}
              onChange={handleChange}
              placeholder="숙소, 방문 장소, 준비물 등을 적어보세요."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
          {tripId ? (
            <div className="flex gap-5">
              <button
                onClick={deleteTripBox}
                type="button"
                className="rounded-2xl border bg-red-500 border-slate-300 px-5 py-3 text-3lg font-semibold text-white transition hover:bg-slate-50"
              >
                일정 삭제
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-sky-600 px-5 py-3 text-3lg font-semibold text-white transition hover:bg-sky-700"
              >
                일정 수정
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="rounded-2xl bg-sky-600 px-5 py-3 text-3lg font-semibold text-white transition hover:bg-sky-700"
            >
              일정 저장
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
