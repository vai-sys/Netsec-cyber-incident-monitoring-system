import LeftCards from "../Components/LeftCard";

function Sectors() {
  return (
    <div className="dashboard-container">
      <div className="left-section">
        <LeftCards apiBase="http://localhost:5000/api" />
      </div>

      <div className="center-section">
        {/* Charts */}
      </div>

      <div className="right-section">
        {/* Pie charts */}
      </div>
    </div>
  );
}

export default Sectors;
