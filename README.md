# DSM Website Status Dashboard

This project monitors company websites and alerts the team if a site appears to be down or having issues.

The dashboard checks websites automatically on a schedule and displays their current status in a live dashboard hosted on GitHub Pages.

If a website fails a check, a Slack notification is sent automatically.



## What This Dashboard Monitors

The dashboard can monitor websites built on:

* WordPress
* Shopify
* MorrisCRM
* or any public website URL

Each site is checked regularly to confirm that:

* the website is reachable
* the homepage loads successfully
* the site does not return server errors
* the site responds within a reasonable amount of time



## Dashboard URL

```text
https://lturf.github.io/dsm-status-dashboard/
```



## How It Works

1. GitHub Actions runs automatic site checks every 10 minutes.
2. The monitoring script checks each configured website.
3. Results are displayed on the live dashboard.
4. If a site is down, Slack alerts are sent automatically.



## Slack Alerts

Website outage alerts are currently sent to the Slack testing channel.

Example alert:

```text
🚨 Website Issue Detected

• Example Website (Shopify) — Timeout
```



## Adding or Removing Websites

Websites are managed in:

```text
sites.json
```

Each website entry includes:

* site name
* website URL
* platform type

Example:

```json
{
  "name": "Example Website",
  "url": "https://example.com",
  "platform": "Shopify"
}
```

After updating the file and pushing changes to GitHub, the dashboard will automatically update during the next scheduled check.



## Important Notes

* GitHub Actions scheduled workflows may occasionally run a few minutes late.
* Website status updates may take a short time to appear due to GitHub Pages caching.
* `status.json` files are generated automatically and generally should not be edited manually.



## Future Improvements

Potential future improvements include:

* recovery notifications when sites come back online
* historical uptime tracking
* response-time warnings
* SSL expiration monitoring
* improved dashboard styling and filtering
* duplicate alert prevention



## Maintainer

Design Squad Media
