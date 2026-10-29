# Apex Embassy

Build a NEW internal application named "Apex Growth OS" for Apex Engineering. This is not a public SaaS and do NOT publish it yet.

GOAL
Apex Growth OS is the operating console for our entire client-acquisition and client-management lifecycle: CRM + leads + sales pipeline + referral partners + follow-ups/activities + client 360 + service coverage/cross-sell + Google/SEO/Analytics/Ads/Social campaign planning + an internal AI copilot interface. It must be immediately understandable to a business owner, not a developer.

CRITICAL COST/ARCHITECTURE RULES
- We have a very small Lovable credit budget. Build the strongest complete UI foundation in this ONE pass. Do not ask follow-up questions unless absolutely blocked.
- Do NOT enable Lovable Cloud/database.
- Do NOT create Supabase or any paid integration yet.
- Do NOT require API keys.
- Use clean typed mock data and a service/repository abstraction so we can later replace mock data with our own external Supabase.
- No self-modifying code or GitHub credentials inside the app.
- Do not publish.
- Desktop-first professional operations dashboard, but fully responsive on mobile.
- React + TypeScript + Tailwind/shadcn. Clean modular components. Avoid giant files.

DESIGN
Premium B2B operations software, dense and precise rather than empty. Dark navy/charcoal sidebar, light main workspace, crisp typography, compact tables, strong hierarchy, subtle borders, restrained accent. Think modern CRM/command center, not a flashy landing page. Sidebar icons must be clearly visible. Include global search and command-style quick actions.

APP NAVIGATION
1. Command Center
2. CRM
   - Accounts
   - Contacts
   - Leads
   - Pipeline
3. Activities
   - Follow-ups
   - Meetings
   - Tasks
4. Growth
   - Service Coverage
   - Campaigns
   - Google & SEO
   - Ads
   - Social Media
5. Acquisition
   - Lead Campaigns
   - Referral Partners
6. Apex Copilot
7. Reports
8. Connections
9. Settings

COMMAND CENTER
Show compact KPI cards: total accounts, active clients, open leads, proposals, pipeline value, recurring revenue placeholder, overdue follow-ups, this-week activities.
Show:
- Today's priorities
- Sales pipeline funnel
- Follow-ups due
- Recent activity
- Growth opportunities
- Referral performance
- "Ask Apex" copilot input fixed/visible as a major action

CRM DATA MODEL IN UI
Account fields: company/person, relationship type (Client/Prospect/Past Client/Partner), primary contact, source/referral partner, stage, priority, services delivered, services under evaluation, estimated value, recurring potential, last contact, next action, owner, notes.
Contacts can belong to accounts and can also be referral partners.
Lead stages: New, Qualified, Contacted, Discovery, Proposal, Negotiation, Won, Lost, Nurture.
Activities: call, email, meeting, WhatsApp, proposal, task, note, campaign; due date; completed status.

INITIAL INTERNAL DEMO RECORDS
Use these names only as internal demo records, no private emails/phone numbers:
- Flight Path Aviation Consulting — existing client — website/content/SEO-related work
- Trikaya Leadership — existing client — website/content/presentation work
- GreenThoughts Horti and Agro — client — website
- MaaOm Logistics — prospect/service engagement — technical audit/follow-up
- Huvepharma — prospect — social/digital communication proposal
- Nikhil Bhat Chocolate Brand — prospect — ecommerce
- Lalita Flour Mill — prospect — ecommerce/local digital presence
- Girish Lakhotiya — prospect — website proposal
- Sunil Deshpande — prospect — reporting/automation
Referral/contact demo records: Vikrant Patkar, Sampada Inamdar, Sunita Rebello, Vivek Kapse.
Never show Aiden AI anywhere.

CLIENT 360
Clicking an account opens a strong detail screen with:
- identity/header + stage + relationship
- timeline/activity
- opportunities
- projects/deliverables
- commercial summary
- contacts
- notes
- service coverage matrix
- next-best-services panel
Service coverage columns: Website, Ecommerce, Google Business Profile, SEO, GA4, Search Console, Social, Ads, AMC, AI/Automation. Status values: Active, Delivered, Needed Review, Opportunity, Not Relevant, Unknown. Never state an opportunity as fact; label unverified items "Needs Review".

SERVICE CATALOG / CROSS-SELL
Represent Apex's business stack:
Business Launch, Websites, Ecommerce, Google Business Profile, SEO, GA4/Search Console, Social Media Marketing, Google/Meta Ads, Lead Generation, AI & Automation, AMC/Website Care, custom packages.
Show Basic / Growth / Pro package placeholders plus "Build Your Own Package — from ₹3,000/month" as a draft commercial concept, clearly marked DRAFT internally.
Create a service-coverage heatmap/table across accounts so we can identify legitimate gaps.

GROWTH + CAMPAIGNS
Campaigns page supports draft campaign cards for Google Ads, SEO, Social, Launch/Publicity, Re-engagement and Lead Generation. Each campaign shows goal, audience, linked account/product, budget placeholder, status, tasks, metrics placeholders. Do not claim real Google data.
Google & SEO page should have connection-state cards for Google Business Profile, GA4, Search Console and Google Ads with "Not connected / Connect later" states.
Ads page: campaign planning UI only for now: budget, objective, target, landing page, keywords/audiences, status.
Social page: content/campaign calendar shell, Basic/Growth/Pro package summary, platform chips.

ACQUISITION
Lead Campaigns page: create/view lead-finding campaigns with goal such as Business Leads, Talent Scout, Product-specific Leads; source/evidence placeholders; lead count; qualification status; next action.
Referral Partners page: cards/table showing partner, leads introduced, won clients, pipeline value, attribution; use Vikrant Patkar, Sunita Rebello, Vivek Kapse as demo partner/contact records only where appropriate, and Sampada Inamdar as a contact unless explicitly marked later.

APEX COPILOT
Build a polished internal chat UI called "Apex Copilot". It is UI-only/mock for now, but architect it so later it can call our backend AI endpoint.
Example suggested commands:
- "Who needs a follow-up today?"
- "Show clients who may need SEO."
- "Prepare a re-engagement plan for past clients."
- "What should I pitch Flight Path next?"
- "Draft a follow-up for Girish."
Responses should render structured action cards and require confirmation for external actions. Never actually send anything.
Include a clear label "Demo mode — AI not connected".

CONNECTIONS
Create connection cards for:
- Apex Gmail (target primary business email)
- Personal Gmail (temporary migration source)
- Google Calendar
- Google Drive
- Google Ads
- Google Analytics 4
- Google Search Console
- Google Business Profile
- GitHub
All should default to "Not configured" or "Planned"; no fake connection claims.
Add a migration note: future customer engagement should move from personal Gmail to Apex Gmail while retaining historical correspondence links.

SETTINGS / SECURITY
Settings shell for users/roles, business profile, service catalog, stages, notification preferences, integrations.
Show security banner that real client data must not be imported until authentication/RLS is configured.

ROUTING/UX
All sidebar routes and major buttons should work. Tables need search/filter/sort affordances. Include useful empty states. Use drawers/modals for quick create Lead, Account, Activity, Campaign. Use toast feedback for mock saves. Ensure no dead buttons in the visible MVP.

FINAL
Build this as a credible operational application foundation that can later connect to external Supabase, Google APIs and an AI backend without rewriting the UI.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://apex-embassy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f7e4870-bc47-445a-a13f-bc56df7cef5f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
