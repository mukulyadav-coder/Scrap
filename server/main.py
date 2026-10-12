from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
import uuid
from datetime import datetime

from database import engine, get_db, Base
from models import (
    UserModel, 
    WasteListingModel, 
    OfferModel, 
    OrderModel, 
    IndicativeRateModel, 
    BulkRequirementModel, 
    VerificationRequestModel, 
    ComplaintModel
)
from schemas import (
    UserSchema, 
    WasteListingCreate, 
    OfferCreate, 
    SettleOrderRequest, 
    RateUpdate
)
from seed_data import seed_database

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Run seed on initial startup
db = next(get_db())
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="Kabadiwala Connect API",
    description="Modern 2026 digital circular economy marketplace connecting scrap sellers with verified local collectors and bulk aggregators.",
    version="2.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "app": "Kabadiwala Connect API",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# --- USERS & AUTH ---
@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(UserModel).all()

@app.get("/api/users/{role}")
def get_user_by_role(role: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.role == role).first()
    if not user:
        raise HTTPException(status_code=404, detail="Role user not found")
    return user

# --- INDICATIVE RATES ---
@app.get("/api/rates")
def get_rates(db: Session = Depends(get_db)):
    return db.query(IndicativeRateModel).all()

@app.put("/api/rates/{rate_id}")
def update_rate(rate_id: str, payload: RateUpdate, db: Session = Depends(get_db)):
    rate = db.query(IndicativeRateModel).filter(IndicativeRateModel.id == rate_id).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate not found")
    rate.min_price = payload.min_price
    rate.max_price = payload.max_price
    rate.last_updated = datetime.now().strftime("%d %b %Y, %I:%M %p")
    db.commit()
    return rate

# --- WASTE LISTINGS ---
@app.get("/api/listings")
def get_listings(category: str = None, status: str = None, db: Session = Depends(get_db)):
    query = db.query(WasteListingModel)
    if category and category != "all":
        query = query.filter(WasteListingModel.category == category)
    if status and status != "all":
        query = query.filter(WasteListingModel.status == status)
    
    listings = query.order_by(WasteListingModel.created_at.desc()).all()
    # parse photos JSON
    res = []
    for l in listings:
        d = l.__dict__.copy()
        try:
            d["photos"] = json.loads(l.photos)
        except Exception:
            d["photos"] = []
        res.append(d)
    return res

