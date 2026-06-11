# MONAI Website Analytics: Operator Guide

> **Audience:** whoever administers the Google Analytics property. Everything code-side is
> shipped; this doc is the exact clicking to do in GA4 (plus GitHub and Search Console) to turn
> the data on. Property: GA4, web stream measurement ID **`G-QVGBCPFPJ6`**, site
> `https://project-monai.github.io`. You need **Editor** (or Admin) role on the property.

---

## 1. What the site sends today

`src/components/BaseHead.astro` loads gtag and classifies every visitor (human vs agent) before
the first event. `public/assets/js/track.js` turns `data-track` attributes into events
site-wide. The Model Zoo app calls `window.track()` directly.

| Event | Fires when | Parameters |
|---|---|---|
| `page_view` | every page load (automatic) | standard, plus config params `agent_class`, `agent_name`, `agent_in_browser` |
| `agent_visit` | a non-human agent loads a page | `agent_class`, `agent_name`, `agent_in_browser`, `page_path` |
| `cta_click` | primary CTA buttons (hero Get Started, View on GitHub, product-page Get Started / Documentation / GitHub, Join Project MONAI, story CTAs) | `cta_id` (e.g. `hero_get_started`), `cta_dest` |
| `filter_use` | tutorials filter buttons | `filter_type` (`framework` / `level`), `filter_value` |
| `md_twin_click` | the footer "View this page as Markdown" link | `md_path` |
| `zoo_search` | Model Zoo search (debounced) | `search_term`, `results_count` |
| `zoo_filter` | Model Zoo source/task/sort change | `filter_type` (`source` / `task` / `sort`), `filter_value` |
| `zoo_model_view` | a model detail page is opened | `model_id` |
| `zoo_outbound` | the download / Hugging Face link on a model detail page | `model_id`, `dest` |

**Not custom-coded on purpose:** outbound link clicks, scroll depth, and file downloads. GA4's
Enhanced Measurement provides them once you flip the toggles in §2-C.

---

## 2. One-time GA4 setup (~30 minutes)

### Before anything: the monai.io → project-monai.github.io move

The property predates the loss of monai.io. No data migration is needed or possible: GA4 data
lives in the property, not the domain, and the measurement ID is not domain-bound. The site
already sends to the same property from the new domain. Housekeeping:

- Edit the web stream (Admin → *Data streams* → "MONAI IO" → edit) and set the URL to
  `https://project-monai.github.io`. Metadata only; nothing collected changes.
- In reports spanning the transition, add the built-in **Hostname** dimension to separate
  monai.io-era rows from project-monai.github.io rows.
- Add an annotation (§5) on the domain-change date.
- Search Console history does NOT carry over (SC properties are domain-verified); create a
  fresh property for the new domain per §2-F. It starts from zero by design.
- Because monai.io is lost rather than retired, watch the Hostname dimension occasionally: if
  a foreign host ever serves pages embedding this measurement ID, its hits would appear here.
  Only if real pollution shows up is rotating to a new stream worth the continuity cost.

### A. Register custom dimensions

GA4 ignores custom parameters in reports until they're registered. **Do this first**: dimensions
only populate from registration day forward (no backfill).

**Path:** Admin (gear, bottom-left) → *Data display* → **Custom definitions** → **Create custom
dimension**. For each row, enter the Dimension name, set **Scope = Event**, and set **Event
parameter** to the exact string (case-sensitive). Save. Repeat 9 times.

| Dimension name | Scope | Event parameter | Description (paste into GA4) |
|---|---|---|---|
| agent_class | Event | `agent_class` | Visitor classification: human, agent_browser, headless, known_bot, or unknown. Set on every event by the site's agent detector. |
| agent_name | Event | `agent_name` | Which agent was detected (claudebot, gptbot, perplexity, playwright, etc.); "unknown" for humans. |
| agent_in_browser | Event | `agent_in_browser` | True when the agent drives a real browser (executes JS); false placeholder for server-side events. |
| cta_id | Event | `cta_id` | Which call-to-action button was clicked, as page_slug identifiers like hero_get_started or label_github. |
| filter_type | Event | `filter_type` | Which filter group was used: framework or level on Tutorials; source, task, or sort in the Model Zoo. |
| filter_value | Event | `filter_value` | The value chosen in that filter, e.g. core, beginner, segmentation, huggingface. |
| md_path | Event | `md_path` | Path of the Markdown twin opened via the footer "View this page as Markdown" link, e.g. /core.md. |
| model_id | Event | `model_id` | Model Zoo catalog ID of the model viewed or downloaded, e.g. spleen_ct_segmentation. |
| search_term | Event | `search_term` | What the visitor typed into the Model Zoo search box (debounced; non-empty queries only). |

Deliberately **not** registered (query ad hoc in Explorations instead): `cta_dest`, `dest`,
`results_count`, `page_path` (GA4 has Page path built in), `link_url`/`link_domain` (built in
once Enhanced Measurement is on).

### B. Bump data retention

Default is 2 months, which silently truncates Explorations.

