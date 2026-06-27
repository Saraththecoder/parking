// Indian Mock Data for Plantopark P2P Parking Marketplace

export const MOCK_USERS = [
  {
    id: "user-1",
    name: "Arjun Malhotra",
    email: "arjun@plantopark.in",
    role: "seeker", // seeker, owner, admin
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    vehicles: [
      { id: "v-1", number: "TS09CD9876", type: "Hatchback / Sedan", name: "White SUV (Fortuner)" },
      { id: "v-2", number: "KA03MJ4567", type: "SUV / Luxury", name: "Honda City (Grey)" }
    ],
    savedAddresses: [
      { id: "a-1", label: "Home", address: "Indiranagar, Bangalore" },
      { id: "a-2", label: "Office", address: "Hitech City, Hyderabad" }
    ],
    walletBalance: 1250
  },
  {
    id: "user-2",
    name: "Rajesh Kumar",
    email: "rajesh@plantopark.in",
    role: "owner",
    phone: "+91 99887 76655",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    walletBalance: 14580
  },
  {
    id: "user-3",
    name: "Rahul Sharma",
    email: "rahul@plantopark.in",
    role: "owner",
    phone: "+91 91234 56789",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    walletBalance: 3200
  },
  {
    id: "user-4",
    name: "Suresh Babu",
    email: "suresh@plantopark.in",
    role: "owner",
    phone: "+91 95555 44444",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    walletBalance: 800
  },
  {
    id: "user-5",
    name: "Plantopark Admin",
    email: "admin@plantopark.in",
    role: "admin",
    phone: "+91 90000 00000",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    walletBalance: 87500
  }
];

