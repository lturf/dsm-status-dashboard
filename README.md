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
* the site is not displaying common suspension or invalid-page messages



## Dashboard URL

```text
https://lturf.github.io/dsm-status-dashboard/
```



## How It Works

1. GitHub Actions runs automatic site checks every 10 minutes.
2. The monitoring script checks each configured website.
3. Results are displayed on the live dashboard.
4. If a site goes down, a Slack alert is sent automatically.
5. If a site comes back online, a recovery alert is sent automatically.



## Slack Alerts

Website outage alerts are currently sent to the Slack testing channel.

Example outage alert:

```text
🚨 Website Issue Detected

• Example Website (Shopify) — Timeout
```

Example recovery alert:

```text
✅ Website Recovery Detected

• Example Website (Shopify) — back online
```



## Dashboard Features

The dashboard currently includes:

* live website status monitoring
* response time tracking
* automatic sorting of failed sites to the top
* clickable website cards
* hover animations and interactive UI effects
* responsive glass-style dashboard design
* Jira request button for adding new monitored sites



## Adding or Removing Websites

Website monitoring requests can now be submitted directly through the Jira request form linked on the dashboard.

Websites can also still be managed manually in:

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
* GitHub Actions scheduling is used as a lightweight monitoring solution and may not always run at exact 10-minute intervals.



## Future Improvements

Potential future improvements include:

* historical uptime tracking
* uptime percentage calculations
* response-time warning states
* SSL expiration monitoring
* advanced dashboard filtering/search
* incident history tracking
* admin dashboard for adding/removing websites
* Cloudflare Worker-based scheduling for more reliable check frequency



## Maintainer

Design Squad Media
