const deals = [
  {
    restaurant: "Salty J's",
    title: "$2 Chicken or Beef Soft Tacos",
    days: ["Tuesday"],
    price: "$2 each",
    category: "under10",
    source: "https://saltyjstpete.com/specials/"
  },
  {
    restaurant: "Salty J's",
    title: "Fish & Chips Basket",
    days: ["Friday"],
    price: "$7.97",
    category: "under10",
    source: "https://saltyjstpete.com/specials/"
  },
  {
    restaurant: "Salty J's",
    title: "Breakfast Sandwich",
    days: ["Saturday", "Sunday"],
    price: "$6.97",
    category: "under10",
    source: "https://saltyjstpete.com/specials/"
  },
  {
    restaurant: "The Crafty Squirrel",
    title: "$3 Taco Tuesday",
    days: ["Tuesday"],
    price: "$3",
    category: "under10",
    source: "https://www.toasttab.com/local/order/the-crafty-squirrel/r-34c55a09-d52b-422a-bb56-c64d94d6600a"
  },
  {
    restaurant: "CD Roma",
    title: "Kids Eat Free",
    days: ["Wednesday"],
    price: "Free kids meal with adult entree",
    category: "kids",
    source: "https://www.opentable.com/r/cd-roma-st-petersburg"
  },
  {
    restaurant: "CD Roma",
    title: "BOGO Chicken Parmigiana",
    days: ["Thursday"],
    price: "Buy one, get one free",
    category: "bogo",
    source: "https://www.opentable.com/r/cd-roma-st-petersburg"
  }
];

const dealsContainer = document.getElementById("deals");
const searchInput = document.getElementById("search");
const resultsCount = document.getElementById("results-count");
const filterButtons = document.querySelectorAll(".filters button");

let activeFilter = "all";

function isToday(days) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return days.includes(today);
}

function renderDeals() {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.restaurant.toLowerCase().includes(searchTerm) ||
      deal.title.toLowerCase().includes(searchTerm);

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

  resultsCount.textContent = `${filteredDeals.length} deal${filteredDeals.length === 1 ? "" : "s"} found`;

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
      (deal) => `
        <article class="deal-card">
          <h2>${deal.title}</h2>
          <div class="restaurant">${deal.restaurant}</div>
          <div class="deal-info">📅 ${deal.days.join(", ")}</div>
          <div class="price">${deal.price}</div>
          <a class="view-deal" href="${deal.source}" target="_blank">
            View Deal
          </a>
        </article>
      `
    )
    .join("");
}

searchInput.addEventListener("input", renderDeals);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    activeFilter = button.dataset.filter;
    renderDeals();
  });
});

renderDeals();