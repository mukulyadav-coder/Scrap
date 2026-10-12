from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime
from datetime import datetime
from database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    role = Column(String, nullable=False, index=True) # seller, kabadiwala, bulk_buyer, admin
    locality = Column(String, nullable=False)
    address = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    is_verified = Column(Boolean, default=True)
    green_score_kg = Column(Float, default=0.0)
    total_earnings_or_spend = Column(Float, default=0.0)
    business_name = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    rating = Column(Float, default=4.8)
    completed_pickups = Column(Integer, default=0)

class WasteListingModel(Base):
    __tablename__ = "waste_listings"

    id = Column(String, primary_key=True, index=True)
    seller_id = Column(String, nullable=False)
    seller_name = Column(String, nullable=False)
    seller_phone = Column(String, nullable=False)
    locality = Column(String, nullable=False)
    address = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True) # paper, cardboard, plastic, metal, e_waste
    subcategory = Column(String, nullable=False)
    estimated_weight_kg = Column(Float, nullable=False)
    condition = Column(String, default="clean_sorted")
    photos = Column(Text, default="[]") # JSON string
    preferred_slot = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String, default="pending", index=True) # pending, accepted, pickup_scheduled, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    is_ewaste = Column(Boolean, default=False)
    ewaste_compliance_accepted = Column(Boolean, default=False)
    offers_count = Column(Integer, default=0)
    accepted_offer_id = Column(String, nullable=True)

class OfferModel(Base):
    __tablename__ = "offers"

    id = Column(String, primary_key=True, index=True)
    listing_id = Column(String, nullable=False, index=True)
    buyer_id = Column(String, nullable=False)
    buyer_name = Column(String, nullable=False)
    buyer_role = Column(String, default="kabadiwala")
    buyer_rating = Column(Float, default=4.8)
    buyer_distance_km = Column(Float, default=1.2)
    offered_rate_per_kg = Column(Float, nullable=False)
    total_estimated_amount = Column(Float, nullable=False)
    proposed_pickup_time = Column(String, nullable=False)
    note = Column(Text, nullable=True)
    status = Column(String, default="pending") # pending, accepted, rejected
    created_at = Column(DateTime, default=datetime.utcnow)

class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    listing_id = Column(String, nullable=False)
    seller_id = Column(String, nullable=False)
    seller_name = Column(String, nullable=False)
    seller_phone = Column(String, nullable=False)
    seller_address = Column(String, nullable=False)
    buyer_id = Column(String, nullable=False)
    buyer_name = Column(String, nullable=False)
    buyer_phone = Column(String, nullable=False)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=False)
    agreed_rate_per_kg = Column(Float, nullable=False)
    actual_weight_kg = Column(Float, nullable=True)
    final_amount = Column(Float, nullable=True)
    status = Column(String, default="pickup_scheduled", index=True)
    payment_status = Column(String, default="pending") # pending, paid_cash_demo, paid_upi_demo
    scheduled_slot = Column(String, nullable=False)
    scheduled_date = Column(String, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    transaction_notes = Column(Text, nullable=True)
    receipt_number = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class IndicativeRateModel(Base):
    __tablename__ = "indicative_rates"

    id = Column(String, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    hindi_name = Column(String, nullable=False)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    unit = Column(String, default="₹ / kg")
    last_updated = Column(String, nullable=False)
    market_source = Column(String, nullable=False)
    trend = Column(String, default="stable")
    description = Column(Text, nullable=True)
    is_regulated = Column(Boolean, default=False)

class BulkRequirementModel(Base):
    __tablename__ = "bulk_requirements"

    id = Column(String, primary_key=True, index=True)
    buyer_id = Column(String, nullable=False)
    buyer_name = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=False)
    min_quantity_kg = Column(Float, nullable=False)
    offered_rate_per_kg = Column(Float, nullable=False)
    purity_grade = Column(String, nullable=False)
    locality = Column(String, nullable=False)
    valid_till = Column(String, nullable=False)
    notes = Column(Text, nullable=True)

class VerificationRequestModel(Base):
    __tablename__ = "verification_requests"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    business_name = Column(String, nullable=False)
    id_type = Column(String, nullable=False)
    id_number = Column(String, nullable=False)
    document_url = Column(String, nullable=False)
    status = Column(String, default="pending")
    submitted_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

class ComplaintModel(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True)
    order_id = Column(String, nullable=False)
    reported_by_user_id = Column(String, nullable=False)
    reported_by_name = Column(String, nullable=False)
    reported_role = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)
    resolution_notes = Column(Text, nullable=True)

