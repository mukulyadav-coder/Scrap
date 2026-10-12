# Kabadiwala Connect (कबाड़ीवाला कनेक्ट)
### Modern 2026 Digital Marketplace for Scrap, Recyclables & Circular Economy

**Kabadiwala Connect** is a 2026 startup-quality, mobile-first responsive web application connecting households, offices, and shops selling recyclable waste with verified local scrap collectors (kabadiwalas), wholesale aggregators, and pollution control board-certified recycling partners.

---

## 🌿 Key Innovations & Features

### 1. 2026 Fintech-Marketplace Design System
- **Colors**: Deep Forest Green (`#166534`), Emerald Green (`#10B981`), Clean White, and Light Mint (`#F0FDF4`).
- **Typography & Motion**: Plus Jakarta Sans & Inter, rounded cards, soft layered shadows (`shadow-soft`), smooth transitions.
- **Responsive Layout**: Desktop sidebar navigation and native mobile bottom bar navigation.
- **Bilingual Interface**: One-click instant toggle between **English** and **हिन्दी (Hindi)** across all actions, rates, and navigation.

### 2. Multi-Role Ecosystem with Instant Demo Switching
The header contains an instant 1-click **Role Switcher** allowing testers and judges to seamlessly experience all 4 personas:
1. **👤 Seller (Rahul Sharma - Green Park, New Delhi)**
   - Dashboard with Eco Footprint metrics (Trees saved, CO₂ diverted, earnings passbook).
   - Doorstep Scrap Selling form with photo gallery, category selector, estimated weight slider, and condition grading.
   - Separate **Regulated E-Waste** workflow with certified recycling partner compliance.
   - **Compare Offers**: Side-by-side comparison of quotes from nearby kabadiwalas (Price/kg, Distance, Rating, Pickup speed).
   - **Order Tracking**: Visual status stepper (*Pending → Accepted → Pickup Scheduled → Completed*).
   - **Digital Scrap Receipt**: Downloadable and printable GST/municipal compliance receipt with QR code and environmental impact score.
2. **🚴 Kabadiwala / Collector (Ramvilas Prasad - Hauz Khas / Malviya Nagar)**
   - Real-time **Nearby Scrap Feed** with radius filters (<1.5 km, <3 km, <5 km) and photos.
   - Direct quote submission (Custom ₹/kg quote, estimated total payout, proposed arrival time).
   - **High-Contrast Digital Weighing Screen**: Touch-friendly on-site scale weight entry, real-time settlement calculator, and demo payment status (Cash on delivery / UPI QR).
   - **Godown Inventory & Stockpile**: Track accumulated scrap categories, purchase costs, and ready-to-sell bulk bundles.
   - **Bulk Buyer Margin Arbitrage**: Compare industrial factory gate buying prices against local collection costs and freight to compute net margin.
3. **🏭 Bulk Buyer & Aggregator (Vikram Singhania - Apex Green Recyclers, Okhla)**
   - Industrial factory gate procurement desk.
   - Publish live buying rate cards with purity grades, minimum lot sizes (e.g. >500 kg), and delivery terms.
   - Sourcing analytics and weighbridge verification.
4. **🛡️ Platform Admin (Pooja Verma - Operations & Trust Hub)**
   - Master KPI metrics: Total GMV transacted, volume recycled, dispute rate.
   - **Verification Queue**: Review and approve/reject collector KYC documents (Aadhaar, Shop & Establishment, E-waste PCB licenses).
   - **Mandi Rates Master Card**: Edit and publish daily indicative benchmark rates from Mayapuri, Naraina, and Bawana mandi clusters.
   - **Dispute Resolution Desk**: Arbitrate weighing discrepancies, scale calibration audits, and record resolution notes.

---

## 🔄 Core End-to-End Workflow

```
[1. Seller creates listing] ──> [2. Nearby Kabadiwalas view feed] ──> [3. Kabadiwala submits quote]
                                                                                │
[6. Receipt Generated] <── [5. Weighing & Settle] <── [4. Seller accepts quote] <─┘
```

1. **Listing Creation**: Seller selects category (e.g. Cardboard), estimated weight (22 kg), preferred time, and posts listing.
2. **Offer Submission**: Collector in Malviya Nagar views listing 1.4 km away and offers ₹12.5/kg.
3. **Offer Acceptance**: Seller compares offers, accepts Ramvilas's quote, scheduling the pickup.
4. **On-Site Weighing**: Kabadiwala arrives, enters actual digital scale weight (e.g., 24.2 kg), selects payment method (Cash / UPI Demo), and confirms.
5. **Settlement & Voucher**: System automatically computes ₹302.50, credits user green score (+24.2 kg, ~33.8 kg CO₂ saved), updates godown inventory, and generates the printable Digital Scrap Certificate.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS, Lucide React.
- **Backend**: Python 3.13, FastAPI, SQLAlchemy, Pydantic, SQLite / PostgreSQL.
- **Architecture**: Modular, zero-dependency local execution with resilient offline-first localStorage state sync and FastAPI REST endpoints.

---

## 🚀 How to Run

### Option 1: Frontend (Client)
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 2: Backend (FastAPI Server)
```bash
cd server
python -m uvicorn main:app --port 8000 --reload
```
View interactive Swagger API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## ⚖️ Compliance & Disclaimers

- **Indicative Rates**: All mandi prices are benchmark market estimates for reference only. Mutually agreed rates are finalized during pickup.
- **E-Waste Rules 2022**: Electronic items are strictly routed to State Pollution Control Board (SPCB) certified recyclers.
- **Verified Demo Payments**: Financial transactions operate in labeled demo status; no real bank deductions occur.

