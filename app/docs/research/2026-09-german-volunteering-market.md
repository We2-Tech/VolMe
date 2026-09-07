# German volunteering platforms — market snapshot, September 2026

Point-in-time research behind
`docs/decisions/0004-no-monetisation-during-cold-start.md`. Written 2026-09-07 from
public sources; **check the figures before relying on them**, all of them move.

---

## 1. What the incumbents charge

The two most visible German platforms in this space converged on the same shape,
independently: **the platform is free for non-profits and volunteers, and companies
pay.**

### vostel.de

Berlin social enterprise, operating since 2015 (Vostel Volunteering UG). Volunteers
browse 2,000+ social, cultural and ecological projects; the team vets every listing
before it goes live. Reported reach since founding: 56,000+ volunteers placed across
2,100+ non-profit organisations.

Business model, in their own words: **the site and the service are completely free
for non-profits and for private volunteers.** Costs are covered mainly by planning,
organising and running **corporate volunteering programmes for companies**, plus
their own paid workshops (volunteer recruitment and management, digitalisation,
corporate volunteering).

This is the closest analogue to VolMe, and it is the single most useful data point
in this document: the exact model v1 chose (charge organisers per publish) is the
one this market's most established player does not use.

### betterplace.org

Germany's largest donation platform, founded 2007, run as a non-profit gGmbH under
gut.org. Primarily donations rather than volunteer placement, but it carries
corporate volunteering ("Zeit spenden") alongside. The commercial arm is a separate
entity, **betterplace Solutions GmbH**, which advises companies on CSR.

Same pattern, more formalised: charitable platform, separate for-profit B2B
consulting company next to it.

**Read-through for VolMe:** a free platform is the norm, not a concession. Charging
organisers would put VolMe at a disadvantage against free alternatives that already
have the listings.

---

## 2. Munich specifically

This matters because the cold-start plan is local partnerships, not national scale.

- **Freiwilligen-Agentur TATENDRANG** — the main volunteer agency in Munich. Works
  with **400+ facilities and projects**; does personal placement consulting,
  training and peer exchange for volunteers and volunteer coordinators, and advises
  companies and organisations. Positions itself as the bridge between citizens,
  non-profits and the City of Munich.
- **FöBE** (Förderstelle für Bürgerschaftliches Engagement) — works alongside
  TATENDRANG; runs a platform for finding and offering spaces, and a newsletter that
  reaches the Munich engagement scene.
- **Landeshauptstadt München** maintains its own "Ehrenamt finden" entry point at
  `stadt.muenchen.de/infos/engagement.html`.
- **lagfa Bayern** (Landesarbeitsgemeinschaft der Freiwilligen-Agenturen) runs a
  state-level online engagement exchange.

**Read-through:** these are not competitors to out-build, they are distribution.
TATENDRANG alone already has relationships with 400+ Munich organisations —
exactly the supply side VolMe needs and does not have. FöBE's newsletter is a
channel to the same audience. The realistic cold-start move is to be useful to
these bodies (a better listing/application tool than what they have), not to
recruit organisations one by one against them.

Note the flip side: they also mean VolMe is not entering a vacuum. Any pitch has to
answer "why not just use TATENDRANG's existing process".

---

## 3. Funding, as an alternative to revenue

For a non-profit-shaped project in Germany, grants are a more realistic
cost-coverage path than early revenue.

**Deutsche Stiftung für Engagement und Ehrenamt (DSEE)** — federal foundation,
established by the EhrenamtStiftG, explicitly funds digitalisation in the
volunteering sector. Programmes relevant here:

- **100xDigital** — supports 100 non-profit organisations nationwide through a
  digital transformation project: training, individual consulting, networking, and
  **up to €20,000** per organisation.
- **Regional digitalisation funding**, 2026 focus theme _"Digital in die Zukunft —
  engagiert mit KI und Co."_ Eligible measures explicitly include building a website
  for an initiative. **Applications for the 2026 period: 2 March – 1 November
  2026** — that window is open as this is written.
- **Aktionsförderprogramm** (running to 31 May 2026), the **2.000 × 1.000 €**
  micro-grant programme, plus `foerderdatenbank.d-s-e-e.de` as a searchable index of
  everything else.

**Read-through:** most of these fund _an organisation_, not a private GitHub
project. Pursuing them realistically means either founding an e.V./gGmbH, or
applying jointly with a partner organisation — which is another reason the Munich
partnerships come first. Worth checking eligibility before the November deadline.

---

## 4. Ranked options for VolMe

Ordered by fit with this product and this stage, not by generic attractiveness.

| #   | Option                                               | Who pays      | Notes                                                                                                                                                                                                                                                                          |
| --- | ---------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Corporate volunteering (B2B)**                     | Companies     | The proven model in this market. Companies need team volunteering days organised and participation hours reported for ESG/CSR. High ticket size, and it does not tax either side of the marketplace. Needs org accounts, team sign-up, hours export — none of which exist yet. |
| 2   | **Paid organiser verification / featured placement** | Organisations | Uses `Organizer.isVerified`, which already exists. Crucially it _adds_ visibility rather than _blocking_ publishing, so it does not shrink supply. Only viable once there is enough traffic for visibility to be worth money.                                                  |
| 3   | **Grants (DSEE et al.)**                             | Foundations   | Covers cost, not profit. Needs a legal entity or a partner. Real deadlines — see §3.                                                                                                                                                                                           |
| 4   | **Donations / sponsorship**                          | Individuals   | GitHub Sponsors, Open Collective, Ko-fi. One link in the footer, no code, no schema. Never significant money, but free to set up.                                                                                                                                              |
| 5   | **Recruitment listings for NGOs**                    | Organisations | For long-term volunteer roles rather than one-off events. Adjacent product; only after the core works.                                                                                                                                                                         |

**Never charge individual volunteers.** It contradicts the point of the product and
would kill the demand side.

---

## 5. What v1 got wrong, stated plainly

v1 charged organisers per event published. In a two-sided marketplace at zero
scale that is the worst possible lever: the supply side is the scarce one, and a
publish fee makes it scarcer. It was a sensible answer to a course requirement
("show a business model") and a poor answer to an actual launch.

## Sources

- [vostel.de — Für Non-Profits](https://vostel.de/de/fuer_non_profits) · [FAQ](https://vostel.de/de/faq) · [Startup-Atlas entry](https://www.startup-atlas.de/company/vostel)
- [DSEE — Digitale Engagement-Plattformen](https://www.deutsche-stiftung-engagement-und-ehrenamt.de/aktuelles/digitale-engagement-plattformen/) · [Arbeitsprogramm 2026](https://www.deutsche-stiftung-engagement-und-ehrenamt.de/aktuelles/arbeitsprogramm-2026/) · [Förderdatenbank](https://foerderdatenbank.d-s-e-e.de/)
- [betterplace.org — Über uns](https://www.betterplace.org/c/ueber-uns) · [Wikipedia](https://de.wikipedia.org/wiki/Betterplace.org)
- [Freiwilligen-Agentur TATENDRANG](https://www.tatendrang.de/) · [Stadt München — Ehrenamt finden](https://stadt.muenchen.de/infos/engagement.html) · [FöBE München](https://foebe-muenchen.de/)
