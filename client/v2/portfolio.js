'use strict';

////////////////////////////////////////////////////////////////////////////////
// Global variables
////////////////////////////////////////////////////////////////////////////////

let currentDeals = [];
let currentPagination = {};
let currentFilter = null;
let currentSort = 'price-asc';
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Selectors
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

////////////////////////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////////////////////////

const setActiveButton = (button, isActive) => {
  const allButtons = [bestDiscountButton, mostCommentedButton, hotDealsButton, favoriteFilterButton];
  allButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.style.backgroundColor = '';
  });
  
  if (isActive) {
    button.classList.add('active');
    button.style.backgroundColor = '#e0e0e0';
  }
};

const toggleFilter = (filterType, button) => {
  if (currentFilter === filterType) {
    currentFilter = null;
    setActiveButton(button, false);
  } else {
    currentFilter = filterType;
    setActiveButton(button, true);
  }
  render(currentDeals, currentPagination);
};

////////////////////////////////////////////////////////////////////////////////
// Core Functions
////////////////////////////////////////////////////////////////////////////////

const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

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
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

const fetchSales = async (id) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${id}`);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return [];
    }
    return body.data.result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

////////////////////////////////////////////////////////////////////////////////
// Render Functions
////////////////////////////////////////////////////////////////////////////////

const renderDeals = (deals) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  const template = deals
    .map(deal => {
      const isFavorite = favorites.includes(deal.uuid) ? '★' : '☆';
      const datePosted = new Date(deal.postedAt).toLocaleDateString();
      
      return `
        <div class="deal ${deal.discount > 50 ? 'high-discount' : ''}" id="${deal.uuid}">
          <div class="deal-header">
            <span class="deal-id">ID: ${deal.id}</span>
            <button class="favorite-btn" data-uuid="${deal.uuid}">${isFavorite}</button>
          </div>
          <div class="deal-body">
            <a href="${deal.link}" target="_blank">${deal.title}</a>
            <div class="deal-info">
              <span class="price">Price: ${deal.price}€</span>
              <span class="discount ${deal.discount > 50 ? 'high' : ''}">${deal.discount || 0}% OFF</span>
              <span class="comments">💬 ${deal.commentsCount || 0}</span>
              <span class="temperature">🌡️ ${deal.temperature || 0}</span>
              <span class="date">📅 ${datePosted}</span>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  
  sectionDeals.innerHTML = `
    <h2>Deals ${currentFilter ? `(${currentFilter})` : ''}</h2>
    ${deals.length === 0 ? '<p>No deals found matching the current filter.</p>' : ''}
  `;
  sectionDeals.appendChild(fragment);
};

const renderPagination = (pagination) => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {length: pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const getIdsFromDeals = (deals) => {
  const ids = deals.map(d => d.id);
  return Array.from(new Set(ids)).sort();
};

const renderLegoSetIds = (deals) => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => `<option value="${id}">${id}</option>`).join('');
  selectLegoSetIds.innerHTML = `<option value="">-- select an ID --</option>` + options;
};

const renderIndicators = (pagination) => {
  const {count} = pagination;
  spanNbDeals.innerHTML = count;
};

////////////////////////////////////////////////////////////////////////////////
// Filter and Sort Functions
////////////////////////////////////////////////////////////////////////////////

const applyFilters = (deals) => {
  if (!currentFilter) return deals;
  
  const filterConfigs = {
    'best-discount': deal => (deal.discount || 0) > 50,
    'most-commented': deal => (deal.commentsCount || 0) > 15,
    'hot-deals': deal => (deal.temperature || 0) > 100,
    'favorites': deal => favorites.includes(deal.uuid)
  };

  return deals.filter(filterConfigs[currentFilter] || (() => true));
};

const applySort = (deals, sortValue) => {
  const sorted = [...deals];

  switch (sortValue) {
    case 'price-asc':
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-desc':
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'date-asc':
      sorted.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
      break;
    case 'date-desc':
      sorted.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      break;
  }

  return sorted;
};

const render = (deals, pagination) => {
  let filteredDeals = applyFilters(deals);
  filteredDeals = applySort(filteredDeals, currentSort);
  
  renderDeals(filteredDeals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals);
};

////////////////////////////////////////////////////////////////////////////////
// Sales Functions
////////////////////////////////////////////////////////////////////////////////

const computeSalesStats = (sales) => {
  if (!sales.length) {
    return { count: 0, p5: 0, p25: 0, p50: 0, avg: 0, lifetime: 0 };
  }

  const prices = sales.map(s => s.price).sort((a, b) => a - b);
  const count = prices.length;
  const p5 = prices[Math.floor(0.05 * count)] || 0;
  const p25 = prices[Math.floor(0.25 * count)] || 0;
  const p50 = prices[Math.floor(0.50 * count)] || 0;
  const avg = prices.reduce((acc, val) => acc + val, 0) / count;

  const dates = sales.map(s => new Date(s.dateSold)).sort((a, b) => a - b);
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];
  const differenceInDays = Math.round((maxDate - minDate) / (1000 * 3600 * 24));

  return { count, p5, p25, p50, avg, lifetime: differenceInDays };
};

const renderSales = (sales) => {
  const stats = computeSalesStats(sales);

  nbSalesSpan.textContent = stats.count;
  p5ValueSpan.textContent = stats.p5;
  p25ValueSpan.textContent = stats.p25;
  p50ValueSpan.textContent = stats.p50;
  avgValueSpan.textContent = stats.avg.toFixed(2);
  lifetimeValueSpan.textContent = stats.lifetime;

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
// Event Listeners
////////////////////////////////////////////////////////////////////////////////

selectShow.addEventListener('change', async (event) => {
  const size = parseInt(event.target.value);
  const page = currentPagination.currentPage || 1;
  const data = await fetchDeals(page, size);

  setCurrentDeals(data);
  render(currentDeals, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const selectedPage = parseInt(event.target.value);
  const size = currentPagination.pageSize || 6;

  const data = await fetchDeals(selectedPage, size);
  setCurrentDeals(data);
  render(currentDeals, currentPagination);
});

selectLegoSetIds.addEventListener('change', async (event) => {
  const legoSetId = event.target.value;
  if (!legoSetId) {
    renderSales([]);
    return;
  }
  const sales = await fetchSales(legoSetId);
  renderSales(sales);
});

bestDiscountButton.addEventListener('click', () => {
  toggleFilter('best-discount', bestDiscountButton);
});

mostCommentedButton.addEventListener('click', () => {
  toggleFilter('most-commented', mostCommentedButton);
});

hotDealsButton.addEventListener('click', () => {
  toggleFilter('hot-deals', hotDealsButton);
});

favoriteFilterButton.addEventListener('click', () => {
  toggleFilter('favorites', favoriteFilterButton);
});

sortSelect.addEventListener('change', (event) => {
  currentSort = event.target.value;
  render(currentDeals, currentPagination);
});

sectionDeals.addEventListener('click', (event) => {
  if (event.target.classList.contains('favorite-btn')) {
    const uuid = event.target.dataset.uuid;
    if (favorites.includes(uuid)) {
      favorites = favorites.filter(f => f !== uuid);
    } else {
      favorites.push(uuid);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    render(currentDeals, currentPagination);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchDeals(1, 6);
  setCurrentDeals(data);
  render(currentDeals, currentPagination);
});