import Link from "next/link";
import "./Header.css";
export default function Header() {
  return (
    <div className="header-layout">
      <Link href="/" className="logo">
        <img
          src="https://img.magnific.com/premium-vector/travel-logo-design_646665-1695.jpg?semt=ais_hybrid&w=740&q=80"
          alt="logo"
        />
      </Link>
      <div className="menu-list">
        <ul>
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>
            <Link href="/create">일정 짜기</Link>
          </li>
          <li>
            <Link href="/dashboard">일정 보기</Link>
          </li>
        </ul>
      </div>
      <button className="counsel">
        <p>상담신청</p>
      </button>
    </div>
  );
}
