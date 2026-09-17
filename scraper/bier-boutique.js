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

    const signals = [
      "Maniac Monday",
      "50% off",
      "Local Can Tuesday",
      "$3 off",
      "Happy Hour",
      "$2 off",
      "$6 tots",
      "Fish Fry Friday"
    ];

    console.log("🔎 Searching specials page...");

    signals.forEach((signal) => {
      const index = pageText.toLowerCase().indexOf(signal.toLowerCase());

      if (index !== -1) {
        const start = Math.max(0, index - 120);
        const end = Math.min(pageText.length, index + 350);

        console.log(`\n✅ FOUND: ${signal}`);
        console.log(pageText.slice(start, end));
      } else {
        console.log(`❌ NOT FOUND: ${signal}`);
      }
    });

    console.log("\n🏁 Bier Boutique inspection complete.");
  } catch (error) {
    console.error("❌ Bier Boutique scraper failed:", error);
    process.exitCode = 1;
  }
}

scrapeBierBoutique();
