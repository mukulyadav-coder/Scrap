export type UserRole = 'seller' | 'kabadiwala' | 'bulk_buyer' | 'admin';

export type Language = 'en' | 'hi';

export type MaterialCategory = 'paper' | 'cardboard' | 'plastic' | 'metal' | 'e_waste';

export type ListingCondition = 'clean_sorted' | 'mixed' | 'unsegregated';

export type OrderStatus = 'pending' | 'accepted' | 'pickup_scheduled' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid_cash_demo' | 'paid_upi_demo' | 'failed';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  locality: string;
  address: string;
  avatar?: string;
  isVerified: boolean;
  greenScoreKg: number;
  totalEarningsOrSpend: number;
  businessName?: string;
  gstNumber?: string;
  rating?: number;
  completedPickups?: number;
}

export interface WasteListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  locality: string;
  address: string;
  category: MaterialCategory;
  subcategory: string;
  estimatedWeightKg: number;
  condition: ListingCondition;
  photos: string[];
  preferredSlot: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  isEwaste: boolean;
  ewasteComplianceAccepted?: boolean;
  offersCount: number;
  acceptedOfferId?: string;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerRole: 'kabadiwala' | 'bulk_buyer';
  buyerRating: number;
  buyerDistanceKm: number;
  offeredRatePerKg: number;
  totalEstimatedAmount: number;
  proposedPickupTime: string;
  note?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  category: MaterialCategory;
  subcategory: string;
  agreedRatePerKg: number;
  actualWeightKg?: number;
  finalAmount?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  scheduledSlot: string;
  scheduledDate: string;
  completedAt?: string;
  transactionNotes?: string;
  receiptNumber?: string;
  createdAt: string;
}

export interface IndicativeRate {
  id: string;
  category: MaterialCategory;
  name: string;
  hindiName: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  lastUpdated: string;
  marketSource: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  isRegulated: boolean;
}

export interface BulkRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  companyName: string;
  category: MaterialCategory;
  subcategory: string;
  minQuantityKg: number;
  offeredRatePerKg: number;
  purityGrade: string;
  locality: string;
  validTill: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  category: MaterialCategory;
  subcategory: string;
  currentStockKg: number;
  avgPurchaseCostPerKg: number;
  lastUpdated: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  businessName: string;
  idType: 'Aadhaar' | 'GSTIN' | 'Shop License' | 'E-Waste PCB License';
  idNumber: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  orderId: string;
  reportedByUserId: string;
  reportedByName: string;
  reportedRole: UserRole;
  reason: string;
  details: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolutionNotes?: string;
}

