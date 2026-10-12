from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserSchema(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    role: str
    locality: str
    address: str
    avatar: Optional[str] = None
    is_verified: bool = True
    green_score_kg: float = 0.0
    total_earnings_or_spend: float = 0.0
    business_name: Optional[str] = None
    gst_number: Optional[str] = None
    rating: Optional[float] = 4.8
    completed_pickups: Optional[int] = 0

    class Config:
        from_attributes = True

class WasteListingCreate(BaseModel):
    seller_id: str
    seller_name: str
    seller_phone: str
    locality: str
    address: str
    category: str
    subcategory: str
    estimated_weight_kg: float
    condition: str = "clean_sorted"
    photos: List[str] = []
    preferred_slot: str
    notes: Optional[str] = None
    is_ewaste: bool = False

class OfferCreate(BaseModel):
    listing_id: str
    buyer_id: str
    buyer_name: str
    buyer_role: str = "kabadiwala"
    buyer_rating: float = 4.8
    buyer_distance_km: float = 1.2
    offered_rate_per_kg: float
    total_estimated_amount: float
    proposed_pickup_time: str
    note: Optional[str] = None

class SettleOrderRequest(BaseModel):
    actual_weight_kg: float
    payment_status: str
    transaction_notes: Optional[str] = None

class RateUpdate(BaseModel):
    min_price: float
    max_price: float

