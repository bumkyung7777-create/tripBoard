# QA 노트

## export default function vs export const 차이

**질문**: `Content.tsx`의 `export default function` 부분에서 `default`랑 `const`는 뭐가 다르고 언제 쓰는지?

**설명 (중학생도 이해할 수 있는 버전)**

택배 상자를 하나 보낸다고 생각해보자.

- `export default`는 상자 안에 물건이 **딱 하나**만 있는 것. 받는 사람이 상자를 열어서 "이건 내가 원하는 이름으로 부를래!" 하고 마음대로 이름을 붙여도 됨.
- `export const`는 상자 안에 물건이 **여러 개** 있고, 각각 **이름표(라벨)** 가 붙어 있는 것. 받는 사람은 그 이름표에 적힌 이름을 **그대로** 불러야 꺼낼 수 있음.

`export default function`과 `export const`는 둘 다 "이 파일 밖에서도 이 함수를 쓸 수 있게 내보낸다"는 점은 같지만, **내보내는 방식**과 **가져올 때(import) 방식**이 다르다.

### 1. `export default function`

```tsx
// Content.tsx
export default function Content() {}
```

- 이 파일에서 **딱 하나만** `default`로 내보낼 수 있음
- 가져올 때 이름을 **아무거나** 지어도 됨 (파일이 뭐라고 하든 상관없음)

```tsx
import Content from "./Content";      // 이름 그대로
import Anything from "./Content";     // 이름 막 바꿔도 에러 안 남
```

### 2. `export const`

```tsx
// Content.tsx
export const Content = () => {};
```

- 한 파일에서 **여러 개** 내보낼 수 있음 (`export const A`, `export const B` 등)
- 가져올 때 **정확히 같은 이름**으로, `{ }` 중괄호를 써서 가져와야 함

```tsx
import { Content } from "./Content";  // 이름 똑같아야 함, 중괄호 필수
```

**한 줄 요약**: 상자에 물건이 하나면 `default`(이름 자유), 여러 개면 `const`(이름표대로 정확히 불러야 함)

### 언제 쓰나?

| 상황 | 추천 |
|---|---|
| 이 파일이 컴포넌트 하나만 담당 (예: 지금 `Content.tsx`) | `export default` |
| 한 파일에서 여러 개 함수/컴포넌트를 내보내고 싶을 때 (유틸 함수 모음 등) | `export const` |

**참고**: Next.js의 `page.tsx`, `layout.tsx` 같은 특수 파일들은 반드시 `export default`를 써야 함 (Next.js 규칙). 지금 `Content.tsx`는 컴포넌트 하나만 있으니 `export default function`으로 되어 있는 게 맞음.

## props로 배열을 받을 때, 왜 그냥 타입만 적으면 안 될까

**질문**: `SummaryCard.tsx`에서 `<SummaryTestCard tripList={tripList} />`를 썼는데 빨간 줄(타입 에러)이 뜬다. 왜?

**설명 (중학생도 이해할 수 있는 버전)**

택배 상자 비유를 다시 써보자. 이번엔 상자 안에 "선물 목록"(배열)이 들어있다고 하자.

```tsx
// 부모 컴포넌트 (page.tsx) — 상자를 보내는 쪽
<SummaryTestCard tripList={tripList} />
```

JSX로 컴포넌트를 쓸 때, props는 **항상 이름표가 붙은 상자(객체)** 로 포장돼서 전달돼. `tripList`라는 이름표가 붙은 칸 안에 배열이 들어있는 식:

```js
{ tripList: [ {...}, {...}, {...} ] }   // 객체 (상자) 안에 배열이 들어있음
```

그런데 받는 쪽(`SummaryCard.tsx`)을 이렇게 써놨었다:

```tsx
// ❌ 문제가 있던 코드
export const SummaryTestCard = (tripList: Trip[]) => { ... }
```

이건 "상자를 열지도 않고, **상자 자체**를 `tripList`라고 부르면서 그게 곧 배열(선물 목록)이다"라고 우겨버린 것. 그래서:

