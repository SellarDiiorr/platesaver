const {
  processScrapedDeals
} = require("./scraper-engine");
const URL = "https://thebierboutiquestpete.com/specials";
const RESTAURANT_ID = 7;

async function scrapeBierBoutique() {
  console.log("🍺 PlateSaver Bier Boutique scraper starting...");
  console.log(`Restaurant ID: ${RESTAURANT_ID}`);
  console.log(`Checking: ${URL}`);

  try {
    const response = await fetch(URL);

    console.log(`🌐 Website response: ${response.status}`);

    if (!response.ok) {
      throw new Error(`Website returned HTTP ${response.status}`);
    }

    const html = await response.text();

    console.log(`📄 Downloaded ${html.length} characters.`);

    const pageText = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim();

const deals = [];

if (
  pageText.includes("Maniac Monday") &&
  pageText.includes("50% off")
) {
  deals.push({
    restaurant_id: RESTAURANT_ID,
    title: "Maniac Monday",
    price: "50% off",
    source: URL,
    verification_status: "pending",
    verification_method: "automated"
  });
}

if (
  pageText.includes("Local Can Tuesday") &&
  pageText.includes("$3 off")
) {
  deals.push({
    restaurant_id: RESTAURANT_ID,
    title: "Local Can Tuesday",
    price: "$3 off",
    source: URL,
    verification_status: "pending",
    verification_method: "automated"
  });
}

if (
  pageText.includes("Happy Hour") &&
  pageText.includes("$2 off")
) {
  deals.push({
    restaurant_id: RESTAURANT_ID,
    title: "Happy Hour Drinks",
    price: "$2 off",
    source: URL,
    verification_status: "pending",
    verification_method: "automated"
  });
}

if (
  pageText.includes("Happy Hour") &&
  pageText.includes("$6 tots")
) {
  deals.push({
    restaurant_id: RESTAURANT_ID,
    title: "Happy Hour Tots",
    price: "$6",
    source: URL,
    verification_status: "pending",
    verification_method: "automated"
  });
}

if (pageText.includes("Fish Fry Friday")) {
  deals.push({
    restaurant_id: RESTAURANT_ID,
    title: "Fish Fry Friday",
    price: null,
    source: URL,
    verification_status: "pending",
    verification_method: "automated"
  });
}

console.log("🍺 Structured PlateSaver deals:");

deals.forEach((deal, index) => {
  console.log(`Deal ${index + 1}:`);
  console.log(deal);
});

const dealsWithPrices = deals.filter(
  (deal) => deal.price !== null
);

await processScrapedDeals(
  dealsWithPrices,
  RESTAURANT_ID
);
    
    console.log("\n🏁 Bier Boutique inspection complete.");
  } catch (error) {
    console.error("❌ Bier Boutique scraper failed:", error);
    process.exitCode = 1;
  }
}

scrapeBierBoutique();
