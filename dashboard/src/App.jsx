import { useState, useEffect } from "react";
import "./App.css";

function StatusCard({ site }) {
  const isUp = site.status === "up";

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`status-card ${isUp ? "up" : "down"}`}
    >
      <div className="card-header">
        <h2 className="site-name">{site.name}</h2>
        <span className={`status-label ${isUp ? "online" : "offline"}`}>
          <span className={`status-dot ${isUp ? "online" : "offline"}`}></span>
          {isUp ? "Online" : "Down"}
        </span>
      </div>

      <p className="site-meta">Platform: {site.platform}</p>
      <p className="site-meta">
        Response time: {site.responseTime ? `${site.responseTime}ms` : "N/A"}
      </p>
      {site.error && <p className="error-text">Error: {site.error}</p>}
      <p className="time-checked">Last checked: {new Date(site.checkedAt).toLocaleString()}</p>
    </a>
  );
}

export default function App() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "status.json")
      .then((res) => res.json())
      .then((data) => {
        // TODO: Remove test failure sites after testing is complete
        // data.push({
        //   name: "Test Failure Site",
        //   platform: "Shopify",
        //   status: "down",
        //   responseTime: null,
        //   error: "Timeout after 10 seconds",
        //   checkedAt: new Date().toISOString(),
        // });

        // data.push({
        //   name: "Test Failure Site 2",
        //   platform: "WordPress",
        //   status: "down",
        //   responseTime: null,
        //   error: "Timeout after 5 seconds",
        //   checkedAt: new Date().toISOString(),
        // });
        ////////////////////////////////////////

        setSites(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const downCount = sites.filter((s) => s.status === "down").length;

  return (
    <div className={"container"}>
      <h1>Website Status Dashboard</h1>

      {!loading && !error && (
        <p className={`summary-text ${downCount > 0 ? "summary-down" : "summary-up"}`}>
          {downCount > 0
            ? `${downCount} site${downCount > 1 ? "s are" : " is"} down`
            : "All sites are online"}
        </p>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Failed to load status: {error}</p>}

      <div className={"status-grid"}>
        {[...sites]
          .sort((a, b) => {
            if (a.status === "down" && b.status !== "down") return -1;
            if (a.status !== "down" && b.status === "down") return 1;
            return 0;
          })
          .map((site) => (
            <StatusCard key={site.url} site={site} />
          ))}
      </div>

      <footer className={"footer-link"}>
        <p>
          Check{" "}
          <a href="https://www.downdetector.com/" target="_blank" rel="noopener noreferrer">
            DownDetector
          </a>{" "}
          for reported outages.
        </p>
      </footer>
    </div>
  );
}
