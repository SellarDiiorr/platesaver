const SUPABASE_URL = "https://xfekoadsrntzuyoecekw.supabase.co";
const SUPABASE_KEY = "sb_publishable_gb5mdGeMn51DdM0zXimOLw_Llbecqd0";

let deals = [];

const dealsContainer = document.getElementById("deals");
const searchInput = document.getElementById("search");
const resultsCount = document.getElementById("results-count");
const filterButtons = document.querySelectorAll(".filters button");

let activeFilter = "all";

function getDealDays(daysText) {
  if (!daysText) return [];

  return daysText
    .split(",")
    .map(day => day.trim());
}

function isToday(daysText) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });

  return getDealDays(daysText).includes(today);
}

async function loadDeals() {
  dealsContainer.innerHTML = `
    <div class="empty">
      Loading deals...
    </div>
  `;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/deals?select=*&active=eq.true&order=id.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    deals = await response.json();

    renderDeals();
  } catch (error) {
    console.error("Could not load PlateSaver deals:", error);

    dealsContainer.innerHTML = `
      <div class="empty">
        We couldn't load the deals right now. Please try again later.
      </div>
    `;

    resultsCount.textContent = "";
  }
}

function renderDeals() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filteredDeals = deals.filter((deal) => {
    const restaurant = (deal.restaurant || "").toLowerCase();
    const title = (deal.title || "").toLowerCase();

    const matchesSearch =
      restaurant.includes(searchTerm) ||
      title.includes(searchTerm);

    let matchesFilter = true;

    if (activeFilter === "today") {
      matchesFilter = isToday(deal.days);
    }

    if (activeFilter === "under10") {
      matchesFilter = deal.category === "under10";
    }

    if (activeFilter === "bogo") {
      matchesFilter = deal.category === "bogo";
    }

    if (activeFilter === "kids") {
      matchesFilter = deal.category === "kids";
    }

    return matchesSearch && matchesFilter;
  });

  resultsCount.textContent =
    `${filteredDeals.length} deal${filteredDeals.length === 1 ? "" : "s"} found`;

  if (filteredDeals.length === 0) {
    dealsContainer.innerHTML = `
      <div class="empty">
        No deals found. Try another search or filter.
      </div>
    `;
    return;
  }

  dealsContainer.innerHTML = filteredDeals
    .map(
      deal => `
        <article class="deal-card">

          <h2>${deal.title}</h2>

          <div class="restaurant">
            ${deal.restaurant}
          </div>

          <div class="deal-info">
            📅 ${deal.days}
          </div>

          <div class="price">
            ${deal.price}
          </div>

          <a
            class="view-deal"
            href="${deal.source}"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Deal
          </a>

        </article>
      `
    )
    .join("");
}

searchInput.addEventListener("input", renderDeals);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    activeFilter = button.dataset.filter;

    renderDeals();
  });
});

loadDeals();
