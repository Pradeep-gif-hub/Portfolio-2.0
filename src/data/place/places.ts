export interface Place {
  id?: string;
  _id?: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude] for MapLibre
  image?: string;
  imageUrl?: string;
  description?: string;
  visitedDate?: string;
  category?: string;
  order?: number;
}

const place = (
  id: string,
  name: string,
  city: string,
  country: string,
  coordinates: [number, number],
  category: string,
  description: string,
  image: string,
  visitedDate?: string
): Place => ({
  id,
  name,
  city,
  country,
  coordinates,
  category,
  description,
  image,
  imageUrl: image,
  visitedDate: visitedDate || 'Visited',
});

export const places: Place[] = [
  place(
    "varanasi",
    "Varanasi",
    "Varanasi",
    "India",
    [82.9739, 25.3176],
    "Heritage",
    "A timeless city on the Ganges, known for its ghats and temples.",
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "prayagraj",
    "Prayagraj",
    "Prayagraj",
    "India",
    [81.8463, 25.4358],
    "Heritage",
    "A historic city at the confluence of three holy rivers.",
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "lucknow",
    "Lucknow",
    "Lucknow",
    "India",
    [80.9462, 26.8467],
    "City",
    "The elegant capital of Uttar Pradesh, famed for its Awadhi architecture and culinary heritage.",
    "https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "mathura-vrindavan",
    "Mathura & Vrindavan",
    "Mathura & Vrindavan",
    "India",
    [77.6737, 27.4924],
    "Heritage",
    "The sacred Braj region, filled with historic temples, vibrant traditions, and serenity.",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "new-delhi",
    "New Delhi",
    "New Delhi",
    "India",
    [77.209, 28.6139],
    "City",
    "India's bustling capital, where centuries of historic monuments meet modern avenues.",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "agra",
    "Agra",
    "Agra",
    "India",
    [78.0081, 27.1767],
    "Heritage",
    "A world-renowned Mughal city crowned by the iconic Taj Mahal.",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "chandigarh",
    "Chandigarh",
    "Chandigarh",
    "India",
    [76.7794, 30.7333],
    "City",
    "A master-planned modern garden city nestled at the foothills of the Himalayas.",
    "https://images.unsplash.com/photo-1628149455678-16f37bc392f4?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "mohali",
    "Mohali",
    "Mohali",
    "India",
    [76.7179, 30.7046],
    "City",
    "A dynamic technological and sporting hub in the Chandigarh Tricity region.",
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "jalandhar",
    "Jalandhar",
    "Jalandhar",
    "India",
    [75.5762, 31.326],
    "City",
    "An ancient cultural city in Punjab's Doaba heartland.",
    "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80",
    "2022"
  ),
  place(
    "phagwara",
    "Phagwara",
    "Phagwara",
    "India",
    [75.7733, 31.224],
    "City",
    "A vibrant university city between Jalandhar and Ludhiana.",
    "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&auto=format&fit=crop&q=80",
    "2022"
  ),
  place(
    "shimla",
    "Shimla",
    "Shimla",
    "India",
    [77.1734, 31.1048],
    "Mountains",
    "The Queen of Hills with pine-clad mountain peaks and colonial charm.",
    "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "solan",
    "Solan",
    "Solan",
    "India",
    [76.787, 30.9045],
    "Mountains",
    "A tranquil Himalayan town surrounded by lush forests and hills.",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "dharamshala",
    "Dharamshala",
    "Dharamshala",
    "India",
    [76.3234, 32.219],
    "Mountains",
    "A scenic mountain destination beneath the majestic Dhauladhar range.",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "kangra",
    "Kangra",
    "Kangra",
    "India",
    [76.2691, 32.0998],
    "Mountains",
    "A historic valley town famed for ancient forts and tea gardens.",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "chail",
    "Chail",
    "Chail",
    "India",
    [77.1656, 30.9646],
    "Mountains",
    "A quiet Himalayan hill station surrounded by towering deodar forests.",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "kullu",
    "Kullu",
    "Kullu",
    "India",
    [77.1095, 31.9579],
    "Mountains",
    "The Valley of Gods, featuring pine valleys along the rushing Beas River.",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "manali",
    "Manali",
    "Manali",
    "India",
    [77.1892, 32.2396],
    "Mountains",
    "An alpine wonderland surrounded by snow-capped peaks and glaciers.",
    "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "mcleod-ganj",
    "McLeod Ganj",
    "McLeod Ganj",
    "India",
    [76.3234, 32.2426],
    "Mountains",
    "Little Lhasa in the Himalayas, home to the Dalai Lama and Tibetan culture.",
    "https://images.unsplash.com/photo-1582650625119-3a31f8418399?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "ahmedabad",
    "Ahmedabad",
    "Ahmedabad",
    "India",
    [72.5714, 23.0225],
    "City",
    "A UNESCO World Heritage city blending intricate stepwells and modern culture.",
    "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&auto=format&fit=crop&q=80",
    "2022"
  ),
  place(
    "mumbai",
    "Mumbai",
    "Mumbai",
    "India",
    [72.8777, 19.076],
    "City",
    "India's energetic coastal metropolis and city of dreams.",
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "bhopal",
    "Bhopal",
    "Bhopal",
    "India",
    [77.4126, 23.2599],
    "City",
    "The picturesque City of Lakes in central India.",
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80",
    "2022"
  ),
  place(
    "jaipur",
    "Jaipur",
    "Jaipur",
    "India",
    [75.7873, 26.9124],
    "Heritage",
    "Rajasthan's Pink City, filled with royal palaces, forts, and bazaars.",
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "jodhpur",
    "Jodhpur",
    "Jodhpur",
    "India",
    [73.0243, 26.2389],
    "Heritage",
    "The Blue City rising beneath the towering ramparts of Mehrangarh Fort.",
    "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "jaisalmer",
    "Jaisalmer",
    "Jaisalmer",
    "India",
    [70.9025, 26.9157],
    "Desert",
    "The Golden City rising like a mirage from the Thar Desert.",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
    "2023"
  ),
  place(
    "kota",
    "Kota",
    "Kota",
    "India",
    [75.8648, 25.2138],
    "City",
    "A historic riverside city along the banks of the Chambal River.",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    "2022"
  ),
  place(
    "london",
    "London",
    "London",
    "United Kingdom",
    [-0.1276, 51.5072],
    "International",
    "A world capital where historic landmarks meet modern innovation.",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "derbyshire",
    "Derbyshire",
    "Derbyshire",
    "United Kingdom",
    [-1.6, 53.1],
    "Countryside",
    "Rolling green hills, limestone dales, and the scenic Peak District.",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "cornwall",
    "Cornwall",
    "Cornwall",
    "United Kingdom",
    [-5.1, 50.4],
    "Coast",
    "Dramatic coastal cliffs, turquoise Atlantic waters, and golden beaches.",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "yorkshire",
    "Yorkshire",
    "Yorkshire",
    "United Kingdom",
    [-1.3, 53.9],
    "Countryside",
    "England's historic northern country of moors, valleys, and medieval cities.",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "southampton",
    "Southampton",
    "Southampton",
    "United Kingdom",
    [-1.4044, 50.9097],
    "Coast",
    "A historic maritime port city on England's southern coastline.",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "manchester",
    "Manchester",
    "Manchester",
    "United Kingdom",
    [-2.2426, 53.4808],
    "International",
    "A dynamic northern hub of music, football, and industrial innovation.",
    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "leicester",
    "Leicester",
    "Leicester",
    "United Kingdom",
    [-1.1398, 52.6369],
    "International",
    "A culturally rich and historic East Midlands city.",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "cardiff",
    "Cardiff",
    "Cardiff",
    "United Kingdom",
    [-3.1791, 51.4816],
    "International",
    "The vibrant capital of Wales, celebrated for its castle and waterfront bay.",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "edinburgh",
    "Edinburgh",
    "Edinburgh",
    "United Kingdom",
    [-3.1883, 55.9533],
    "International",
    "Scotland's dramatic capital with its hilltop castle and cobblestone Old Town.",
    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "dublin",
    "Dublin",
    "Dublin",
    "Ireland",
    [-6.2603, 53.3498],
    "International",
    "The lively Irish capital, renowned for its literary history and charm.",
    "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "paris",
    "Paris",
    "Paris",
    "France",
    [2.3522, 48.8566],
    "International",
    "The City of Light, synonymous with art, fashion, and romance.",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "madrid",
    "Madrid",
    "Madrid",
    "Spain",
    [-3.7038, 40.4168],
    "International",
    "Spain's sunlit capital of majestic plazas and vibrant boulevards.",
    "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
  place(
    "dubai",
    "Dubai",
    "Dubai",
    "United Arab Emirates",
    [55.2708, 25.2048],
    "International",
    "A futuristic desert metropolis known for luxury, architecture, and coastlines.",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80",
    "2024"
  ),
];

/**
 * Merges default static places with database places.
 * - If a DB place matches a default place (by ID or name-city), the DB place data (custom image, updated description) overrides the default.
 * - All remaining default places are retained.
 * - Any newly added DB places are prepended to the list.
 */
export const mergePlaces = (defaultList: Place[], dbList: Place[]): Place[] => {
  if (!dbList || dbList.length === 0) return defaultList;

  const normalizeKey = (p: Place) =>
    (p.id || `${p.name}-${p.city}`).toLowerCase().replace(/[^a-z0-9]/g, "-");

  const dbMap = new Map<string, Place>();
  const dbCustomPlaces: Place[] = [];

  dbList.forEach((p) => {
    const key = normalizeKey(p);
    dbMap.set(key, p);
  });

  const mergedDefaults = defaultList.map((defPlace) => {
    const key = normalizeKey(defPlace);
    if (dbMap.has(key)) {
      const dbItem = dbMap.get(key)!;
      return {
        ...defPlace,
        ...dbItem,
        _id: dbItem._id || defPlace._id,
        image: dbItem.image || dbItem.imageUrl || defPlace.image || defPlace.imageUrl,
        imageUrl: dbItem.imageUrl || dbItem.image || defPlace.imageUrl || defPlace.image,
      };
    }
    return defPlace;
  });

  // Find DB places that were not in defaultList
  const defaultKeys = new Set(defaultList.map(normalizeKey));
  dbList.forEach((dbItem) => {
    const key = normalizeKey(dbItem);
    if (!defaultKeys.has(key)) {
      dbCustomPlaces.push({
        ...dbItem,
        image: dbItem.image || dbItem.imageUrl,
        imageUrl: dbItem.imageUrl || dbItem.image,
      });
    }
  });

  return [...dbCustomPlaces, ...mergedDefaults];
};
