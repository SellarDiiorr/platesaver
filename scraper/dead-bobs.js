const URL = "https://deadbobsstpete.com/";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESTAURANT_ID = 5;

async function scrapeDeadBobs() {
  console.log("🍽️ PlateSaver scraper starting...");
  console.log(`Checking: ${URL}`);

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`Website returned ${response.status}`);
    }

    const html = await response.text();
    const headingMatches = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gis)];
    const priceMatches = [...html.matchAll(/<strong[^>]*>(\$[\d,.]+)<\/strong>/gis)];

const cleanText = (text) =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

// Build deals using each price's actual position in the HTML.
// For every price, find the nearest H3 heading before it.
const deals = priceMatches.map((priceMatch) => {
  const price = cleanText(priceMatch[1]);
  const priceIndex = priceMatch.index;

  // Only inspect HTML that appears before this specific price.
  const htmlBeforePrice = html.slice(0, priceIndex);

  // Find every H3 heading before the price.
 const precedingHeadings = [
  ...htmlBeforePrice.matchAll(
    /<h3[^>]*>([\s\S]*?)<\/h3>/gi
  )
];
  
  // The last H3 before the price should belong to this deal.
  const nearestHeading = precedingHeadings.at(-1);

  if (!nearestHeading) {
    console.log(`⚠️ Could not find heading for ${price}`);
    return null;
  }

  const title = cleanText(nearestHeading[1]);

  return {
    restaurant_id: 5,
    restaurant: "Dead Bob's Bar & Restaurant",
    title,
    price,
    source: URL,
    verification_status: "pending",
    verification_method: "automated"
  };
}).filter(Boolean);

console.log("🧩 Position-based extraction results:");

deals.forEach((deal) => {
  console.log(`${deal.title} | ${deal.price}`);
});
    
console.log("🗄️ Reading Dead Bob's existing deals from Supabase...");

const supabaseResponse = await fetch(
  `${SUPABASE_URL}/rest/v1/deals?restaurant_id=eq.${RESTAURANT_ID}&select=id,title,price,active`,
  {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  }
);

if (!supabaseResponse.ok) {
  const errorText = await supabaseResponse.text();
  throw new Error(
    `Supabase returned ${supabaseResponse.status}: ${errorText}`
  );
}

const databaseDeals = await supabaseResponse.json();
    
console.log(`📦 Supabase returned ${databaseDeals.length} Dead Bob's deals:`);

databaseDeals.forEach((deal) => {
  console.log(
    `DB #${deal.id}: ${deal.title} | ${deal.price} | active=${deal.active}`
  );
});

console.log("🔎 Comparing website deals with PlateSaver database...");

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
    
deals.forEach((scrapedDeal) => {
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

  return;
}  
  
 if (!match) {
  if (possibleMatch && possibleMatch.score >= 0.7) {
    console.log(
      `🟡 POSSIBLE MATCH: Website "${scrapedDeal.title}" ↔ DB "${possibleMatch.deal.title}" | score=${possibleMatch.score.toFixed(2)}`
    );
    return;
  }

  console.log(
    `🆕 NEW DEAL: ${scrapedDeal.title} | ${scrapedDeal.price}`
  );
  return;
}
  
  if (String(match.price) !== String(scrapedDeal.price)) {
    console.log(
      `💲 PRICE CHANGE: ${scrapedDeal.title} | DB: ${match.price} → Website: ${scrapedDeal.price}`
    );
    return;
  }

console.log(
    `🟢 MATCH: ${scrapedDeal.title} | ${scrapedDeal.price}`
  );
});

console.log("🔎 Checking for database deals missing from website...");

databaseDeals.forEach((dbDeal) => {
  const match = deals.find(
    (scrapedDeal) =>
      normalize(scrapedDeal.title) === normalize(dbDeal.title)
  );

const possibleMatch = !match
  ? deals
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
console.log("🤖 PlateSaver structured deals:");

deals.forEach((deal, index) => {
  console.log(`Deal ${index + 1}:`);
  console.log(deal);
});
    
    console.log("✅ Dead Bob's website reached successfully!");
    console.log(`Downloaded ${html.length} characters of webpage data.`);
 } catch (error) {
  console.error("❌ Scraper failed:", error);
  console.error("Cause:", error.cause);
  process.exit(1);
}
}

scrapeDeadBobs();
