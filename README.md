# TripBoard - 맞춤 여행 일정 설계 서비스

여행 일정을 만들고, 카드 형태로 한눈에 모아보고, 수정·삭제까지 할 수 있는 여행 일정 관리 웹 서비스입니다.
"여행 계획, 노선도처럼 한눈에." 라는 컨셉으로 메인 화면을 지하철 노선도 느낌으로 디자인했습니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **상태 관리**: Zustand
- **Styling**: Tailwind CSS + 컴포넌트별 CSS 파일
- **Font**: Pretendard, Geist (next/font/local)

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 폴더 구조

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 루트 레이아웃 (Header 포함)
│   ├── page.tsx                # 메인 페이지 (히어로 + 샘플 카드)
│   ├── globals.css             # 리셋 CSS, 컬러 변수, 공통 스타일
│   ├── layout.css
│   ├── create/
│   │   └── page.tsx            # 일정 등록 / 수정 페이지
│   └── dashboard/
│       └── page.tsx            # 내 일정 목록 페이지
├── components/                 # 공통 컴포넌트
│   ├── ScheduleList.tsx        # 여행 일정 입력 폼 (등록/수정/삭제)
│   ├── heade/
│   │   ├── Header.tsx          # 헤더 (로고, 메뉴, 상담신청 버튼)
│   │   └── Header.css
│   └── summaryCard/
│       ├── SummaryCard.tsx     # 여행 요약 카드 리스트
│       └── SummaryCard.css
├── mocks/                      # 타입 및 Mock 데이터
│   ├── trip.ts                 # Trip, TripFormData 타입 정의
│   └── testCard.ts             # 메인 샘플 카드용 Mock 데이터 (3개)
└── store/
    └── TripaStore.ts           # Zustand 여행 일정 스토어
