# 🍽️ PlateSaver

**PlateSaver helps people discover local restaurant deals, specials, and discounts near them.**

Instead of searching individual restaurant websites, social pages, and menus, PlateSaver brings local deals together in one place and helps users find savings based on their location.

PlateSaver is currently being developed and tested in **St. Petersburg, Florida**.

---

## 🚀 Current Status

PlateSaver is an active MVP currently under development.

### Working Features

- 📍 Browser-based user location
- 📏 Distance-based restaurant filtering
- 🔎 Deal search
- 🏷️ Deal category filters
- 🍽️ Restaurant and deal database powered by Supabase
- 🌐 Live frontend hosted with GitHub Pages
- 🔗 Restaurant/deal relational database structure
- ✅ Deal verification and status tracking
- 🤖 Automated restaurant deal scraping
- 🧠 Shared scraper engine with fuzzy deal matching
- 💰 Price-change detection
- ⚠️ Missing-deal detection
- 🆕 New-deal discovery
- 🛡️ Duplicate protection
- 📥 Safe staging of automated discoveries for human review

---

## 🤖 PlateSaver Scraper Engine

PlateSaver is being built to do more than simply store manually entered restaurant specials.

The scraper system can collect deal information from restaurant websites and convert it into structured PlateSaver data.

Current pipeline:

Restaurant Website
        ↓
Restaurant-Specific Extractor
        ↓
Structured Deal Data
        ↓
PlateSaver Scraper Engine
        ↓
Exact / Fuzzy Matching
        ↓
New Deal / Price Change / Missing Deal Detection
        ↓
Pending Human Review
        ↓
PlateSaver Database

Automated discoveries are **never automatically treated as verified deals**.

New discoveries are staged as:

- `verification_status = pending`
- `verification_method = automated`
- `active = false`

This allows PlateSaver to automate discovery while protecting the accuracy of live deal data.

---

## 🧠 Scraper Engine V2

The shared scraper engine currently supports:

- Exact normalized title matching
- Partial-title matching
- Word-overlap similarity matching
- Possible-match detection
- Price-change detection
- Missing-deal detection
- Duplicate prevention
- Safe Supabase inserts

The same engine can process deals extracted from multiple restaurant websites without duplicating comparison/database logic.

### Current Scraper Tests

**Dead Bob's Bar & Restaurant**
- Direct website scraping
- Structured deal extraction
- Shared engine integration
- Duplicate-safe staging
- Successfully tested end-to-end

**The Bier Boutique**
- Specials-page extraction
- Shared engine integration
- Similarity Engine V2 testing
- Successfully tested end-to-end

**The Wheelhouse**
- Website identified as blocking direct GitHub Actions requests (`HTTP 403`)
- Classified for future alternate-source ingestion

---

## 🗄️ Technology

PlateSaver currently uses:

- **HTML / CSS / JavaScript** — frontend
- **Supabase** — database and API
- **GitHub** — source control
- **GitHub Pages** — hosting
- **GitHub Actions** — scraper execution and automation
- **Node.js** — restaurant scraper runtime

---

## 🎯 V1 Roadmap

PlateSaver is currently approximately **60% through the planned St. Petersburg MVP**.

### Completed / Mostly Completed

- [x] Initial PlateSaver frontend
- [x] Supabase integration
- [x] Restaurant database
- [x] Deal database
- [x] Restaurant/deal relationships
- [x] User location
- [x] Distance filtering
- [x] Search and deal filters
- [x] Verification fields
- [x] Shared scraper engine
- [x] Automated deal staging
- [x] Duplicate protection
- [x] Similarity Engine V2
- [x] Multi-restaurant scraper architecture

### In Progress / Next

- [ ] Expand restaurant coverage
- [ ] Support additional website structures
- [ ] Handle scraper-blocked websites and alternate sources
- [ ] Automated scraper scheduling
- [ ] Restaurant discovery system
- [ ] Deal review / approval dashboard
- [ ] Stale-deal detection
- [ ] Scraper health monitoring
- [ ] Mobile UI polish
- [ ] Analytics
- [ ] St. Petersburg V1 launch

---

## 🔮 Long-Term Vision

The goal is to create a system capable of:

**Discovering restaurants → finding specials → extracting deals → comparing existing data → detecting changes → staging uncertain information → human verification → publishing trusted deals.**

PlateSaver is starting with St. Petersburg, Florida, with the goal of eventually supporting additional cities and markets.

---

## ⚠️ Deal Accuracy

Restaurant specials can change without notice.

PlateSaver uses verification status, source tracking, automated monitoring, and human review to improve data quality.

A deal appearing on a restaurant website does not automatically mean PlateSaver considers that deal verified.

---

## 🛠️ Development Status

PlateSaver is currently under active development.

The project began as an experiment in building a location-aware restaurant deal finder and has evolved into a database-backed application with an automated deal discovery and verification pipeline.

**Current focus:** expanding scraper coverage and building the infrastructure required for a public St. Petersburg MVP.
