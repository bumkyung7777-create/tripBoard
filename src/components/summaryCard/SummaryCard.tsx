import "./SummaryCard.css";
import { Trip } from "@/mocks/trip";
import Link from "next/link";

export const SummaryTestCard = ({ tripList }: { tripList: Trip[] }) => {
  return (
    <div className="card-wrap">
      <ul className="card-box">
        {tripList.map((item, index) => (
          <li key={index}>
            <Link href={"/create?q=" + item.id}>
              <div
                className="img"
                style={{ backgroundImage: `url(${item.img})` }}
              ></div>
              <strong>{item.title}</strong>
              <p className="destination-content">{item.destination}</p>
              <div className="data-table">
                <p>
                  도착일 : <span>{item.startDate}</span>
                </p>
                <p>
                  출발일 : <span>{item.endDate}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
