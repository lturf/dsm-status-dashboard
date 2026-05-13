import fs from "fs";

const sites = JSON.parse(fs.readFileSync("sites.json", "utf-8"));

let previousResults = [];

try {
  previousResults = JSON.parse(fs.readFileSync("status.json", "utf-8"));
} catch {
  previousResults = [];
}

async function checkSite(site) {
  const start = Date.now();

  try {
    const res = await fetch(site.url, { signal: AbortSignal.timeout(10000) });
    const responseTime = Date.now() - start;

    const html = await res.text();
    const lowerHtml = html.toLowerCase();

    const issuePhrases = [
      "site has been suspended",
      "account suspended",
      "this site is currently unavailable",
      "site suspended",
      "website suspended",
      "domain suspended",
      "page not found",
    ];

    const matchedPhrase = issuePhrases.find((phrase) => lowerHtml.includes(phrase));

    if (!res.ok) {
      return {
        name: site.name,
        url: site.url,
        platform: site.platform,
        status: "down",
        statusCode: res.status,
        responseTime,
        error: `HTTP ${res.status}`,
        checkedAt: new Date().toISOString(),
      };
    }

    if (matchedPhrase) {
      return {
        name: site.name,
        url: site.url,
        platform: site.platform,
        status: "down",
        statusCode: res.status,
        responseTime,
        error: `Problem phrase detected: "${matchedPhrase}"`,
        checkedAt: new Date().toISOString(),
      };
    }

    return {
      name: site.name,
      url: site.url,
      platform: site.platform,
      status: "up",
      statusCode: res.status,
      responseTime,
      error: null,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      name: site.name,
      url: site.url,
      platform: site.platform,
      status: "down",
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

  const lines = downSites.map((s) => `• *${s.name}* (${s.platform}) — ${s.error}`);

  const message = {
    text: `🚨 *Website Monitor Alert*\n\nThe following sites are down:\n${lines.join("\n")}`,
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
}

async function sendSlackRecoveryAlert(recoveredSites) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const lines = recoveredSites.map(
    (s) => `• *${s.name}* (${s.platform}) — back online (${s.responseTime}ms)`,
  );

  const message = {
    text: `✅ *Website Monitor Recovery*\n\nThe following sites are back online:\n${lines.join("\n")}`,
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
}

async function main() {
  console.log(`Checking ${sites.length} sites...`);

  const results = await Promise.all(sites.map(checkSite));

  results.forEach((r) => {
    console.log(
      `${r.status === "up" ? "✅" : "❌"} ${r.name} — ${r.status} ${r.responseTime ? `(${r.responseTime}ms)` : ""}`,
    );
  });

  fs.writeFileSync("status.json", JSON.stringify(results, null, 2));
  console.log("status.json updated");

  const newlyDownSites = results.filter((site) => {
    const previous = previousResults.find((oldSite) => oldSite.url === site.url);

    return site.status === "down" && previous?.status !== "down";
  });

  const recoveredSites = results.filter((site) => {
    const previous = previousResults.find((oldSite) => oldSite.url === site.url);

    return site.status === "up" && previous?.status === "down";
  });

  if (newlyDownSites.length > 0) {
    await sendSlackAlert(newlyDownSites);
    console.log("Slack outage alert sent");
  }

  if (recoveredSites.length > 0) {
    await sendSlackRecoveryAlert(recoveredSites);
    console.log("Slack recovery alert sent");
  }

  if (newlyDownSites.length === 0 && recoveredSites.length === 0) {
    console.log("No status changes detected");
  }
}

main();
