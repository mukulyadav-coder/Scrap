import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  User, 
  WasteListing, 
  Offer, 
  Order, 
  IndicativeRate, 
  BulkRequirement, 
  InventoryItem, 
  VerificationRequest, 
  Complaint,
  OrderStatus,
  PaymentStatus,
  MaterialCategory,
  ListingCondition
} from '../types';
import { 
  mockUsers, 
  mockListings, 
  mockOffers, 
  mockOrders, 
  mockIndicativeRates, 
  mockInventory, 
  mockBulkRequirements, 
  mockVerificationRequests, 
  mockComplaints 
} from '../data/mockData';
import { translations, getTranslation } from '../utils/translations';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User;
  t: typeof translations.en;
  
  // Navigation / active view
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data collections
  listings: WasteListing[];
  offers: Offer[];
  orders: Order[];
  indicativeRates: IndicativeRate[];
  inventory: InventoryItem[];
  bulkRequirements: BulkRequirement[];
  verificationRequests: VerificationRequest[];
  complaints: Complaint[];

  // Notification / toast message
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Selected order for receipt viewing/printing
  selectedReceiptOrder: Order | null;
  setSelectedReceiptOrder: (order: Order | null) => void;

  // Core Transactional Actions
  createListing: (data: {
    category: MaterialCategory;
    subcategory: string;
    estimatedWeightKg: number;
    condition: ListingCondition;
    photos: string[];
    preferredSlot: string;
    notes?: string;
    isEwaste: boolean;
    locality: string;
    address: string;
  }) => WasteListing;

  submitOffer: (data: {
    listingId: string;
    offeredRatePerKg: number;
    proposedPickupTime: string;
    note?: string;
  }) => Offer;

  acceptOffer: (listingId: string, offerId: string) => Order | null;
  
  recordWeighingAndSettle: (params: {
    orderId: string;
    actualWeightKg: number;
    paymentStatus: PaymentStatus;
    transactionNotes?: string;
  }) => Order | null;

  publishBulkRequirement: (req: Omit<BulkRequirement, 'id' | 'buyerId' | 'buyerName' | 'companyName'>) => BulkRequirement;
  
  updateIndicativeRate: (rateId: string, minPrice: number, maxPrice: number) => void;
  
  reviewVerification: (id: string, status: 'approved' | 'rejected') => void;
  
  resolveComplaint: (id: string, notes: string) => void;

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'kc_app_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load role
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}role`);
    return (saved as UserRole) || 'seller';
  });

  // Load language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}lang`);
    return (saved as Language) || 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Entities state with localStorage persistence
  const [listings, setListings] = useState<WasteListing[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}listings`);
    return saved ? JSON.parse(saved) : mockListings;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}offers`);
    return saved ? JSON.parse(saved) : mockOffers;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
    return saved ? JSON.parse(saved) : mockOrders;
  });

  const [indicativeRates, setIndicativeRates] = useState<IndicativeRate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}rates`);
    return saved ? JSON.parse(saved) : mockIndicativeRates;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}inventory`);
    return saved ? JSON.parse(saved) : mockInventory;
  });

  const [bulkRequirements, setBulkRequirements] = useState<BulkRequirement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}bulk`);
    return saved ? JSON.parse(saved) : mockBulkRequirements;
  });

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}verification`);
    return saved ? JSON.parse(saved) : mockVerificationRequests;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}complaints`);
    return saved ? JSON.parse(saved) : mockComplaints;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}role`, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}lang`, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}listings`, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}offers`, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}rates`, JSON.stringify(indicativeRates));
  }, [indicativeRates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}bulk`, JSON.stringify(bulkRequirements));
  }, [bulkRequirements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}verification`, JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}complaints`, JSON.stringify(complaints));
  }, [complaints]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const currentUser = mockUsers[role] || mockUsers.seller;
  const t = getTranslation(language);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setActiveTab('dashboard');
    showToast(`Switched view to ${newRole.replace('_', ' ').toUpperCase()} role`, 'info');
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    showToast(newLang === 'hi' ? 'भाषा बदलकर हिन्दी की गई' : 'Language changed to English', 'info');
  };

  // 1. Seller creates listing
  const createListing = (data: {
    category: MaterialCategory;
    subcategory: string;
    estimatedWeightKg: number;
    condition: ListingCondition;
    photos: string[];
    preferredSlot: string;
    notes?: string;
    isEwaste: boolean;
    locality: string;
    address: string;
  }) => {
    const newListing: WasteListing = {
      id: `list_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: currentUser.phone,
      locality: data.locality || currentUser.locality,
      address: data.address || currentUser.address,
      category: data.category,
      subcategory: data.subcategory,
      estimatedWeightKg: data.estimatedWeightKg,
      condition: data.condition,
      photos: data.photos.length > 0 ? data.photos : [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=80'
      ],
      preferredSlot: data.preferredSlot,
      notes: data.notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      isEwaste: data.isEwaste,
      ewasteComplianceAccepted: data.isEwaste,
      offersCount: 0,
    };

    setListings(prev => [newListing, ...prev]);
    showToast('Listing published! Nearby collectors have been notified.', 'success');
    return newListing;
  };

  // 2. Collector / Buyer submits an offer
  const submitOffer = (data: {
    listingId: string;
    offeredRatePerKg: number;
    proposedPickupTime: string;
    note?: string;
  }) => {
    const targetListing = listings.find(l => l.id === data.listingId);
    const weight = targetListing ? targetListing.estimatedWeightKg : 20;
    const estTotal = data.offeredRatePerKg * weight;

    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      listingId: data.listingId,
      buyerId: currentUser.id,
      buyerName: currentUser.businessName || currentUser.name,
      buyerRole: role === 'bulk_buyer' ? 'bulk_buyer' : 'kabadiwala',
      buyerRating: currentUser.rating || 4.8,
      buyerDistanceKm: 1.2,
      offeredRatePerKg: data.offeredRatePerKg,
      totalEstimatedAmount: Math.round(estTotal),
      proposedPickupTime: data.proposedPickupTime,
      note: data.note,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOffers(prev => [newOffer, ...prev]);
    setListings(prev => prev.map(l => l.id === data.listingId ? { ...l, offersCount: l.offersCount + 1 } : l));
    showToast(`Offer of ₹${data.offeredRatePerKg}/kg submitted to seller!`, 'success');
    return newOffer;
  };

  // 3. Seller accepts an offer -> transitions listing to accepted & generates order
  const acceptOffer = (listingId: string, offerId: string): Order | null => {
    const listing = listings.find(l => l.id === listingId);
    const offer = offers.find(o => o.id === offerId);
    if (!listing || !offer) return null;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      listingId: listing.id,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      sellerPhone: listing.sellerPhone,
      sellerAddress: listing.address,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerPhone: '+91 98712 34567',
      category: listing.category,
      subcategory: listing.subcategory,
      agreedRatePerKg: offer.offeredRatePerKg,
      status: 'pickup_scheduled',
      paymentStatus: 'pending',
      scheduledSlot: offer.proposedPickupTime,
      scheduledDate: new Date().toLocaleDateString('en-GB'),
      transactionNotes: offer.note || 'Collector scheduled for doorstep visit.',
      receiptNumber: `KC-2026-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    setOffers(prev => prev.map(o => {
      if (o.listingId === listingId) {
        return o.id === offerId ? { ...o, status: 'accepted' } : { ...o, status: 'rejected' };
      }
      return o;
    }));

    setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: 'accepted', acceptedOfferId: offerId } : l));
    setOrders(prev => [newOrder, ...prev]);

    showToast(`Offer accepted! Pickup scheduled with ${offer.buyerName}.`, 'success');
    return newOrder;
  };

  // 4. Weighing & Settlement by Kabadiwala on arrival
  const recordWeighingAndSettle = (params: {
    orderId: string;
    actualWeightKg: number;
    paymentStatus: PaymentStatus;
    transactionNotes?: string;
  }): Order | null => {
    const targetOrder = orders.find(o => o.id === params.orderId);
    if (!targetOrder) return null;

    const finalAmount = Math.round(params.actualWeightKg * targetOrder.agreedRatePerKg);

    const updatedOrder: Order = {
      ...targetOrder,
      actualWeightKg: params.actualWeightKg,
      finalAmount,
      status: 'completed',
      paymentStatus: params.paymentStatus,
      completedAt: new Date().toISOString(),
      transactionNotes: params.transactionNotes || 'Weighed and verified on-site. Receipt generated.',
    };

    setOrders(prev => prev.map(o => o.id === params.orderId ? updatedOrder : o));

    // Update corresponding listing status to completed
    setListings(prev => prev.map(l => l.id === targetOrder.listingId ? { ...l, status: 'completed' } : l));

    // Update inventory in godown
    setInventory(prev => {
      const existing = prev.find(i => i.category === targetOrder.category);
      if (existing) {
        return prev.map(i => i.category === targetOrder.category ? {
          ...i,
          currentStockKg: i.currentStockKg + params.actualWeightKg,
          lastUpdated: new Date().toISOString().split('T')[0]
        } : i);
      } else {
        return [...prev, {
          id: `inv_${Date.now()}`,
          category: targetOrder.category,
          subcategory: targetOrder.subcategory,
          currentStockKg: params.actualWeightKg,
          avgPurchaseCostPerKg: targetOrder.agreedRatePerKg,
          lastUpdated: new Date().toISOString().split('T')[0]
        }];
      }
    });

    // Auto-select receipt for immediate viewing
    setSelectedReceiptOrder(updatedOrder);
    showToast(`Order settled! ₹${finalAmount} recorded. Digital receipt generated.`, 'success');
    return updatedOrder;
  };

  // 5. Bulk Buyer publishes requirement
  const publishBulkRequirement = (req: Omit<BulkRequirement, 'id' | 'buyerId' | 'buyerName' | 'companyName'>) => {
    const newReq: BulkRequirement = {
      ...req,
      id: `bulk_${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      companyName: currentUser.businessName || 'Industrial Recycler',
    };
    setBulkRequirements(prev => [newReq, ...prev]);
    showToast('Bulk procurement requirement published to regional collectors!', 'success');
    return newReq;
  };

  // 6. Admin updates indicative rates
  const updateIndicativeRate = (rateId: string, minPrice: number, maxPrice: number) => {
    setIndicativeRates(prev => prev.map(r => r.id === rateId ? {
      ...r,
      minPrice,
      maxPrice,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    } : r));
    showToast('Mandi benchmark rate card updated platform-wide.', 'success');
  };

  // 7. Admin reviews verification
  const reviewVerification = (id: string, status: 'approved' | 'rejected') => {
    setVerificationRequests(prev => prev.map(vr => vr.id === id ? { ...vr, status } : vr));
    showToast(`Verification request marked as ${status.toUpperCase()}.`, status === 'approved' ? 'success' : 'info');
  };

  // 8. Admin resolves complaints
  const resolveComplaint = (id: string, notes: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved', resolutionNotes: notes } : c));
    showToast('Grievance resolved and archived in compliance log.', 'success');
  };

  // 9. Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_PREFIX}listings`);
    localStorage.removeItem(`${STORAGE_PREFIX}offers`);
    localStorage.removeItem(`${STORAGE_PREFIX}orders`);
    localStorage.removeItem(`${STORAGE_PREFIX}rates`);
    localStorage.removeItem(`${STORAGE_PREFIX}inventory`);
    localStorage.removeItem(`${STORAGE_PREFIX}bulk`);
    localStorage.removeItem(`${STORAGE_PREFIX}verification`);
    localStorage.removeItem(`${STORAGE_PREFIX}complaints`);

    setListings(mockListings);
    setOffers(mockOffers);
    setOrders(mockOrders);
    setIndicativeRates(mockIndicativeRates);
    setInventory(mockInventory);
    setBulkRequirements(mockBulkRequirements);
    setVerificationRequests(mockVerificationRequests);
    setComplaints(mockComplaints);

    showToast('Demo data reset to default seed successfully.', 'info');
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      language,
      setLanguage,
      currentUser,
      t,
      activeTab,
      setActiveTab,
      listings,
      offers,
      orders,
      indicativeRates,
      inventory,
      bulkRequirements,
      verificationRequests,
      complaints,
      toast,
      showToast,
      selectedReceiptOrder,
      setSelectedReceiptOrder,
      createListing,
      submitOffer,
      acceptOffer,
      recordWeighingAndSettle,
      publishBulkRequirement,
      updateIndicativeRate,
      reviewVerification,
      resolveComplaint,
      resetDemoData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

