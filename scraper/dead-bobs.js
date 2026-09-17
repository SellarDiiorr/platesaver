const {
  processScrapedDeals
} = require("./scraper-engine");
const URL = "https://deadbobsstpete.com/";
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
    
await processScrapedDeals(deals, RESTAURANT_ID);
    
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
