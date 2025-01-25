// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// Invoking strict mode
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Global variables
////////////////////////////////////////////////////////////////////////////////

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// This will store the current filter type (e.g. 'best-discount', 'most-commented', 'hot-deals', 'favorites', or null)
let currentFilter = null;

// This will store the current sort value: 'price-asc', 'price-desc', 'date-asc', 'date-desc', etc.
let currentSort = 'price-asc';

// Keep a list of favorite deal UUIDs in localStorage
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const bestDiscountButton = document.querySelector('#bestDiscountButton');
const mostCommentedButton = document.querySelector('#mostCommentedButton');
const hotDealsButton = document.querySelector('#hotDealsButton');
const favoriteFilterButton = document.querySelector('#favoriteFilterButton');
const sortSelect = document.querySelector('#sort-select');

// IDs for sales info
const nbSalesSpan = document.querySelector('#nbSales');
const p5ValueSpan = document.querySelector('#p5Value');
const p25ValueSpan = document.querySelector('#p25Value');
const p50ValueSpan = document.querySelector('#p50Value');
const avgValueSpan = document.querySelector('#avgValue');
const lifetimeValueSpan = document.querySelector('#lifetimeValue');

/**
 * Set global value
 * @param {Object} data - {result, meta} from API
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from API
 * @param  {Number} [page=1] - current page to fetch
 * @param  {Number} [size=6] - size of the page
 * @return {Object} {result, meta}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }
    return body.data; // {result, meta}
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Fetch sales from API
 * @param  {Number} id - lego set id
 * @return {Array} list of sales
 */
const fetchSales = async (id) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }
    // The endpoint returns {data: {result: [...], meta: {...}}}
    // We'll assume the actual sales array is in body.data.result
    return body.data.result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Render list of deals into the #deals section
 * - Opens link in new tab
 * - Includes a "favorite" button
 *
 * @param  {Array} deals
 */
