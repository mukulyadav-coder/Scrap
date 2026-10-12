import json
from sqlalchemy.orm import Session
from models import (
    UserModel, 
    IndicativeRateModel, 
    WasteListingModel, 
    OfferModel, 
    OrderModel, 
    BulkRequirementModel, 
    VerificationRequestModel, 
    ComplaintModel
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(UserModel).first():
        return

    # 1. Users
    users = [
        UserModel(
            id="user_seller_01",
            name="Rahul Sharma",
            phone="+91 98101 23456",
            email="rahul.sharma@example.com",
            role="seller",
            locality="Green Park, South Delhi",
            address="B-4/122, Safdarjung Enclave, New Delhi 110029",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            is_verified=True,
            green_score_kg=142.5,
            total_earnings_or_spend=3450.0,
            completed_pickups=6
        ),
        UserModel(
            id="user_kabadiwala_01",
            name="Ramvilas Prasad",
            business_name="Ramvilas Eco-Recyclers",
            phone="+91 98712 34567",
            email="ramvilas.scrap@gmail.com",
            role="kabadiwala",
            locality="Hauz Khas / Malviya Nagar",
            address="Shop 14, Near DDA Market, Hauz Khas Village, New Delhi",
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            is_verified=True,
            green_score_kg=3820.0,
            total_earnings_or_spend=84600.0,
            rating=4.8,
            completed_pickups=142
        ),
        UserModel(
            id="user_bulk_01",
            name="Vikram Singhania",
            business_name="Apex Green Recyclers Pvt Ltd",
            phone="+91 99110 98765",
            email="procurement@apexrecyclers.in",
            role="bulk_buyer",
            locality="Okhla Industrial Area Phase-II",
            address="Plot 88, Okhla Ind. Area Phase-II, New Delhi 110020",
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            is_verified=True,
            gst_number="07AAACA4591B1Z2",
            green_score_kg=28400.0,
            total_earnings_or_spend=620000.0,
            rating=4.9,
            completed_pickups=320
        ),
        UserModel(
            id="user_admin_01",
            name="Pooja Verma",
            business_name="Kabadiwala Connect Platform Operations",
            phone="+91 99999 11223",
            email="admin@kabadiwalaconnect.org",
            role="admin",
            locality="Central Operations Hub",
            address="Civic Centre, Minto Road, New Delhi 110002",
            avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
            is_verified=True,
            green_score_kg=125000.0,
            total_earnings_or_spend=2450000.0
        )
    ]
    db.add_all(users)

    # 2. Indicative Rates
    rates = [
        IndicativeRateModel(
            id="rate_newspaper",
            category="paper",
            name="Old Newspaper (Raddi)",
            hindi_name="पुराना अखबार (रद्दी)",
            min_price=14.0,
            max_price=16.0,
            unit="₹ / kg",
            last_updated="12 Oct 2026, 08:30 AM",
            market_source="Mayapuri & Shahdara Mandi Benchmark",
            trend="stable",
            description="Clean, dry newspapers and newsprint bundles. Highest recycling efficiency.",
            is_regulated=False
        ),
        IndicativeRateModel(
            id="rate_cardboard",
            category="cardboard",
            name="Corrugated Cardboard / Cartons",
            hindi_name="गत्ता एवं पैकिंग बॉक्स",
            min_price=10.0,
            max_price=13.0,
            unit="₹ / kg",
            last_updated="11 Oct 2026, 06:00 PM",
            market_source="Bawana Packaging Kraft Index",
            trend="down",
            description="Shipping cartons, e-commerce delivery boxes, flattened brown paperboard.",
            is_regulated=False
        ),
        IndicativeRateModel(
            id="rate_pet_bottles",
            category="plastic",
            name="PET Water & Beverage Bottles",
            hindi_name="PET प्लास्टिक की बोतलें",
            min_price=18.0,
            max_price=22.0,
            unit="₹ / kg",
            last_updated="12 Oct 2026, 07:15 AM",
            market_source="Mundka Plastic Recyclers Cluster",
            trend="up",
            description="Clear, crushed drink bottles without bottle caps or fluid residue.",
            is_regulated=False
        ),
        IndicativeRateModel(
            id="rate_iron",
            category="metal",
            name="Iron & Scrap Steel (Loha)",
            hindi_name="लोहा एवं स्टील कबाड़",
            min_price=28.0,
            max_price=32.0,
            unit="₹ / kg",
            last_updated="12 Oct 2026, 09:00 AM",
            market_source="Loha Mandi Naraina Industrial Area",
            trend="up",
            description="Rods, pipes, bicycle parts, grills, bed frames, sheet metal.",
            is_regulated=False
        ),
        IndicativeRateModel(
            id="rate_ewaste_devices",
            category="e_waste",
            name="Computer, Laptops & Mobile PCBs",
            hindi_name="कंप्यूटर, लैपटॉप व सर्किट बोर्ड",
            min_price=45.0,
            max_price=85.0,
            unit="₹ / kg (or unit rate)",
            last_updated="10 Oct 2026, 02:00 PM",
            market_source="Central Pollution Control Board (CPCB) Authorized Hub",
            trend="stable",
            description="Regulated electronic waste. Handled exclusively by certified recyclers.",
            is_regulated=True
        )
    ]
    db.add_all(rates)

    # 3. Waste Listings
    listings = [
        WasteListingModel(
            id="list_101",
            seller_id="user_seller_01",
            seller_name="Rahul Sharma",
            seller_phone="+91 98101 23456",
            locality="Green Park Extension",
            address="B-4/122, Safdarjung Enclave, New Delhi",
            category="paper",
            subcategory="Newspapers & Office Records",
            estimated_weight_kg=35.0,
            condition="clean_sorted",
            photos=json.dumps(["https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500"]),
            preferred_slot="Today, 4:00 PM - 6:00 PM",
            notes="Bundled with twine. Easy ground floor parking.",
            status="pending",
            offers_count=2,
            is_ewaste=False
        ),
        WasteListingModel(
            id="list_102",
            seller_id="user_seller_01",
            seller_name="Rahul Sharma",
            seller_phone="+91 98101 23456",
            locality="Green Park",
            address="B-4/122, Safdarjung Enclave, New Delhi",
            category="cardboard",
            subcategory="Appliance Cartons & Delivery Boxes",
            estimated_weight_kg=22.0,
            condition="clean_sorted",
            photos=json.dumps(["https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500"]),
            preferred_slot="Tomorrow morning 10:00 AM",
            notes="Flattened cartons from renovation.",
            status="accepted",
            offers_count=3,
            is_ewaste=False,
            accepted_offer_id="off_201"
        )
    ]
    db.add_all(listings)

    # 4. Offers
    offers = [
        OfferModel(
            id="off_201",
            listing_id="list_102",
            buyer_id="user_kabadiwala_01",
            buyer_name="Ramvilas Prasad (Eco-Recyclers)",
            buyer_role="kabadiwala",
            buyer_rating=4.8,
            buyer_distance_km=1.4,
            offered_rate_per_kg=12.5,
            total_estimated_amount=275.0,
            proposed_pickup_time="Tomorrow at 10:30 AM",
            note="Calibrated digital scale verified.",
            status="accepted"
        ),
        OfferModel(
            id="off_202",
            listing_id="list_101",
            buyer_id="user_kabadiwala_01",
            buyer_name="Ramvilas Prasad (Eco-Recyclers)",
            buyer_role="kabadiwala",
            buyer_rating=4.8,
            buyer_distance_km=1.4,
            offered_rate_per_kg=15.0,
            total_estimated_amount=525.0,
            proposed_pickup_time="Today at 5:00 PM",
            note="Can arrive within 30 minutes.",
            status="pending"
        )
    ]
    db.add_all(offers)

    # 5. Orders
    orders = [
        OrderModel(
            id="ord_301",
            listing_id="list_102",
            seller_id="user_seller_01",
            seller_name="Rahul Sharma",
            seller_phone="+91 98101 23456",
            seller_address="B-4/122, Safdarjung Enclave, New Delhi",
            buyer_id="user_kabadiwala_01",
            buyer_name="Ramvilas Prasad",
            buyer_phone="+91 98712 34567",
            category="cardboard",
            subcategory="Appliance Cartons",
            agreed_rate_per_kg=12.5,
            status="pickup_scheduled",
            payment_status="pending",
            scheduled_slot="Tomorrow, 10:30 AM",
            scheduled_date="2026-10-13",
            transaction_notes="Clean dry cardboard.",
            receipt_number="KC-2026-ORD-301"
        )
    ]
    db.add_all(orders)

    # 6. Bulk Requirements
    bulk = [
        BulkRequirementModel(
            id="bulk_401",
            buyer_id="user_bulk_01",
            buyer_name="Vikram Singhania",
            company_name="Apex Green Recyclers Pvt Ltd",
            category="cardboard",
            subcategory="Baled OCC Kraft Scrap",
            min_quantity_kg=500.0,
            offered_rate_per_kg=15.5,
            purity_grade="A-Grade Dry (<5% moisture)",
            locality="Okhla Industrial Area Phase-II",
            valid_till="2026-10-25"
        )
    ]
    db.add_all(bulk)

    db.commit()