| 실제로 오는 것 | 코드가 기대한 것 |
|---|---|
| `{ tripList: [...] }` (이름표 붙은 상자, 객체) | `[...]` (배열 그 자체) |

**상자 ≠ 그 안에 든 물건**이라서 타입이 안 맞는다고 에러가 난 것.

**고친 코드**: 상자를 열어서(구조분해) 안에 든 걸 꺼내야 함.

```tsx
// ✅ 고친 코드
export const SummaryTestCard = ({ tripList }: { tripList: Trip[] }) => {
  return (
    <ul>
      {tripList.map((trip) => (
        <li key={trip.id}>{trip.title}</li>
      ))}
    </ul>
  );
};
```

**한 줄 요약**: JSX에서 넘기는 props는 항상 `{ }` 객체로 포장되어 오기 때문에, 받는 쪽도 `{ 이름 }`으로 상자를 열어서 꺼내야 함. 상자째로 받으면(`(tripList: Trip[])`) 타입이 어긋남.

## useState\<Trip\>({...})은 뭘 하는 코드인가

**질문**: `TripScheduleForm.tsx`에서 `const [formData, setFormData] = useState<Trip>({...})`를 썼는데, 이게 "Trip 타입을 기본값으로 넣는 것"이 맞는지, 왜 이렇게 쓰는지?

**설명 (중학생도 이해할 수 있는 버전)**

주문서 양식을 하나 만든다고 생각해보자.

- `<Trip>` (꺾쇠괄호 안) = **"이 양식은 반드시 이 항목들만 채워야 해"** 라는 규칙(설계도)
- `({...})` (그 뒤 괄호) = **처음에 빈 칸으로 채워둘 초기값**

즉 "`Trip`이라는 규칙을 따르는 `formData`라는 상태를 만들고, 처음엔 이런 빈 값으로 시작한다"는 뜻.

**왜 굳이 `<Trip>`을 붙이나?**: 안 붙여도(`useState({...})`) 동작은 하지만, 붙여두면 나중에 `formData.제목`처럼 오타를 내거나, `Trip`에 없는 엉뚱한 속성을 넣으려고 할 때 TypeScript가 미리 잡아줌 (타입 안정성).

**실제로 발견된 문제**: 처음 버전엔 `Trip` 타입에 없는 `travelers`, `transport`, `notes` 속성을 초기값에 넣고 폼에서도 썼는데, `Trip` 타입엔 그 속성들이 없어서 에러가 났음. 이후 `Trip` 타입에 `travelers?: number`, `transport?: string`를 추가해서 해결.

**남은 문제**: `notes` 속성은 여전히 `Trip` 타입에 없는데 `ScheduleList.tsx`(`formData.notes`)에서 계속 쓰고 있어서 에러가 남. `travelers`/`transport`처럼 `notes?: string`도 `Trip` 타입에 추가해야 함.

**설계 관점에서 참고할 점**: `Trip` 타입은 원래 여행 카드(`SummaryCard`) 표시용 데이터 모양이었는데, 여기에 폼 전용 필드(`travelers`, `transport`, `notes`)를 계속 섞어 넣으면 카드 컴포넌트 쪽에서도 이 필드들이 (선택적으로) 보이게 되어 타입이 지저분해짐. 폼이 커지면 `TripFormData`처럼 별도 타입으로 분리하는 걸 고려할 것.

## handleChange 안의 prev와 [name] 문법

**질문**: `ScheduleList.tsx`의 `handleChange` 함수에서 `setFormData((prev) => ({ ...prev, [name]: name === "travelers" ? Number(value) : value }))` 부분이 이해가 안 감. `prev`가 "각각의 value 값"인 줄 알았는데?

**설명 (중학생도 이해할 수 있는 버전)**

**`prev`에 대한 오해 바로잡기**: `prev`는 "각각의 value 값"이 아니라, **바뀌기 직전의 `formData` 객체 전체**임 (`id`, `title`, `destination`, `budget` 등 다 들어있는 통째 객체). `setFormData((prev) => ...)`는 React의 "함수형 업데이트" 방식 — "직전 상태를 받아서, 그걸 바탕으로 새 상태를 계산해 돌려줘라"는 뜻.