```

---

## 0. 메인 페이지 (홈)

**경로**: `/src/app/page.tsx`  **접속 URL**: `/`

### 섹션 1: Hero Section

**내용**
- 상단 라벨: "맞춤 여행 일정 설계 서비스"
- 메인 카피: "여행 계획, **노선도처럼** 한눈에."
- 서브 카피: "검색만 하다 끝나는 여행 준비는 그만. 동선·교통패스·예산까지 계산된 맞춤 일정을 인터랙티브 경로 지도로 받아보세요."
- 버튼 2개
  - **일정 짜기** (Primary 버튼)
  - **샘플 보기** (Ghost 버튼) → 클릭 시 샘플 카드 섹션으로 부드럽게 스크롤
- 샘플 경로 노선도 (Sample Route · 간사이 5박 6일)
  - 오사카(DAY 1-2) → 히메지(DAY 3) → 고베(DAY 3) → 교토(DAY 4) → 나라(DAY 5)
  - 일반 정류장은 파란색 점, 환승(경유) 정류장은 주황색 점
  - 구간 라인: 실선 / 점선(dashed)으로 이동 구간 구분

**구현**
- `scrollIntoView({ behavior: "smooth" })` 로 섹션 이동 함수(`moveScroll`) 구현
- 노선도는 이미지가 아닌 HTML/CSS로 직접 구현 (`stop`, `stop-dot`, `leg` 클래스)
- 접근성을 위해 노선도 영역에 `role="img"`, `aria-label` 적용

### 섹션 2: Sample Card Section

**내용**
- 타이틀: "**샘플 카드** 한눈에."
- 서브 카피: "간편한 여행을 위한 샘플 카드"
- `SummaryTestCard` 컴포넌트로 Mock 데이터 3개 출력
  - 강원도 태백 여행 / 오징어 울릉도 여행 / 경기도 수원 투어여행

**데이터**
- `src/mocks/testCard.ts` 의 `tripList` Mock 데이터 사용

---

## 1. Header

**경로**: `/src/components/heade/Header.tsx`

**기능**
- 로고 (클릭 시 홈으로 이동)
- 메뉴: 홈 / 일정 짜기 / 일정 보기 (`next/link` 사용)
- 상담신청 버튼

**스타일**
- 최대 너비 1440px, 가운데 정렬
- Flex 레이아웃 (`justify-content: space-around`)
- 로고 너비 200px
- 상담신청 버튼: 검은색 배경, 흰색 텍스트, 14px Bold, 둥근 pill 형태 (`border-radius: 999px`)

---

## 2. 일정 등록 / 수정 페이지

**경로**: `/src/app/create/page.tsx`  **접속 URL**: `/create`, `/create?q={id}`

**기능**
- 쿼리스트링 `q` 값으로 **등록 모드 / 수정 모드** 구분
  - `q` 없음 → 새 일정 등록
  - `q={id}` 있음 → 스토어에서 해당 일정을 찾아 폼에 채워서 보여줌
- 입력 항목
  - 여행 이름 (text)
  - 여행 이미지 (file, `image/*`)
  - 목적지 (text)
  - 인원 수 (number, 최소 1)
  - 출발일 / 도착일 (date)
  - 예산 (text)
  - 이동 수단 (select: 비행기, 기차, 버스, 자동차)
  - 요청사항 / 메모 (textarea)
- 버튼
  - 등록 모드: **일정 저장**
  - 수정 모드: **일정 삭제** (빨간색) + **일정 수정**
- 저장 / 수정 / 삭제 후 `/dashboard` 로 이동 (`useRouter`)

**구현**
- 폼 컴포넌트: `src/components/ScheduleList.tsx`
- 하나의 `handleChange` 함수로 모든 input / textarea / select 처리 (`name` 속성 활용)
  - `travelers` 는 `Number()` 로 숫자 변환
- 이미지 업로드는 `URL.createObjectURL()` 로 미리보기용 URL 생성
- `useEffect` 로 `tripId` 가 바뀌면 해당 일정 데이터를 폼에 세팅

**반응형**
- 데스크톱(md 이상): 2열 그리드 (여행 이름, 이미지, 메모는 2칸 차지)
- 모바일: 1열 세로 배치
- 버튼 영역: 모바일 세로 / sm 이상 우측 정렬

**스타일**
- Tailwind CSS 사용
- 카드: 흰색 배경, `rounded-3xl`, 연한 테두리, 그림자
- input: `rounded-2xl`, 포커스 시 sky 색상 테두리 + ring 효과
- 메인 버튼: `bg-sky-600`, 호버 시 `bg-sky-700`

---

## 3. 일정 보기 페이지 (대시보드)

**경로**: `/src/app/dashboard/page.tsx`  **접속 URL**: `/dashboard`

**기능**
- Zustand 스토어에 저장된 내 여행 일정을 카드 리스트로 출력
- 일정이 없으면 "일정이 없습니다." 문구 표시
- 카드 클릭 시 `/create?q={id}` 로 이동해서 수정 / 삭제 가능

---

## 4. 여행 요약 카드 (SummaryCard)

**경로**: `/src/components/summaryCard/SummaryCard.tsx`

**기능**
- `tripList` 배열을 props로 받아 카드 목록 렌더링
- 메인 페이지(샘플)와 대시보드(내 일정)에서 **같은 컴포넌트 재사용**
- 각 카드: 이미지, 여행 이름, 설명(목적지), 출발일 / 도착일
- 카드 클릭 시 해당 일정 수정 페이지로 이동

**스타일**
- 최대 너비 1440px, 한 줄에 3개 (width 33.3%, gap 20px)
- 카드 테두리: 4px 파란색 라인 (`--line-blue`), `border-radius: 18px`
- 이미지: 높이 300px, `background-size: cover`
- 여행 이름: 24px Bold, 주황색 형광펜 밑줄 효과 (`linear-gradient`)
- 설명: 20px, 2줄 말줄임 (`-webkit-line-clamp: 2`)

---

## 5. 상태 관리 (Zustand)

**경로**: `/src/store/TripaStore.ts`

| 함수 | 설명 |
|---|---|
| `trips` | 여행 일정 배열 |
| `addTrip(trip)` | 새 일정 추가 (`crypto.randomUUID()` 로 id 생성) |
| `updateTrip(id, trip)` | id가 같은 일정 수정 |
| `deleteTrip(id)` | id가 같은 일정 삭제 |

- 페이지 간(등록 → 대시보드) 데이터를 공유하기 위해 전역 상태로 관리
- 컴포넌트에서는 `useTripStore((state) => state.addTrip)` 처럼 필요한 값만 선택해서 사용

## 6. 타입 정의

**경로**: `/src/mocks/trip.ts`

```ts
type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  img?: string;
};

type TripFormData = Trip & {
  travelers: number;
  transport: string;
  notes: string;
};
```

- 카드에 필요한 기본 정보는 `Trip`, 폼 전용 정보는 `TripFormData` 로 확장해서 분리

---

## 공통 디자인

**컬러 변수** (`globals.css`)

| 변수 | 색상 | 용도 |
|---|---|---|
| `--ink` | `#101a33` | 기본 텍스트 |
| `--ink-soft` | `#5a6478` | 보조 텍스트 |
| `--line-blue` | `#2457e6` | 일정 설계 라인 / 포인트 컬러 |
| `--line-green` | `#0e9b6c` | 패스 분석 라인 |
| `--line-orange` | `#f2790f` | 경로 지도 라인 / 환승역 |
| `--hairline` | `#e3e6ee` | 구분선 |

- `html { font-size: 10px }` 로 설정해서 `rem` 계산을 쉽게 함 (1.6rem = 16px)
- 노선도 컨셉에 맞춰 파랑 / 초록 / 주황 3가지 라인 컬러 사용

## 앞으로 할 것

- [ ] Zustand `persist` 적용 (새로고침해도 일정 유지)
- [ ] 히어로 "일정 짜기" 버튼, 헤더 "상담신청" 버튼 기능 연결
- [ ] 모바일 반응형 (카드 리스트, 헤더 햄버거 메뉴)
- [ ] 폼 유효성 검사 (필수값, 출발일 < 도착일)
- [ ] 실제 경로 지도 / 교통패스 / 예산 계산 기능
