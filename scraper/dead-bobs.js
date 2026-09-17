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

const headings = headingMatches.map(match => cleanText(match[1]));
const prices = priceMatches.map(match => cleanText(match[1]));
if (headings.length < prices.length) {
  throw new Error(
    `Extraction mismatch: found ${headings.length} headings but ${prices.length} prices`
  );
}    
if (headings.length < prices.length) {
  throw new Error(
    `Extraction mismatch: found ${headings.length} headings but ${prices.length} prices`
  );
}  
    
const deals = prices.map((price, index) => ({
  restaurant_id: 5,
  restaurant: "Dead Bob's Bar & Restaurant",
  title: headings[index],
  price: price,
  source: URL,
  verification_status: "pending",
  verification_method: "automated"
}));

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
    
console.log("🤖 PlateSaver structured deals:");

deals.forEach((deal, index) => {
  console.log(`Deal ${index + 1}:`);
  console.log(deal);
});
    
console.log("🍽️ Potential deal titles:");
console.log(headings);

console.log("💵 Potential deal prices:");
console.log(prices);
    
    console.log("✅ Dead Bob's website reached successfully!");
    console.log(`Downloaded ${html.length} characters of webpage data.`);
 } catch (error) {
  console.error("❌ Scraper failed:", error);
  console.error("Cause:", error.cause);
  process.exit(1);
}
}

scrapeDeadBobs();