**`[name]: 값`** — 계산된 속성 이름(computed property). 보통은 `{ travelers: 3 }`처럼 속성 이름을 직접 쓰지만, 어떤 입력칸이 바뀔지 미리 모르니까 변수(`name`, 즉 `e.target.name` = 바뀐 input의 `name` 속성값)를 대괄호로 감싸서 "그 변수의 값을 속성 이름으로 써라"라고 하는 것. `const name = "travelers"`일 때 `{ [name]: 3 }` → 결과는 `{ travelers: 3 }`.

**`name === "travelers" ? Number(value) : value`** — 삼항 연산자(if문 축약형). "바뀐 게 travelers면 문자열을 숫자로 변환(`Number(value)`), 아니면 그냥 문자열(`value`) 그대로 쓴다". `<input>`에서 나오는 값은 타입 상관없이 항상 문자열이라, 숫자여야 하는 필드는 이렇게 변환해줘야 함.

**전체 조합**:
```tsx
setFormData((prev) => ({
  ...prev,                                          // 기존 값 싹 다 복사
  [name]: name === "travelers" ? Number(value) : value,  // 바뀐 그 한 칸만 새 값으로 덮어씀
}));
```

**한 줄 요약**: "이전 폼 데이터를 통째로 복사하고, 방금 사용자가 건드린 입력 칸(`name`)만 새 값으로 바꿔치기한다. 단, `travelers`면 숫자로 변환해서 넣는다."

## React.ChangeEvent\<A | B | C\> 는 왜 여러 개를 나열하나

**질문**: `handleChange`의 매개변수 타입 `e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>`는 어떻게 이해하면 될까?

**설명 (중학생도 이해할 수 있는 버전)**

- `React.ChangeEvent<...>` = "값이 바뀌었을 때(change) 생기는 이벤트"의 타입
- `< >` 안 (제네릭) = "이 이벤트가 발생한 태그(`e.target`)가 정확히 어떤 HTML 요소냐"를 지정. 이게 있어야 `e.target.value`, `e.target.name`을 TypeScript가 알아보고 자동완성/타입체크 해줌

**왜 세 개를 `|`(또는)로 나열했나**: `handleChange` 함수 하나가 `<input>`, `<textarea>`, `<select>` **세 종류 태그에 다 재사용**되고 있기 때문. 타입을 `HTMLInputElement`만 써놨으면 `<textarea onChange={handleChange}>`에 쓰려 할 때 타입 에러가 났을 것. "이 셋 중 아무거나 올 수 있다"는 뜻으로 유니온 타입(`|`)으로 다 나열한 것.

**비유**: 택배 접수 창구가 하나인데 "편지봉투 or 소포박스 or 서류봉투" 중 아무거나 받을 수 있게 만들어둔 것. 어떤 게 오든 공통으로 처리 가능한 부분(`name`, `value` 읽기)은 하나의 함수로 처리.

**한 줄 요약**: `handleChange` 함수 하나를 input/textarea/select 세 태그 모두에서 재사용하려고, "이벤트가 이 셋 중 하나에서 왔을 수 있다"고 타입에 미리 다 적어둔 것.

## const { name, value } = e.target; 는 "넣는" 게 아니라 "꺼내는" 것

**질문**: `const { name, value } = e.target;`가 "타겟을 name이랑 value에 넣겠다"는 뜻이 맞는지?

**설명 (중학생도 이해할 수 있는 버전)**

방향이 반대임: "넣는다"가 아니라 **"타겟(target) 안에서 name이랑 value만 쏙 꺼낸다"**는 뜻(구조분해).

`e.target`은 이벤트가 발생한 그 태그 자체라서, `name`, `value` 말고도 `id`, `type` 등 훨씬 많은 속성을 가지고 있음:
```js
e.target = { name: "travelers", value: "3", id: "travelers", type: "number", ... }
```
`const { name, value } = e.target;`은 이 안에서 **`name`이랑 `value`, 딱 이 두 개만** 꺼내서 같은 이름의 변수로 만드는 것. (택배 상자 비유와 동일 — 상자(`e.target`) 안에서 원하는 물건만 이름표대로 꺼냄.)

