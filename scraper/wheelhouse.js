// PlateSaver - The Wheelhouse Scraper
// Restaurant ID: 6
// V1: Fetch and inspect the specials page only

const URL =
  "https://www.thewheelhousestpete.com/events/weekday-happy-hour";

const RESTAURANT_ID = 6;

async function scrapeWheelhouse() {
  console.log("🤖 PlateSaver Wheelhouse scraper starting...");
  console.log(`Restaurant ID: ${RESTAURANT_ID}`);
  console.log(`Checking: ${URL}`);

  try {
    const response = await fetch(URL);

    console.log(`🌐 Website response: ${response.status}`);

    if (!response.ok) {
      throw new Error(
        `Wheelhouse website returned HTTP ${response.status}`
      );
    }

    const html = await response.text();

    console.log(
      `📄 Downloaded ${html.length} characters of webpage data.`
    );

    // Strip script/style blocks so our inspection output is easier to read.
    const cleanedHtml = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ");

    // Convert basic HTML into readable text.
    const pageText = cleanedHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, " ")
      .trim();

    console.log("🔎 Looking for useful Wheelhouse deal signals...");

    const signals = [
      "Happy Hour",
      "$5",
      "Wings",
      "Quesadilla",
      "Loaded Fries",
      "Pizza",
      "Grilled Cheesus"
    ];

    signals.forEach((signal) => {
      const index = pageText
        .toLowerCase()
        .indexOf(signal.toLowerCase());

      if (index !== -1) {
        const start = Math.max(0, index - 150);
        const end = Math.min(pageText.length, index + 350);

        console.log(`\n✅ FOUND SIGNAL: ${signal}`);
        console.log(pageText.slice(start, end));
      } else {
        console.log(`❌ NOT FOUND: ${signal}`);
      }
    });

    console.log("\n🏁 Wheelhouse inspection complete.");
  } catch (error) {
    console.error("❌ Wheelhouse scraper failed:", error);
    process.exitCode = 1;
  }
}

scrapeWheelhouse();
