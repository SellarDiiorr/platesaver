const URL = "https://deadbobsstpete.com/";

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
const deals = prices.map((price, index) => ({
  restaurant_id: 5,
  restaurant: "Dead Bob's Bar & Restaurant",
  title: headings[index],
  price: price,
  source: URL,
  verification_status: "pending",
  verification_method: "automated"
}));

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