@app.post("/api/listings")
def create_listing(payload: WasteListingCreate, db: Session = Depends(get_db)):
    new_id = f"list_{uuid.uuid4().hex[:8]}"
    listing = WasteListingModel(
        id=new_id,
        seller_id=payload.seller_id,
        seller_name=payload.seller_name,
        seller_phone=payload.seller_phone,
        locality=payload.locality,
        address=payload.address,
        category=payload.category,
        subcategory=payload.subcategory,
        estimated_weight_kg=payload.estimated_weight_kg,
        condition=payload.condition,
        photos=json.dumps(payload.photos if payload.photos else ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500"]),
        preferred_slot=payload.preferred_slot,
        notes=payload.notes,
        is_ewaste=payload.is_ewaste,
        ewaste_compliance_accepted=payload.is_ewaste,
        status="pending",
        offers_count=0
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

# --- OFFERS ---
@app.get("/api/offers")
def get_offers(listing_id: str = None, db: Session = Depends(get_db)):
    query = db.query(OfferModel)
    if listing_id:
        query = query.filter(OfferModel.listing_id == listing_id)
    return query.order_by(OfferModel.created_at.desc()).all()

@app.post("/api/offers")
def create_offer(payload: OfferCreate, db: Session = Depends(get_db)):
    listing = db.query(WasteListingModel).filter(WasteListingModel.id == payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    new_id = f"off_{uuid.uuid4().hex[:8]}"
    offer = OfferModel(
        id=new_id,
        listing_id=payload.listing_id,
        buyer_id=payload.buyer_id,
        buyer_name=payload.buyer_name,
        buyer_role=payload.buyer_role,
        buyer_rating=payload.buyer_rating,
        buyer_distance_km=payload.buyer_distance_km,
        offered_rate_per_kg=payload.offered_rate_per_kg,
        total_estimated_amount=payload.total_estimated_amount,
        proposed_pickup_time=payload.proposed_pickup_time,
        note=payload.note,
        status="pending"
    )
    db.add(offer)
    listing.offers_count += 1
    db.commit()
    db.refresh(offer)
    return offer

@app.post("/api/offers/{offer_id}/accept")
def accept_offer(offer_id: str, db: Session = Depends(get_db)):
    offer = db.query(OfferModel).filter(OfferModel.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    listing = db.query(WasteListingModel).filter(WasteListingModel.id == offer.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    offer.status = "accepted"
    listing.status = "accepted"
    listing.accepted_offer_id = offer.id

    # Create scheduled order
    order_id = f"ord_{uuid.uuid4().hex[:8]}"
    order = OrderModel(
        id=order_id,
        listing_id=listing.id,
        seller_id=listing.seller_id,
        seller_name=listing.seller_name,
        seller_phone=listing.seller_phone,
        seller_address=listing.address,
        buyer_id=offer.buyer_id,
        buyer_name=offer.buyer_name,
        buyer_phone="+91 98712 34567",
        category=listing.category,
        subcategory=listing.subcategory,
        agreed_rate_per_kg=offer.offered_rate_per_kg,
        status="pickup_scheduled",
        payment_status="pending",
        scheduled_slot=offer.proposed_pickup_time,
        scheduled_date=datetime.now().strftime("%d %b %Y"),
        transaction_notes=offer.note or "Collector scheduled for doorstep visit.",
        receipt_number=f"KC-2026-ORD-{uuid.uuid4().hex[:4].upper()}"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

# --- ORDERS & SETTLEMENT ---
@app.get("/api/orders")
def get_orders(db: Session = Depends(get_db)):
    return db.query(OrderModel).order_by(OrderModel.created_at.desc()).all()

@app.post("/api/orders/{order_id}/settle")
def settle_order(order_id: str, payload: SettleOrderRequest, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    final_amt = round(payload.actual_weight_kg * order.agreed_rate_per_kg)
    order.actual_weight_kg = payload.actual_weight_kg
    order.final_amount = final_amt
    order.status = "completed"
    order.payment_status = payload.payment_status
    order.transaction_notes = payload.transaction_notes
    order.completed_at = datetime.utcnow()

    # Also update listing
    listing = db.query(WasteListingModel).filter(WasteListingModel.id == order.listing_id).first()
    if listing:
        listing.status = "completed"

    # Update seller and buyer green score
    seller = db.query(UserModel).filter(UserModel.id == order.seller_id).first()
    if seller:
        seller.green_score_kg += payload.actual_weight_kg
        seller.total_earnings_or_spend += final_amt
        seller.completed_pickups += 1

    buyer = db.query(UserModel).filter(UserModel.id == order.buyer_id).first()
    if buyer:
        buyer.green_score_kg += payload.actual_weight_kg
        buyer.completed_pickups += 1

    db.commit()
    db.refresh(order)
    return order

# --- BULK REQUIREMENTS ---
@app.get("/api/bulk-requirements")
def get_bulk_requirements(db: Session = Depends(get_db)):
    return db.query(BulkRequirementModel).all()

# --- VERIFICATION & COMPLAINTS ---
@app.get("/api/verifications")
def get_verifications(db: Session = Depends(get_db)):
    return db.query(VerificationRequestModel).all()

@app.post("/api/verifications/{vr_id}/review")
def review_verification(vr_id: str, status: str, db: Session = Depends(get_db)):
    vr = db.query(VerificationRequestModel).filter(VerificationRequestModel.id == vr_id).first()
    if not vr:
        raise HTTPException(status_code=404, detail="Verification request not found")
    vr.status = status
    db.commit()
    return vr

@app.get("/api/complaints")
def get_complaints(db: Session = Depends(get_db)):
    return db.query(ComplaintModel).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

