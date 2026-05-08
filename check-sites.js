import fs from 'fs';

const sites = JSON.parse(fs.readFileSync('sites.json', 'utf-8'));

async function checkSite(site) {
  const start = Date.now();

  try {
    const res = await fetch(site.url, { signal: AbortSignal.timeout(10000) });
    const responseTime = Date.now() - start;

    return {
      name: site.name,
      url: site.url,
      platform: site.platform,
      status: res.ok ? 'up' : 'down',
      statusCode: res.status,
      responseTime,
      error: res.ok ? null : `HTTP ${res.status}`,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name: site.name,
      url: site.url,
      platform: site.platform,
      status: 'down',
      statusCode: null,
      responseTime: null,
      error: err.message,
      checkedAt: new Date().toISOString(),
    };
  }
}

async function sendSlackAlert(downSites) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const lines = downSites.map(
    s => `• *${s.name}* (${s.platform}) — ${s.error}`
  );

  const message = {
    text: `🚨 *Website Monitor Alert*\n\nThe following sites are down:\n${lines.join('\n')}`,
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
}

async function main() {
  console.log(`Checking ${sites.length} sites...`);

  const results = await Promise.all(sites.map(checkSite));

  results.forEach(r => {
    console.log(`${r.status === 'up' ? '✅' : '❌'} ${r.name} — ${r.status} ${r.responseTime ? `(${r.responseTime}ms)` : ''}`);
  });

  fs.writeFileSync('status.json', JSON.stringify(results, null, 2));
  console.log('status.json updated');

  const downSites = results.filter(r => r.status === 'down');
  if (downSites.length > 0) {
    await sendSlackAlert(downSites);
    console.log('Slack alert sent');
  }
}

main();