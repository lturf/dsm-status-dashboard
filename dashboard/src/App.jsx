import { useState, useEffect } from 'react';

function StatusCard({ site }) {
  const isUp = site.status === 'up';

  return (
    <div style={{
      border: `2px solid ${isUp ? '#22c55e' : '#ef4444'}`,
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: isUp ? '#f0fdf4' : '#fef2f2',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>{site.name}</h2>
        <span style={{
          fontWeight: 'bold',
          color: isUp ? '#16a34a' : '#dc2626',
          fontSize: '16px',
        }}>
          {isUp ? '✅ Online' : '❌ Down'}
        </span>
      </div>

      <p style={{ margin: '8px 0 0', color: '#555', fontSize: '14px' }}>
        Platform: {site.platform}
      </p>
      <p style={{ margin: '4px 0 0', color: '#555', fontSize: '14px' }}>
        Response time: {site.responseTime ? `${site.responseTime}ms` : 'N/A'}
      </p>
      {site.error && (
        <p style={{ margin: '4px 0 0', color: '#dc2626', fontSize: '14px' }}>
          Error: {site.error}
        </p>
      )}
      <p style={{ margin: '4px 0 0', color: '#888', fontSize: '12px' }}>
        Last checked: {new Date(site.checkedAt).toLocaleString()}
      </p>
    </div>
  );
}

export default function App() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'status.json')
      .then(res => res.json())
      .then(data => {
        setSites(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const downCount = sites.filter(s => s.status === 'down').length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '4px' }}>Website Status Dashboard</h1>

      {!loading && !error && (
        <p style={{ color: downCount > 0 ? '#dc2626' : '#16a34a', marginBottom: '24px' }}>
          {downCount > 0
            ? `⚠️ ${downCount} site${downCount > 1 ? 's are' : ' is'} down`
            : '✅ All sites are online'}
        </p>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Failed to load status: {error}</p>}

      <div style={{ display: 'grid', gap: '16px' }}>
        {sites.map(site => (
          <StatusCard key={site.url} site={site} />
        ))}
      </div>
    </div>
  );
}