-- Connect to your D1 DB using Wrangler:
-- wrangler d1 execute mpls_ledger_db --remote --file=more_seed.sql

CREATE TABLE IF NOT EXISTS agenda (
    id TEXT PRIMARY KEY,
    title TEXT,
    ai_summary TEXT,
    category TEXT,
    status TEXT,
    date TEXT
);

INSERT INTO agenda (id, title, ai_summary, category, status, date) VALUES
('item_4', 'Municipal Sidewalk Plowing Initiative', 'Diverts funding from seasonal park maintenance to ensure city sidewalks are fully plowed within 24 hours of a major snowfall. Aimed at improving pedestrian transit.', 'Public Works', 'Passed 11-2', 'Feb 10, 2026'),
('item_5', 'Ordinance 2026-03: Rent Stabilization Expansion', 'Expands existing rent control caps to include multi-family housing complexes built prior to 2010. Exempts newly constructed developments for 15 years to promote growth.', 'Housing', 'Failed 6-7', 'Feb 05, 2026'),
('item_6', 'Renewable Energy Grid Study', 'Authorizes $250,000 for an external study on transitioning municipal buildings entirely to solar and geothermal power by 2035.', 'Environment', 'In Committee', 'Jan 28, 2026'),
('item_7', 'Resolution 22.A: Overdose Prevention Centers', 'Approves the legal framework to operate three supervised safe injection sites within the city limits. Supported heavily by local health care organizations.', 'Public Health', 'Passed 9-4', 'Jan 22, 2026'),
('item_8', 'Police Accountability Oversight Board Restructuring', 'Grants the civilian oversight board direct subpoena power and the ability to unilaterally impose disciplinary recommendations without chief approval.', 'Public Safety', 'Vetoed by Mayor', 'Jan 15, 2026');