**구조분해 안 쓰면**: `const name = e.target.name; const value = e.target.value;`처럼 두 줄로 길게 써야 함. 구조분해로 한 줄로 줄인 것.

**한 줄 요약**: `{ name, value } = e.target`은 e.target 안에 든 여러 속성 중 name과 value만 꺼내 오는 것이지, target을 name과 value 안에 집어넣는 게 아님.

## ⚠️ 아직 헷갈리는 파트 — TripStore 타입에서 Omit\<TripFormData, "id"\>를 왜 쓰는지

**질문**: `TripaStore.ts`의 `TripStore` 타입에서 `addTrip`/`updateTrip`/`deleteTrip`을 왜 이렇게 만들었는지?

```ts
type TripStore = {
  trips: TripFormData[];
  addTrip: (trip: Omit<TripFormData, "id">) => void;
  updateTrip: (id: string, trip: Omit<TripFormData, "id">) => void;
  deleteTrip: (id: string) => void;
};
```

**설명 (중학생도 이해할 수 있는 버전)**

> **핵심: 함수가 실제로 뭘 필요로 하는지에 맞춰서 매개변수를 설계한 것.**

### 1. `trips: TripFormData[]`
스토어가 들고 있을 데이터 그 자체. 여행 목록이니까 배열.

### 2. `addTrip: (trip: Omit<TripFormData, "id">) => void`

**`Omit<TripFormData, "id">`** = "`TripFormData`에서 `id`만 빼고 나머지 다"라는 뜻.

**왜 `id`를 뺐나?** 실제 구현을 보면:
```ts
addTrip: (trip) =>
  set((state) => ({
    trips: [...state.trips, { ...trip, id: crypto.randomUUID() }],
  })),
```
`id`는 스토어가 **직접 생성**함 (`crypto.randomUUID()`). 폼에서 `addTrip`을 호출하는 쪽은 아직 `id`가 없는 게 정상(새로 만드는 거니까)이라, 입력값 타입에서 `id`를 아예 빼버린 것.

**`=> void`** = 이 함수는 값을 돌려주지(return) 않고, 스토어 안의 상태만 바꾸고 끝난다는 뜻.

### 3. `updateTrip: (id: string, trip: Omit<TripFormData, "id">) => void`

매개변수가 두 개: **`id`**(어떤 항목을 바꿀지 찾는 열쇠) + **나머지 데이터**(`id` 뺀 새 값들).

**왜 `id`를 따로 분리했나?** 수정할 때는 "이미 존재하는 항목"을 찾아야 해서 `id`가 꼭 필요함. 그 `id`는 이미 정해진 값이라 새로 만들 필요 없이 "어떤 걸 바꿀지 가리키는 용도"로만 쓰임. 실제 구현:
```ts
trips.map((t) => (t.id === id ? { ...trip, id } : t))
```
→ "id가 일치하는 항목만" 새 데이터로 바꾸고, 마지막에 `id`를 다시 붙여서 원래 id가 유지되게 함.

### 4. `deleteTrip: (id: string) => void`
삭제는 "어떤 걸 지울지"만 알면 되니까 `id` 하나만 받음.

**한 줄 요약**: 새로 추가할 땐 아직 없는 `id`는 뺴고(`Omit`), 수정/삭제할 땐 "어떤 걸 다룰지" 찾는 용도로 `id`를 별도 매개변수로 명시적으로 받는다.

## useEffect의 의존성 배열([tripId, trips])은 왜 넣는가

**질문**: `ScheduleList.tsx`에서 `useEffect(() => {...}, [tripId, trips])`의 `[tripId, trips]` 부분은 왜 넣는 건지?

**설명 (중학생도 이해할 수 있는 버전)**

`useEffect`의 두 번째 인자(배열)는 **"이 값들 중 하나라도 바뀌면, 위 코드를 다시 실행해라"** 라는 조건표(의존성 배열).

