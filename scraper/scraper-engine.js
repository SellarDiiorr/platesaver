// PlateSaver Shared Scraper Engine
// Reusable logic for restaurant scrapers

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const normalize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const similarity = (a, b) => {
  const first = normalize(a);
  const second = normalize(b);

  if (first === second) return 1;

  if (first.startsWith(second) || second.startsWith(first)) {
    const shorter = Math.min(first.length, second.length);
    const longer = Math.max(first.length, second.length);

    return shorter / longer;
  }

  return 0;
};

async function getRestaurantDeals(restaurantId) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/deals?restaurant_id=eq.${restaurantId}&select=id,title,price,active`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Supabase read failed (${response.status}): ${errorText}`
    );
  }

  return await response.json();
}

async function insertPendingDeal(deal) {
  if (!SUPABASE_SECRET_KEY) {
    throw new Error("SUPABASE_SECRET_KEY is missing.");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/deals`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      restaurant_id: deal.restaurant_id,
      title: deal.title,
      price: deal.price,
      source: deal.source,
      active: false,
      verification_status: "pending",
      verification_method: "automated"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 409 && errorText.includes("23505")) {
      console.log(
        `🛡️ DUPLICATE BLOCKED: ${deal.title} already exists for restaurant #${deal.restaurant_id}`
      );

      return null;
    }

    throw new Error(
      `Supabase insert failed (${response.status}): ${errorText}`
    );
  }

  const inserted = await response.json();

  return inserted[0];
}

async function processScrapedDeals(scrapedDeals, restaurantId) {
  const databaseDeals = await getRestaurantDeals(restaurantId);

  console.log(
    `📦 Supabase returned ${databaseDeals.length} deals for restaurant #${restaurantId}:`
  );

  databaseDeals.forEach((deal) => {
    console.log(
      `DB #${deal.id}: ${deal.title} | ${deal.price} | active=${deal.active}`
    );
  });

  console.log("🔎 Comparing website deals with PlateSaver database...");

  for (const scrapedDeal of scrapedDeals) {
    const match = databaseDeals.find(
      (dbDeal) => normalize(dbDeal.title) === normalize(scrapedDeal.title)
    );

    const possibleMatch = !match
      ? databaseDeals
          .map((dbDeal) => ({
            deal: dbDeal,
            score: similarity(dbDeal.title, scrapedDeal.title)
          }))
          .sort((a, b) => b.score - a.score)[0]
      : null;

    if (match) {
      if (String(match.price) !== String(scrapedDeal.price)) {
        console.log(
          `💰 PRICE CHANGE: ${scrapedDeal.title} | DB: ${match.price} → Website: ${scrapedDeal.price}`
        );
      } else {
        console.log(
          `🟢 MATCH: ${scrapedDeal.title} | ${scrapedDeal.price}`
        );
      }

      continue;
    }

    if (possibleMatch && possibleMatch.score >= 0.7) {
      console.log(
        `🟡 POSSIBLE MATCH: Website "${scrapedDeal.title}" ↔ DB "${possibleMatch.deal.title}" | score=${possibleMatch.score.toFixed(2)}`
      );

      continue;
    }

    console.log(
      `🆕 NEW DEAL: ${scrapedDeal.title} | ${scrapedDeal.price}`
    );

    const insertedDeal = await insertPendingDeal(scrapedDeal);

    if (insertedDeal) {
      console.log(
        `📥 STAGED FOR REVIEW: DB #${insertedDeal.id} | ${insertedDeal.title} | active=${insertedDeal.active}`
      );
    }
  }

  console.log("🔎 Checking for database deals missing from website...");

  databaseDeals.forEach((dbDeal) => {
    const match = scrapedDeals.find(
      (scrapedDeal) =>
        normalize(scrapedDeal.title) === normalize(dbDeal.title)
    );

    const possibleMatch = !match
      ? scrapedDeals
          .map((scrapedDeal) => ({
            deal: scrapedDeal,
            score: similarity(dbDeal.title, scrapedDeal.title)
          }))
          .sort((a, b) => b.score - a.score)[0]
      : null;

    if (!match && (!possibleMatch || possibleMatch.score < 0.7)) {
      console.log(
        `⚠️ MISSING FROM WEBSITE: ${dbDeal.title} | DB: ${dbDeal.price}`
      );
    }
  });

  return databaseDeals;
}
module.exports = {
  normalize,
  similarity,
  getRestaurantDeals,
  insertPendingDeal,
  processScrapedDeals
};
