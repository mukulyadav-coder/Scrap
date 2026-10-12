const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`);
    return res.json();
  },

  async getRates() {
    const res = await fetch(`${API_BASE_URL}/rates`);
    return res.json();
  },

  async updateRate(rateId: string, minPrice: number, maxPrice: number) {
    const res = await fetch(`${API_BASE_URL}/rates/${rateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ min_price: minPrice, max_price: maxPrice }),
    });
    return res.json();
  },

  async getListings() {
    const res = await fetch(`${API_BASE_URL}/listings`);
    return res.json();
  },

  async createListing(listingData: any) {
    const res = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });
    return res.json();
  },

  async getOffers(listingId?: string) {
    const url = listingId ? `${API_BASE_URL}/offers?listing_id=${listingId}` : `${API_BASE_URL}/offers`;
    const res = await fetch(url);
    return res.json();
  },

  async createOffer(offerData: any) {
    const res = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData),
    });
    return res.json();
  },

  async acceptOffer(offerId: string) {
    const res = await fetch(`${API_BASE_URL}/offers/${offerId}/accept`, {
      method: 'POST',
    });
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return res.json();
  },

  async settleOrder(orderId: string, data: { actual_weight_kg: number; payment_status: string; transaction_notes?: string }) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