**Path:** Admin → *Data collection and modification* → **Data retention** → **Event data
retention = 14 months** → Save.

### C. Enhanced Measurement toggles

**Path:** Admin → *Data collection and modification* → **Data streams** → click the web stream →
under *Enhanced measurement*, click the **gear** icon.

- **ON:** Page views (already), **Outbound clicks**, **Scrolls**, **File downloads**.
- Leave off / as-is: Site search (the Zoo's search is client-side state; `zoo_search` covers it),
  Video engagement, Form interactions.
- Note: GA4's file-download regex does **not** match `.md` files; the footer markdown link is
  tracked by the custom `md_twin_click` event instead.

### D. Mark key events

Create two: `cta_click` and `zoo_outbound` (someone leaving to download a model is the
strongest intent signal the site has).

**If the event already appears** under Admin → *Data display* → **Events** (it has received
traffic), just flip its "Mark as key event" toggle. Done.

**If GA4 shows the "Create an event" dialog instead** (no traffic received yet), fill it in
like this for each of the two names:

1. **Event name:** exactly `cta_click` (then `zoo_outbound`); lowercase, underscores, must match
   the code character for character.
2. **Mark as key event:** ON.
3. **Default key event value:** "Don't set a default key event value." These aren't purchases;
   a monetary default would put meaningless currency in revenue reports.
4. **Counting method:** "Once per event" (the recommended option). Every click counts.
5. **Choose how to create an event:** **"Create with code."** The site already sends these
   events from `track.js`, so you are only registering the name; there is no install step left
   to do. Do NOT use "Create without code": that builds a derived event from a trigger
   (page_view + URL condition) and is for sites that cannot edit their own code. Ignore the
   data-stream/trigger fields; they belong to that other path.

The "events with the same name from other data streams" notice is harmless: this property has
one web stream. After deploy, both show under Admin → Key events (zero until real clicks
arrive) and fire live in DebugView per §3.

### E. Filter out your own traffic

**Path:** Admin → *Data collection and modification* → **Data streams** → web stream →
**Configure tag settings** → *Show more* → **Define internal traffic** → Create rule: name
`team`, match type **IP address equals**, value = your public IP (the dialog's "What's my IP
address?" link shows it, or run `curl ifconfig.me`). If only the CIDR match type is offered,
append `/32` for a single address (e.g. `203.0.113.7/32`). Save.

Then the second half, without which nothing is excluded: Admin → *Data collection and
modification* → **Data filters** → *Internal Traffic* → it starts in **Testing** state (tags
but does not exclude) → set it to **Active**.

Pitfalls:
- Do NOT enter `localhost`: it is not an IP, and GA4 never sees one. Hits from local dev
  sessions arrive with your normal public IP, so the rule above already covers them.
- Ignore the placeholder example range (`192.0.2.0/24`); enter your real address.
- If your ISP rotates your public IP, the rule silently stops matching. If your own sessions
  reappear in reports, re-check your IP and update the rule.

### F. Link Search Console

Create the Search Console property first if it does not exist: choose **URL prefix** (not
Domain) with exactly `https://project-monai.github.io/`. A Domain property needs a DNS TXT
record, and nobody but GitHub controls DNS for `github.io`, so URL prefix is the only option
here. Verify via the **Google Analytics** method (instant, since gtag is on the site and you
admin the property); the HTML-file method is the fallback. Then submit `sitemap-index.xml` and
`sitemap-llms.xml` under *Sitemaps*.

**GA4 link path:** Admin → *Product links* → **Search Console links** → Link → choose that
property and the web stream. This adds organic-search queries to GA4 reporting and shows
whether the LLM sitemap is being crawled.

---

## 3. Verify it works (~10 minutes)

1. Install the **"Google Analytics Debugger"** Chrome extension and switch it on, then open
   `https://project-monai.github.io`.
2. In GA4: Admin → *Data display* → **DebugView**. Your device appears within ~30 s.
3. Click the homepage **Get Started** button → `cta_click` with `cta_id = hero_get_started`.
4. In the footer, click **View this page as Markdown** → `md_twin_click` with `md_path`.
5. On `/tutorials.html`, click a framework filter → `filter_use`.
6. On `/model-zoo.html`: type in the search box (`zoo_search`), open a model
   (`zoo_model_view`), click its download link (`zoo_outbound`, plus an automatic outbound
   `click`).
7. Reports → **Realtime** shows the same events property-wide.

---

## 4. Build these Explorations (saved reports)

Create each one at **Explore (left nav) → Blank**. Workflow is the same every time: name the
report, import the listed dimensions and metrics in the *Variables* column (the **+** buttons),
then drag them into the *Settings* column slots as shown. Filters are added at the bottom of
the Settings column.

**Date ranges:** prefer the *Last 28 days* preset over 30 (exactly four weeks, so the
weekday mix is constant between reads); the two low-volume reports use 90 days for sample
size. Custom dimensions never backfill, so data starts at the 2026-06 launch; ignore trend
reads until a few weeks have accumulated. Explorations are capped by the 14-month retention
set in §2-B, and very long windows trigger sampling.

### 4.1 Agent traffic

| Explore field | Set it to |
|---|---|
| Name | `Agent traffic` |
| Date range | Last 28 days |
| Technique | Free form |
| Import: dimensions | `agent_class`, `agent_name` |
| Import: metrics | Event count, Sessions |
| Rows | `agent_class`, then `agent_name` |
| Values | Event count, Sessions |
| Filters | none |

**What it answers:** how much traffic is AI agents, and which ones. When the non-human share
nears ~5% of page views, that's a signal worth acting on (see §6).

### 4.2 CTA performance

| Explore field | Set it to |
|---|---|
| Name | `CTA performance` |
| Date range | Last 28 days |
| Technique | Free form |
| Import: dimensions | `cta_id`, `agent_class`, Page path |
| Import: metrics | Event count |
| Rows | `cta_id` (add Page path as a second row to see where clicks happen) |
| Values | Event count |
| Filters | Event name *exactly matches* `cta_click` AND `agent_class` *exactly matches* `human` |

**What it answers:** which calls to action earn clicks from real people, hero vs deep-page.

### 4.3 Framework interest

| Explore field | Set it to |
|---|---|
| Name | `Framework interest` |
| Date range | Last 90 days |
| Technique | Free form |
| Import: dimensions | `filter_value` |
| Import: metrics | Event count |
| Rows | `filter_value` |
| Values | Event count |
| Filters | Event name *matches regex* `filter_use|zoo_filter` |

**What it answers:** which of Core / Label / Deploy (and which Zoo tasks) people actually
pursue. The most decision-useful report for roadmap and docs priorities.

### 4.4 Model Zoo engagement

| Explore field | Set it to |
|---|---|
| Name | `Model Zoo engagement` |
| Date range | Last 90 days |
| Technique | Free form, two tabs |
| Import: dimensions | `model_id`, `search_term` |
| Import: metrics | Event count |
| Tab 1 rows | `model_id` |
| Tab 1 filter | Event name *matches regex* `zoo_model_view|zoo_outbound` |
| Tab 2 rows | `search_term` |
| Tab 2 filter | Event name *exactly matches* `zoo_search` |

**What it answers:** Tab 1: which models matter (views and download intent). Tab 2: what people
search for, including what they search for and do not find.

### 4.5 Outbound destinations

| Explore field | Set it to |
|---|---|
| Name | `Outbound destinations` |
| Date range | Last 28 days |
| Technique | Free form |
| Import: dimensions | Link domain |
| Import: metrics | Event count |
| Rows | Link domain |
| Values | Event count |
| Filters | Event name *exactly matches* `click` AND Outbound *exactly matches* `true` |

**What it answers:** where the site sends people (GitHub vs docs vs Slack vs YouTube). Requires
the Enhanced Measurement outbound toggle from §2-C.

## 5. Annotate launches

On any report time-series chart, use the annotation (pencil) control to add dated notes:
"Light redesign launch", "Model Zoo re-skin", future content pushes. Before/after comparisons
rot without them.

---

## 6. Markdown / LLM traffic: what you can and cannot see

The site is LLM-friendly by design: every page has a `.md` twin, discoverable invisibly via
`<link rel="alternate" type="text/markdown">` and visibly via the footer "View this page as
Markdown" link, plus `llms.txt`, `llms-full.txt`, and `sitemap-llms.xml`.

- **Visible in GA4:** clicks on the footer markdown link (`md_twin_click`), and JS-executing
  agents on any page (`agent_visit` with the agent dimensions).
- **Not visible in GA4:** raw HTTP fetches of `.md` files, `llms.txt`, and `llms-full.txt`
  (crawlers and scripts execute no JS). Watch them via:
  1. **GitHub repo Insights → Traffic**: top-10 popular paths over a rolling 14 days. To keep
     history, periodically run and save
     `gh api repos/Project-MONAI/project-monai.github.io/traffic/popular/paths`.
  2. **Search Console** (linked in §2-F): crawl stats for `sitemap-llms.xml`.

Server-side measurement of those fetches would require putting a CDN/worker in front of the
site, which the canonical `project-monai.github.io` URL currently rules out: there is no plan
to do this. If that ever changes, the GA4 side is small: create a Measurement Protocol API
secret (Admin → Data streams → web stream → Measurement Protocol API secrets) and have the
worker POST `agent_visit` events with the same parameter names; the dimensions from §2-A
already cover them.

---

## 7. Maintenance

- **Adding events:** put `data-track="event_name"` + `data-track-<param>="value"` on any
  clickable element; `public/assets/js/track.js` does the rest. JS code calls
  `window.track('event_name', { param: value })` (guard with `if (window.track)`).
  Page-author checklist: DESIGN.md "Analytics instrumentation"; conventions: AGENTS.md.
- **Dimension budget:** GA4 allows 50 event-scoped custom dimensions; 9 are used. Register new
  ones only for parameters you'll slice reports by.
- **Renaming events is expensive** (history splits); prefer adding parameters to existing events.
