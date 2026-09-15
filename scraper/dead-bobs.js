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
    const lowerHtml = html.toLowerCase();

console.log("🔎 Looking for deal-related words...");
console.log("Contains 'special':", lowerHtml.includes("special"));
console.log("Contains 'monday':", lowerHtml.includes("monday"));
console.log("Contains 'tuesday':", lowerHtml.includes("tuesday"));
console.log("Contains '$9.99':", lowerHtml.includes("$9.99"));
console.log("Contains 'chicken parmesan':", lowerHtml.includes("chicken parmesan"));
    
    console.log("✅ Dead Bob's website reached successfully!");
    console.log(`Downloaded ${html.length} characters of webpage data.`);
 } catch (error) {
  console.error("❌ Scraper failed:", error);
  console.error("Cause:", error.cause);
  process.exit(1);
}
}

scrapeDeadBobs();
