/**
 * Dynamic Crop Image Resolver
 * Provides authentic, high-resolution agricultural photography for all farmer crop categories:
 * Grains, Pulses, Cash Crops, Spices, Oilseeds, Plantation, Fruits, and Vegetables.
 */

const CROP_IMAGE_MAP = {
  // Grains & Cereals
  "basmati": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
  "rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
  "paddy": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80",
  "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
  "millet": "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=800&auto=format&fit=crop&q=80",
  "bajra": "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=800&auto=format&fit=crop&q=80",
  "corn": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80",
  "maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80",
  "barley": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
  "jowar": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
  "sorghum": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",

  // Pulses & Legumes
  "chickpea": "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800&auto=format&fit=crop&q=80",
  "chana": "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800&auto=format&fit=crop&q=80",
  "lentil": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
  "masoor": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
  "toor": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
  "arhar": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
  "moong": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&auto=format&fit=crop&q=80",
  "urad": "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800&auto=format&fit=crop&q=80",
  "soybean": "https://images.unsplash.com/photo-1599307767316-776533da8b27?w=800&auto=format&fit=crop&q=80",
  "soy": "https://images.unsplash.com/photo-1599307767316-776533da8b27?w=800&auto=format&fit=crop&q=80",

  // Cash & Commercial Crops
  "cotton": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80",
  "sugarcane": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80",
  "jute": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80",
  "rubber": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
  "tobacco": "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=800&auto=format&fit=crop&q=80",

  // Spices & Aromatics
  "turmeric": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80",
  "haldi": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop&q=80",
  "pepper": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
  "cardamom": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
  "elaichi": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
  "chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
  "chili": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
  "mirchi": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
  "ginger": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
  "adrak": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
  "cumin": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
  "jeera": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
  "coriander": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80",
  "dhaniya": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80",
  "garlic": "https://images.unsplash.com/photo-1615477039956-1144f8007dc4?w=800&auto=format&fit=crop&q=80",
  "lahsun": "https://images.unsplash.com/photo-1615477039956-1144f8007dc4?w=800&auto=format&fit=crop&q=80",

  // Oilseeds
  "mustard": "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80",
  "sarson": "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80",
  "groundnut": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800&auto=format&fit=crop&q=80",
  "peanut": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800&auto=format&fit=crop&q=80",
  "sunflower": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80",
  "sesame": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",
  "til": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80",

  // Plantation & Forestry
  "tea": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
  "chai": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
  "coffee": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
  "coconut": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&auto=format&fit=crop&q=80",
  "nariyal": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&auto=format&fit=crop&q=80",
  "areca": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&auto=format&fit=crop&q=80",
  "supari": "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&auto=format&fit=crop&q=80",

  // Fruits & Orchards
  "mango": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
  "aam": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
  "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
  "seb": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
  "orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=80",
  "santra": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&auto=format&fit=crop&q=80",
  "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
  "kela": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
  "pomegranate": "https://images.unsplash.com/photo-1615485290176-599971842eb4?w=800&auto=format&fit=crop&q=80",
  "anar": "https://images.unsplash.com/photo-1615485290176-599971842eb4?w=800&auto=format&fit=crop&q=80",
  "guava": "https://images.unsplash.com/photo-1536511135897-4001b960b719?w=800&auto=format&fit=crop&q=80",
  "amrood": "https://images.unsplash.com/photo-1536511135897-4001b960b719?w=800&auto=format&fit=crop&q=80",
  "papaya": "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=800&auto=format&fit=crop&q=80",
  "watermelon": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
  "grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80",

  // Vegetables & Daily Produce
  "tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
  "tamatar": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
  "onion": "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80",
  "pyaz": "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80",
  "shallot": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
  "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
  "aloo": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
  "okra": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&auto=format&fit=crop&q=80",
  "bhindi": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&auto=format&fit=crop&q=80",
  "spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80",
  "palak": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80",
  "cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80",
  "gobi": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80",
  "cabbage": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&auto=format&fit=crop&q=80",
  "carrot": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
  "gajar": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
  "eggplant": "https://images.unsplash.com/photo-1628773822503-930a84d41235?w=800&auto=format&fit=crop&q=80",
  "brinjal": "https://images.unsplash.com/photo-1628773822503-930a84d41235?w=800&auto=format&fit=crop&q=80",
  "baingan": "https://images.unsplash.com/photo-1628773822503-930a84d41235?w=800&auto=format&fit=crop&q=80",
  "capsicum": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80",
  "shimla": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80",
  "peas": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&auto=format&fit=crop&q=80",
  "matar": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&auto=format&fit=crop&q=80"
};

// Realistic fallback for unique crops
const DEFAULT_AGRI_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80";

/**
 * Resolves a realistic agricultural photo URL based on crop name.
 * @param {string} cropName - Name of the crop entered or selected
 * @returns {string} - Image URL
 */
export function resolveCropImage(cropName = "") {
  const clean = (cropName || "").trim().toLowerCase();
  if (!clean) return DEFAULT_AGRI_IMAGE;

  for (const [key, url] of Object.entries(CROP_IMAGE_MAP)) {
    if (clean.includes(key)) {
      return url;
    }
  }

  return DEFAULT_AGRI_IMAGE;
}
