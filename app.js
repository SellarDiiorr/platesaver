const SUPABASE_URL = "https://xfekoadsrntzuyoecekw.supabase.co";
const SUPABASE_KEY = "sb_publishable_gb5mdGeMn51DdM0zXimOLw_Llbecqd0";

let deals = [];

const dealsContainer = document.getElementById("deals");
const searchInput = document.getElementById("search");
const resultsCount = document.getElementById("results-count");
const filterButtons = document.querySelectorAll(".filters button");
const locationButton = document.getElementById("location-btn");
const locationStatus = document.getElementById("location-status");
const distanceSelect = document.getElementById("distance-select");

let activeFilter = "all";
let activeDistance = "all";
let userLatitude = null;
let userLongitude = null;
function getDealDays(daysText) {
  if (!daysText) return [];

  return daysText
    .split(",")
    .map(day => day.trim());
}
function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
  const earthRadiusMiles = 3958.8;

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
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
const dealsWithDistance = deals.map((deal) => {
  let distance = null;

  if (
    userLatitude !== null &&
    userLongitude !== null &&
    deal.latitude !== null &&
    deal.longitude !== null
  ) {
    distance = calculateDistanceMiles(
      userLatitude,
      userLongitude,
      deal.latitude,
      deal.longitude
    );
  }

  return {
    ...deal,
    distance
  };
});
  const filteredDeals = dealsWithDistance.filter((deal) => {
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
let matchesDistance = true;

if (activeDistance !== "all") {
  const maxDistance = Number(activeDistance);

  matchesDistance =
    deal.distance !== null &&
    deal.distance <= maxDistance;
}
    
    return matchesSearch && matchesFilter && matchesDistance;
  });
const sortedDeals = [...filteredDeals].sort((a, b) => {
  if (a.distance === null && b.distance === null) return 0;
  if (a.distance === null) return 1;
  if (b.distance === null) return -1;

  return a.distance - b.distance;
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

  dealsContainer.innerHTML = sortedDeals
    .map(
      deal => `
        <article class="deal-card">

          <h2>${deal.title}</h2>

          <div class="restaurant">
            ${deal.restaurant}
          </div>
${deal.distance !== null ? `
  <div class="deal-info">
    📍 ${deal.distance.toFixed(1)} miles away
  </div>
` : ""}

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
distanceSelect.addEventListener("change", () => {
  activeDistance = distanceSelect.value;
  renderDeals();
});

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
locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationStatus.textContent = "Location services are not supported by this browser.";
    return;
  }

  locationStatus.textContent = "Finding your location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLatitude = position.coords.latitude;
      userLongitude = position.coords.longitude;

      locationStatus.textContent = "📍 Location found!";
   renderDeals();    
},
() => {
      locationStatus.textContent =
        "We couldn't access your location. Please allow location access and try again.";
    }
  );
});
loadDeals();
