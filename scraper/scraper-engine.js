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

module.exports = {
  normalize,
  similarity,
  getRestaurantDeals,
  insertPendingDeal
};
