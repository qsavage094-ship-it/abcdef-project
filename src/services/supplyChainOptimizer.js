/**
 * Supply Chain & Logistics Optimization Engine
 * Model: LogixRoute-v1.8
 * Calculates vehicle assignment in kg, capacity utilization, route distance,
 * freight costs in ₹/kg, transit duration, and milestones.
 */

export const ROUTING_MODEL_VERSION = "LogixRoute-v1.8";

export const VEHICLE_FLEET = [
  {
    id: "mini_truck",
    name: "Micro Freight (Tata Ace / Mini Truck)",
    maxCapacityKg: 1500,
    baseCost: 800,
    perKmRate: 18,
    isReefer: false,
    speedKmh: 45
  },
  {
    id: "pickup",
    name: "Agri-Pickup (Mahindra Bolero Maxi)",
    maxCapacityKg: 3500,
    baseCost: 1400,
    perKmRate: 24,
    isReefer: false,
    speedKmh: 50
  },
  {
    id: "reefer_van",
    name: "Cold-Chain Reefer (Temperature Controlled 4°C-12°C)",
    maxCapacityKg: 4500,
    baseCost: 2800,
    perKmRate: 34,
    isReefer: true,
    speedKmh: 50
  },
  {
    id: "medium_truck",
    name: "Medium Freight (7.5 MT Eicher)",
    maxCapacityKg: 8000,
    baseCost: 3200,
    perKmRate: 42,
    isReefer: false,
    speedKmh: 55
  },
  {
    id: "heavy_freight",
    name: "Heavy Multi-Axle Carrier (16 MT Heavy Truck)",
    maxCapacityKg: 16000,
    baseCost: 6500,
    perKmRate: 65,
    isReefer: false,
    speedKmh: 50
  }
];

export const PRESET_ROUTES = [
  { origin: "Nashik, Maharashtra", destination: "Vashi APMC, Mumbai", distanceKm: 165, via: "NH160 Kasara Ghat Corridor" },
  { origin: "Kolar, Karnataka", destination: "Yeshwanthpur APMC, Bengaluru", distanceKm: 72, via: "NH75 National Highway" },
  { origin: "Ludhiana, Punjab", destination: "Azadpur Mandi, Delhi", distanceKm: 310, via: "NH44 GT Road Corridor" },
  { origin: "Pune (Narayangaon), Maharashtra", destination: "Surat Central Hub, Gujarat", distanceKm: 410, via: "NH48 Expressway" },
  { origin: "Indore, Madhya Pradesh", destination: "Bhopal Trading Yard", distanceKm: 195, via: "Indore-Bhopal State Corridor" },
  { origin: "Kurnool, Andhra Pradesh", destination: "Gaddiannaram Mandi, Hyderabad", distanceKm: 215, via: "NH44 Northbound" },
  { origin: "Agra, Uttar Pradesh", destination: "Okhla Wholesale Mandi, Delhi", distanceKm: 205, via: "Yamuna Expressway" }
];

export function optimizeLogistics({
  pickupLocation = "Nashik, Maharashtra",
  destination = "Vashi APMC, Mumbai",
  quantityKg = 2500,
  isPerishable = false
}) {
  let matchedRoute = PRESET_ROUTES.find(r => 
    (r.origin.toLowerCase().includes(pickupLocation.toLowerCase()) || pickupLocation.toLowerCase().includes(r.origin.toLowerCase())) &&
    (r.destination.toLowerCase().includes(destination.toLowerCase()) || destination.toLowerCase().includes(r.destination.toLowerCase()))
  );

  let distanceKm = matchedRoute ? matchedRoute.distanceKm : 140;
  let suggestedRoute = matchedRoute ? matchedRoute.via : `State Logistics Corridor connecting ${pickupLocation} and ${destination}`;

  let candidateVehicles = VEHICLE_FLEET.filter(v => v.maxCapacityKg >= quantityKg);
  if (isPerishable) {
    const reefer = VEHICLE_FLEET.find(v => v.isReefer && v.maxCapacityKg >= quantityKg);
    if (reefer) candidateVehicles = [reefer];
  }

  let selectedVehicle = candidateVehicles.length > 0 ? candidateVehicles[0] : VEHICLE_FLEET[VEHICLE_FLEET.length - 1];
  const capacityUtilization = Math.min(100, Math.round((quantityKg / selectedVehicle.maxCapacityKg) * 100));

  const baseFare = selectedVehicle.baseCost;
  const transitFare = Math.round(distanceKm * selectedVehicle.perKmRate);
  const loadingHandlingFee = Math.round(quantityKg * 0.20); // 20 paise per kg
  const totalFreightCost = baseFare + transitFare + loadingHandlingFee;
  const costPerKg = (totalFreightCost / (quantityKg || 1)).toFixed(2);

  const driveHours = distanceKm / selectedVehicle.speedKmh;
  const loadingHours = 1.5;
  const totalHours = Math.round((driveHours + loadingHours) * 10) / 10;
  
  let deliveryTimeFormatted = totalHours < 24 ? `${totalHours} Hours` : `${Math.round(totalHours / 24 * 10) / 10} Days`;

  const milestones = [
    { step: 1, label: "Order Accepted & Logistics Locked", status: "completed", timestamp: "Today, 08:30 AM" },
    { step: 2, label: `Vehicle Dispatched (${selectedVehicle.name})`, status: "completed", timestamp: "Today, 10:15 AM" },
    { step: 3, label: `Loading & Quality Verification at ${pickupLocation}`, status: "current", timestamp: "In Progress" },
    { step: 4, label: `Highway Transit via ${suggestedRoute}`, status: "upcoming", timestamp: `ETA in ${Math.round(driveHours)} hrs` },
    { step: 5, label: `Delivery & Unloading at ${destination}`, status: "upcoming", timestamp: "Final Destination" }
  ];

  return {
    modelName: ROUTING_MODEL_VERSION,
    pickupLocation,
    destination,
    orderQuantityKg: quantityKg,
    distanceKm,
    suggestedRoute,
    selectedVehicle,
    capacityUtilization,
    costBreakdown: {
      baseFare,
      transitFare,
      loadingHandlingFee,
      totalFreightCost,
      costPerKg
    },
    estimatedDeliveryTime: deliveryTimeFormatted,
    deliveryStatus: "Dispatched / Loading at Farm",
    milestones
  };
}