const renderDeals = (deals) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  const template = deals
    .map(deal => {
      const isFavorite = favorites.includes(deal.uuid) ? '★' : '☆'; // star symbol
      return `
        <div class="deal" id="${deal.uuid}">
          <span>ID: ${deal.id}</span>
          <a href="${deal.link}" target="_blank">${deal.title}</a>
          <span>Price: ${deal.price} €</span>
          <span>Discount: ${deal.discount || 0}%</span>
          <span>Comments: ${deal.commentsCount || 0}</span>
          <span>Temperature: ${deal.temperature || 0}</span>

          <!-- Toggle favorite button -->
          <button class="favorite-btn" data-uuid="${deal.uuid}">${isFavorite}</button>
        </div>
      `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);

  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = (pagination) => {
  const {currentPage, pageCount} = pagination;

  const options = Array.from(
    {length: pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  // Adjust the selected index (pages are 1-based)
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Extract a unique list of lego-set IDs from the deals
 * @param  {Array} deals
 * @return {Array} list of unique IDs
 */
const getIdsFromDeals = (deals) => {
  const ids = deals.map(d => d.id);
  return Array.from(new Set(ids)).sort();
};

/**
 * Render lego set ids in the #lego-set-id-select
 * @param  {Array} deals
 */
const renderLegoSetIds = (deals) => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => `<option value="${id}">${id}</option>`).join('');
  selectLegoSetIds.innerHTML = `<option value="">-- select an ID --</option>` + options;
};

/**
 * Render main indicators
 * @param  {Object} pagination
 */
const renderIndicators = (pagination) => {
  const {count} = pagination;
  spanNbDeals.innerHTML = count;
};

/**
 * A small helper to compute or apply all filters
 * @param {Array} deals
 * @return {Array} filtered deals
 */
const applyFilters = (deals) => {
  let filtered = [...deals];

  switch (currentFilter) {
    case 'best-discount':
      filtered = filtered.filter(d => (d.discount || 0) > 50);
      break;
    case 'most-commented':
      filtered = filtered.filter(d => (d.commentsCount || 0) > 15);
      break;
    case 'hot-deals':
      filtered = filtered.filter(d => (d.temperature || 0) > 100);
      break;
    case 'favorites':
      filtered = filtered.filter(d => favorites.includes(d.uuid));
      break;
    default:
      // no filter
      break;
  }

  return filtered;
};

/**
 * A helper to sort deals
 * @param {Array} deals
 * @param {String} sortValue
 */
const applySort = (deals, sortValue) => {
  // Defensive copy
  const sorted = [...deals];

  switch (sortValue) {
    case 'price-asc':
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-desc':
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'date-asc':
      // from oldest to newest
      sorted.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
      break;
    case 'date-desc':
      // from newest to oldest
      sorted.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      break;
    default:
      // no sort
      break;
  }

  return sorted;
};

/**
 * Final render pipeline (apply filter + sort, then paint)
 */
const render = (deals, pagination) => {
  // 1) filter
  let filteredDeals = applyFilters(deals);

  // 2) sort
  filteredDeals = applySort(filteredDeals, currentSort);

  // 3) render to DOM
  renderDeals(filteredDeals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals);
};

/**
 * Compute statistics for sales
 * @param {Array} sales
 * @return {Object} stats {count, p5, p25, p50, avg, lifetime}
 */
const computeSalesStats = (sales) => {
  if (!sales.length) {
    return {
      count: 0,
      p5: 0,
      p25: 0,
      p50: 0,
      avg: 0,
      lifetime: 0
    };
  }

  // Sort by price
  const prices = sales.map(s => s.price).sort((a, b) => a - b);
  const count = prices.length;
  const p5  = prices[Math.floor(0.05 * count)] || 0;
  const p25 = prices[Math.floor(0.25 * count)] || 0;
  const p50 = prices[Math.floor(0.50 * count)] || 0;
  const avg = prices.reduce((acc, val) => acc + val, 0) / count;

  // Lifetime = difference in days between earliest and latest sold date
  const dates = sales.map(s => new Date(s.dateSold)).sort((a, b) => a - b);
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];
  const differenceInDays = Math.round((maxDate - minDate) / (1000 * 3600 * 24));

  return {
    count,
    p5,
    p25,
    p50,
    avg,
    lifetime: differenceInDays
  };
};

/**
 * Render the sales stats + list the sold items
 * @param {Array} sales
 */
const renderSales = (sales) => {
  const stats = computeSalesStats(sales);

  // Update indicators
  nbSalesSpan.textContent = stats.count;
  p5ValueSpan.textContent = stats.p5;
  p25ValueSpan.textContent = stats.p25;
  p50ValueSpan.textContent = stats.p50;
  avgValueSpan.textContent = stats.avg.toFixed(2);
  lifetimeValueSpan.textContent = stats.lifetime;

  // Render a list of sold items (in #sales-list)
  const salesList = document.querySelector('#sales-list');
  if (salesList) {
    if (!sales.length) {
      salesList.innerHTML = `<p>No sales found for this set.</p>`;
      return;
    }

    const html = sales
      .map(sale => {
        return `
          <div class="sale-item">
            <a href="${sale.link}" target="_blank">Link to sold item</a>
            <span>Price: ${sale.price} €</span>
            <span>Date sold: ${sale.dateSold}</span>
          </div>
        `;
      })
      .join('');

    salesList.innerHTML = html;
  }
};

////////////////////////////////////////////////////////////////////////////////
// Event listeners
////////////////////////////////////////////////////////////////////////////////

/**
 * When user changes "Show" size
 */
selectShow.addEventListener('change', async (event) => {
  const size = parseInt(event.target.value);
  const page = currentPagination.currentPage || 1;
  const data = await fetchDeals(page, size);

  setCurrentDeals(data);
  render(currentDeals, currentPagination);
});

/**
 * When user changes page
 */
selectPage.addEventListener('change', async (event) => {
  const selectedPage = parseInt(event.target.value);
  const size = currentPagination.pageSize || 6;

  const data = await fetchDeals(selectedPage, size);
  setCurrentDeals(data);
  render(currentDeals, currentPagination);
});

/**
 * When user picks a lego set ID => fetch Vinted sales & render
 */
selectLegoSetIds.addEventListener('change', async (event) => {
  const legoSetId = event.target.value;
  if (!legoSetId) {
    // reset sales info if no ID selected
    renderSales([]);
    return;
  }
  const sales = await fetchSales(legoSetId);
  renderSales(sales);
});

/**
 * Best discount filter
 */
bestDiscountButton.addEventListener('click', () => {
  currentFilter = 'best-discount';
  render(currentDeals, currentPagination);
});

/**
 * Most commented filter
 */
mostCommentedButton.addEventListener('click', () => {
  currentFilter = 'most-commented';
  render(currentDeals, currentPagination);
});

/**
 * Hot deals filter
 */
hotDealsButton.addEventListener('click', () => {
  currentFilter = 'hot-deals';
  render(currentDeals, currentPagination);
});

/**
 * Favorite filter
 */
favoriteFilterButton.addEventListener('click', () => {
  currentFilter = 'favorites';
  render(currentDeals, currentPagination);
});

/**
 * Sort select
 */
sortSelect.addEventListener('change', (event) => {
  currentSort = event.target.value;
  render(currentDeals, currentPagination);
});

/**
 * Listen for clicks on any favorite star (event delegation)
 * - toggles favorite in localStorage
 */
sectionDeals.addEventListener('click', (event) => {
  if (event.target.classList.contains('favorite-btn')) {
    const uuid = event.target.dataset.uuid;
    toggleFavorite(uuid);
  }
});

/**
 * Toggle a deal as favorite / remove from favorites
 */
const toggleFavorite = (uuid) => {
  if (favorites.includes(uuid)) {
    favorites = favorites.filter(f => f !== uuid);
  } else {
    favorites.push(uuid);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  // Re-render with updated star symbol
  render(currentDeals, currentPagination);
};

/**
 * On initial page load
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch first page with default size = 6
  const data = await fetchDeals(1, 6);

  setCurrentDeals(data);
  render(currentDeals, currentPagination);
});



