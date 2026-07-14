"use client";
import Link from "next/link";
import { SummaryTestCard } from "@/components/summaryCard/SummaryCard";
import { tripList } from "@/mocks/testCard";
export default function Home() {
  const moveScroll = (src: string) => {
    document.getElementById(src)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">맞춤 여행 일정 설계 서비스</span>
          <h1>
            여행 계획,
            <br />
            <span className="accent">노선도처럼</span> 한눈에.
          </h1>
          <p className="lede">
            검색만 하다 끝나는 여행 준비는 그만. 동선·교통패스·예산까지 계산된
            맞춤 일정을 인터랙티브 경로 지도로 받아보세요.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => moveScroll("counsel")}
              className="btn btn-primary"
            >
              일정 짜기
            </button>
            <button
              onClick={() => moveScroll("sample")}
              className="btn btn-ghost"
            >
              샘플 보기
            </button>
          </div>

          <div
            className="hero-route"
            role="img"
            aria-label="오사카에서 출발해 히메지, 고베를 거쳐 교토, 나라로 이어지는 샘플 경로"
          >
            <span className="hero-route-label">
              Sample Route · 간사이 5박 6일
            </span>
            <div className="route-track">
              <div className="stop">
                <span className="stop-dot"></span>
                <span className="stop-name">오사카</span>
                <span className="stop-time mono">DAY 1-2</span>
              </div>
              <span className="leg"></span>
              <div className="stop">
                <span className="stop-dot transfer"></span>
                <span className="stop-name">히메지</span>
                <span className="stop-time mono">DAY 3</span>
              </div>
              <span className="leg dashed"></span>
              <div className="stop">
                <span className="stop-dot transfer"></span>
                <span className="stop-name">고베</span>
                <span className="stop-time mono">DAY 3</span>
              </div>
              <span className="leg"></span>
              <div className="stop">
                <span className="stop-dot"></span>
                <span className="stop-name">교토</span>
                <span className="stop-time mono">DAY 4</span>
              </div>
              <span className="leg"></span>
              <div className="stop">
                <span className="stop-dot"></span>
                <span className="stop-name">나라</span>
                <span className="stop-time mono">DAY 5</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero" id="sample">
        <div className="wrap">
          <span className="eyebrow">맞춤 여행 일정 설계 서비스</span>
          <h1>
            <span className="accent">샘플 카드</span> 한눈에.
          </h1>
          <p className="lede">간편한 여행을 위한 샘플 카드</p>
        </div>
        <SummaryTestCard tripList={tripList} />
      </section>
    </div>
  );
}