| 배열 안 값 | 언제 실행되나 |
|---|---|
| 아예 안 씀 | 매번 렌더링될 때마다 실행 (낭비되거나 무한루프 위험) |
| `[]` (빈 배열) | 처음 딱 한 번만 실행 (그 이후 뭐가 바뀌어도 다시 안 함) |
| `[tripId, trips]` | `tripId`나 `trips` 둘 중 하나라도 바뀔 때마다 다시 실행 |

**규칙**: `useEffect` 코드 안에서 "컴포넌트 바깥(밖에서 만들어진) 값"을 썼으면, 그 값은 다 의존성 배열에 넣어야 함.

```tsx
useEffect(() => {
  const foundTrip = trips.find((t) => t.id === tripId);   // 여기서 trips랑 tripId를 씀
  ...
}, [tripId, trips]);
```

- **`tripId`**: 바뀐다는 건 "다른 여행을 수정하러 왔다"는 뜻. `tripId`가 바뀌었는데 다시 실행이 안 되면, 폼에 여전히 예전 데이터가 남아있게 됨.
- **`trips`**: 스토어의 목록 자체가 바뀔 수도 있어서. 안 넣으면 컴포넌트가 "처음 렌더링됐을 때의 오래된 `trips` 스냅샷"만 계속 들고 있게 되어, 최신 데이터가 있어도 못 찾는 문제("stale closure")가 생길 수 있음.

**실제로 안 넣으면 생기는 문제 예시**: `[]`(빈 배열)로만 썼다면, 컴포넌트가 처음 로딩될 때 `trips`가 아직 비어있었다면 `find()`는 항상 `undefined`를 돌려주고, 나중에 `trips`가 채워져도 다시 검사를 안 해서 폼은 계속 빈 채로 남음.

**한 줄 요약**: `useEffect` 안에서 쓰는 바깥 변수는 다 의존성 배열에 적어줘야, "그 값이 바뀔 때마다 최신 상태로 다시 계산"해준다. 안 그러면 오래된 값을 계속 참조하는 버그가 생김.

## ⚠️ 못 풀었던 부분 — 수정 모드 폼 채우기 (tripId로 기존 데이터 찾아서 프리필)

**상황**: `/create?q=아이디` 로 들어왔을 때, 그 아이디에 해당하는 기존 여행 데이터를 폼에 미리 채워 넣어야 하는데 처음엔 못 짜서 막혔던 부분.

**완성한 코드** (`ScheduleList.tsx`):
```tsx
useEffect(() => {
  const foundTrip = trips.find((t) => t.id === tripId);

  if (foundTrip) {
    setFormData(foundTrip);
  }
}, [tripId, trips]);
```

**동작 흐름 정리**:
1. `trips.find((t) => t.id === tripId)` — 전체 목록에서 지금 수정하려는 `tripId`랑 일치하는 항목 딱 하나만 찾음 ([[useEffect-deps]] 참고, `.find()`는 `.map()`/`.filter()`와 다르게 항목 하나만 돌려줌)
2. `if (foundTrip)` — 찾았을 때만(못 찾으면 `undefined`라 조건을 안 탐) 다음 줄 실행. `tripId`가 없는 "새로 만들기" 상황에서는 자연스럽게 이 블록을 건너뛰고 폼이 빈 채로 유지됨
3. `setFormData(foundTrip)` — 찾은 데이터를 그대로 폼 상태에 덮어써서 화면에 기존 값이 채워지게 함
4. 의존성 배열 `[tripId, tripId]`가 아니라 `[tripId, trips]`인 이유는 위 항목([[useEffect 의존성 배열]]) 참고 — 이 안에서 쓰는 바깥 변수(`tripId`, `trips`)는 다 넣어야 함

**한 줄 요약**: "URL의 id로 목록에서 딱 하나 찾아서(find), 찾아지면(if) 폼에 그대로 부어넣는다(setFormData)"는 3단계로 수정 모드 프리필이 완성됨.