export const CITIES = [
  { id: "hyd", name: "Hyderabad", count: "3,200+ spots", image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600&auto=format&fit=crop&q=80" },
  { id: "blr", name: "Bangalore", count: "4,200+ spots", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80" },
  { id: "vja", name: "Vijayawada", count: "800+ spots", image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&auto=format&fit=crop&q=80" },
  { id: "tpt", name: "Tirupati", count: "650+ spots", image: "https://images.unsplash.com/photo-1627894129037-7f61c37b7d03?w=600&auto=format&fit=crop&q=80" }
];

export const MOCK_SPACES = [
  {
    id: "space-1",
    name: "Gated Community Spot - Indiranagar",
    city: "Bangalore",
    address: "12th Main, 4th Cross, Indiranagar, Bangalore",
    price: 45,
    rating: 4.8,
    reviewsCount: 124,
    distance: "0.5km away",
    hostId: "user-2",
    hostName: "Rajesh Kumar",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    hostExperience: "4 years experience",
    isVerified: true,
    isInstantBooking: false,
    parkingType: "Residential",
    vehicleTypes: ["Hatchback / Sedan", "2-Wheeler"],
    amenities: ["CCTV Surveillance", "Covered Parking", "24/7 Security"],
    images: [
      "/images/parking/gated_residential.png",
      "/images/parking/cellar_parking_ev.png"
    ],
    lat: 35, // local grid %
    lng: 40,
    description: "Premium secure parking spot located in a gated layout off 12th Main Indiranagar. Extremely safe, covered, and fits sedan/hatchback cars perfectly. Ideal for shopping or office hours.",
    rules: [
      "Only registered vehicles allowed",
      "No overnight parking unless booked in advance",
      "Maintain low speed on the driveway (< 10 km/h)"
    ],
    cancellationPolicy: "Free cancellation up to 1 hour before booking start time. Partial refund thereafter."
  },
  {
    id: "space-2",
    name: "Elite Tower Cellar Parking",
    city: "Bangalore",
    address: "80 Feet Road, HAL 2nd Stage, Indiranagar, Bangalore",
    price: 60,
    rating: 4.9,
    reviewsCount: 88,
    distance: "1.0km away",
    hostId: "user-2",
    hostName: "Rajesh Kumar",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    hostExperience: "4 years experience",
    isVerified: true,
    isInstantBooking: true,
    parkingType: "Commercial",
    vehicleTypes: ["Hatchback / Sedan", "SUV / Luxury", "2-Wheeler"],
    amenities: ["CCTV Surveillance", "Covered Parking", "EV Charging", "24/7 Security"],
    images: [
      "/images/parking/cellar_parking_ev.png",
      "/images/parking/commercial_basement.png"
    ],
    lat: 60,
    lng: 75,
    description: "Multi-level basement parking spot at Elite Corporate Hub, Indiranagar. Equipped with high-speed EV chargers and monitored 24/7 by physical guards and security cameras.",
    rules: [
      "Follow signage for Cellar Level-2 slot A-12",
      "EV Charging fees extra based on consumption",
      "No tailgating at the barrier gate"
    ],
    cancellationPolicy: "Non-refundable for instant booking cancellations made less than 2 hours in advance."
  },
  {
    id: "space-3",
    name: "Private Villa Driveway",
    city: "Bangalore",
    address: "10th Cross, Indiranagar, Bangalore",
    price: 35,
    rating: 4.6,
    reviewsCount: 42,
    distance: "1.2km away",
    hostId: "user-3",
    hostName: "Rahul Sharma",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    hostExperience: "2 years experience",
    isVerified: false,
    isInstantBooking: false,
    parkingType: "Residential",
    vehicleTypes: ["Hatchback / Sedan", "2-Wheeler"],
    amenities: ["Gated Entry", "Covered Parking"],
    images: [
      "/images/parking/driveway_villa.png",
      "/images/parking/gated_residential.png"
    ],
    lat: 25,
    lng: 30,
    description: "Clean driveway parking of a private bungalow in Bangalore. Very quiet and residential area. Perfect for visiting local cafes and restaurants on 100 Feet Road.",
    rules: [
      "Do not block the main bungalow gate",
      "Please park facing forward",
      "Keep the space clean"
    ],
    cancellationPolicy: "Free cancellation anytime before booking starts."
  },
  {
    id: "space-4",
    name: "Prestige Ivory Driveway",
    city: "Hyderabad",
    address: "Phase 1, Gachibowli, Hyderabad",
    price: 30,
    rating: 4.8,
    reviewsCount: 156,
    distance: "0.8km away",
    hostId: "user-3",
    hostName: "Rahul Sharma",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    hostExperience: "2 years experience",
    isVerified: true,
    isInstantBooking: false,
    parkingType: "Residential",
    vehicleTypes: ["Hatchback / Sedan", "SUV / Luxury", "2-Wheeler"],
    amenities: ["CCTV Surveillance", "24/7 Security", "Gated Entry"],
    images: [
      "/images/parking/open_complex.png",
      "/images/parking/driveway_villa.png"
    ],
    lat: 40,
    lng: 25,
    description: "Located near Gachibowli DLF Cyber City. Highly secure open-to-sky driveway inside Prestige residential complex. Guards verify all vehicles at the front gate.",
    rules: [
      "Present booking QR code to the gate guard",
      "Park in slot P-4 only"
    ],
    cancellationPolicy: "Standard policy: Free cancellation 2 hours before, 50% fee thereafter."
  },
  {
    id: "space-5",
    name: "DLF Cyber City P4",
    city: "Hyderabad",
    address: "Hitech City, Hyderabad - Opposite Cyber Towers",
    price: 45,
    rating: 4.5,
    reviewsCount: 312,
    distance: "1.2km away",
    hostId: "user-4",
    hostName: "Suresh Babu",
    hostAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    hostExperience: "5 years experience",
    isVerified: true,
    isInstantBooking: true,
    parkingType: "Commercial",
    vehicleTypes: ["Hatchback / Sedan", "SUV / Luxury"],
    amenities: ["CCTV Surveillance", "Covered Parking", "EV Charging", "24/7 Security"],
    images: [
      "/images/parking/commercial_basement.png",
      "/images/parking/cellar_parking_ev.png"
    ],
    lat: 55,
    lng: 45,
    description: "Secure Basement Parking in Hitech City, Hyderabad. Extremely close to tech parks, Cyber Towers, and Google offices. Fits all major SUVs like Creta, Harrier, and Fortuner.",
    rules: [
      "CCTV active 24/7",
      "No overnight parking unless booked",
      "Maintain low speed on ramp"
    ],
    cancellationPolicy: "Free cancellation before 1 hour of booking start time. Partial refund thereafter."
  },
  {
    id: "space-6",
    name: "Shanti Niwas Guest Parking",
    city: "Vijayawada",
    address: "Benz Circle, Vijayawada",
    price: 50,
    rating: 5.0,
    reviewsCount: 18,
    distance: "0.2km away",
    hostId: "user-4",
    hostName: "Suresh Babu",
    hostAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    hostExperience: "5 years experience",
    isVerified: true,
    isInstantBooking: true,
    parkingType: "Residential",
    vehicleTypes: ["Hatchback / Sedan", "2-Wheeler"],
    amenities: ["Covered Parking", "24/7 Security", "Gated Entry"],
    images: [
      "/images/parking/open_complex.png",
      "/images/parking/gated_residential.png"
    ],
    lat: 45,
    lng: 60,
    description: "Premium covered parking inside a private luxury residential building near Benz Circle, Vijayawada. Prime location, close to high-end retail shops.",
    rules: [
      "Park only in the designated spot 'Visitor P3'",
      "Keep music off while typing/entering property"
    ],
    cancellationPolicy: "Flexible cancellation."
  }
];

export const MOCK_REVIEWS = [
  {
    id: "rev-1",
    spaceId: "space-1",
    authorName: "Ananya R.",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    date: "September 2024",
    content: "Extremely convenient for my daily commute to Indiranagar. The spot is wide enough for my Fortuner, and the security guard is very helpful."
  },
  {
    id: "rev-2",
    spaceId: "space-1",
    authorName: "Suresh Babu",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 4,
    date: "August 2024",
    content: "Safe and reliable. Have been booking this spot twice a week for months now. Rajesh is a great host and very responsive."
  },
  {
    id: "rev-3",
    spaceId: "space-5",
    authorName: "Arjun Malhotra",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    date: "October 2024",
    content: "Absolute lifesaver near Cyber Towers! Clean, covered basement, and very easy to access. Will use daily."
  }
];

export const MOCK_BOOKINGS = [
  {
    id: "book-1024",
    spaceId: "space-1",
    spaceName: "Gated Community Spot - Indiranagar",
    spaceAddress: "12th Main, 4th Cross, Indiranagar, Bangalore",
    seekerId: "user-1",
    seekerName: "Arjun Malhotra",
    vehicleNumber: "TS09CD9876",
    vehicleType: "SUV / Luxury",
    vehicleName: "White SUV (Fortuner)",
    slot: "Slot A-24",
    date: "2024-10-24",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    durationHours: 3,
    subtotal: 135.0,
    serviceFee: 20.0,
    tax: 15.0,
    totalAmount: 170.0,
    status: "Active", // Pending, Active, Completed, Cancelled
    paymentMethod: "HDFC Bank Debit Card",
    hostId: "user-2",
    hostName: "Rajesh Kumar",
    createdAt: "2024-10-23T15:30:00Z"
  },
  {
    id: "book-1023",
    spaceId: "space-5",
    spaceName: "DLF Cyber City P4",
    spaceAddress: "Hitech City, Hyderabad - Opposite Cyber Towers",
    seekerId: "user-1",
    seekerName: "Arjun Malhotra",
    vehicleNumber: "TS09CD9876",
    vehicleType: "SUV / Luxury",
    vehicleName: "White SUV (Fortuner)",
    slot: "Slot B-12",
    date: "2024-10-22",
    startTime: "11:00 AM",
    endTime: "01:00 PM",
    durationHours: 2,
    subtotal: 90.0,
    serviceFee: 20.0,
    tax: 10.0,
    totalAmount: 120.0,
    status: "Completed",
    paymentMethod: "UPI Payment (GPay)",
    hostId: "user-4",
    hostName: "Suresh Babu",
    createdAt: "2024-10-22T09:15:00Z"
  }
];

export const MOCK_TRANSACTIONS = [
  { id: "tx-101", userId: "user-1", amount: 500, type: "deposit", description: "Added to wallet", date: "Oct 24, 2024, 10:15 AM", method: "UPI Payment" },
  { id: "tx-102", userId: "user-1", amount: -170, type: "payment", description: "Booked spot in Jubilee Hills", date: "Yesterday, 04:30 PM", method: "Wallet Balance" },
  { id: "tx-103", userId: "user-1", amount: -120, type: "payment", description: "Completed: Banjara Hills", date: "Oct 22, 2024, 11:00 AM", method: "Wallet Balance" },
  { id: "tx-104", userId: "user-2", amount: 153, type: "earnings", description: "Earnings from Book-1024", date: "Oct 24, 2024, 12:00 PM", method: "Direct Credit" }
];
