export interface Place {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude] for MapLibre
  description?: string;
  visitedDate?: string;
  category?: string;
}

const place = (
  id: string,
  name: string,
  city: string,
  country: string,
  coordinates: [number, number],
  category: string,
  description: string,
): Place => ({
  id,
  name,
  city,
  country,
  coordinates,
  description,
  category,
});

export const places: Place[] = [
  place("varanasi", "Varanasi", "Varanasi", "India", [82.9739, 25.3176], "Heritage", "A timeless city on the Ganges, known for its ghats and temples."),
  place("prayagraj", "Prayagraj", "Prayagraj", "India", [81.8463, 25.4358], "Heritage", "A historic city at the confluence of three rivers."),
  place("lucknow", "Lucknow", "Lucknow", "India", [80.9462, 26.8467], "City", "The elegant capital of Uttar Pradesh and Awadhi culture."),
  place("mathura-vrindavan", "Mathura & Vrindavan", "Mathura & Vrindavan", "India", [77.6737, 27.4924], "Heritage", "The historic Braj region, filled with temples and tradition."),
  place("new-delhi", "New Delhi", "New Delhi", "India", [77.209, 28.6139], "City", "India's capital, where historic landmarks meet modern city life."),
  place("agra", "Agra", "Agra", "India", [78.0081, 27.1767], "Heritage", "A historic Mughal city known for remarkable architectural heritage."),
  place("chandigarh", "Chandigarh", "Chandigarh", "India", [76.7794, 30.7333], "City", "A planned modern city at the Himalayan foothills."),
  place("mohali", "Mohali", "Mohali", "India", [76.7179, 30.7046], "City", "A growing city in the Chandigarh Tricity area."),
  place("jalandhar", "Jalandhar", "Jalandhar", "India", [75.5762, 31.326], "City", "A major city in Punjab's Doaba region."),
  place("phagwara", "Phagwara", "Phagwara", "India", [75.7733, 31.224], "City", "A city between Jalandhar and Ludhiana."),
  place("shimla", "Shimla", "Shimla", "India", [77.1734, 31.1048], "Mountains", "A Himalayan hill city with colonial architecture and mountain views."),
  place("solan", "Solan", "Solan", "India", [76.787, 30.9045], "Mountains", "A Himalayan town surrounded by pine-covered hills."),
  place("dharamshala", "Dharamshala", "Dharamshala", "India", [76.3234, 32.219], "Mountains", "A mountain destination in the Kangra Valley."),
  place("kangra", "Kangra", "Kangra", "India", [76.2691, 32.0998], "Mountains", "A historic town surrounded by the Kangra Valley."),
  place("chail", "Chail", "Chail", "India", [77.1656, 30.9646], "Mountains", "A quiet Himalayan hill station surrounded by forests."),
  place("kullu", "Kullu", "Kullu", "India", [77.1095, 31.9579], "Mountains", "A Himalayan valley along the Beas River."),
  place("manali", "Manali", "Manali", "India", [77.1892, 32.2396], "Mountains", "A mountain town surrounded by forests, rivers, and peaks."),
  place("mcleod-ganj", "McLeod Ganj", "McLeod Ganj", "India", [76.3234, 32.2426], "Mountains", "A hillside destination above Dharamshala."),
  place("ahmedabad", "Ahmedabad", "Ahmedabad", "India", [72.5714, 23.0225], "City", "A major Gujarati city combining heritage and modern life."),
  place("mumbai", "Mumbai", "Mumbai", "India", [72.8777, 19.076], "City", "India's energetic financial capital on the Arabian Sea."),
  place("bhopal", "Bhopal", "Bhopal", "India", [77.4126, 23.2599], "City", "The capital of Madhya Pradesh, known for its lakes."),
  place("jaipur", "Jaipur", "Jaipur", "India", [75.7873, 26.9124], "Heritage", "Rajasthan's Pink City, filled with forts and palaces."),
  place("jodhpur", "Jodhpur", "Jodhpur", "India", [73.0243, 26.2389], "Heritage", "The Blue City of Rajasthan, dominated by Mehrangarh Fort."),
  place("jaisalmer", "Jaisalmer", "Jaisalmer", "India", [70.9025, 26.9157], "Desert", "The Golden City rising from the Thar Desert."),
  place("kota", "Kota", "Kota", "India", [75.8648, 25.2138], "City", "A city on the Chambal River."),
  place("london", "London", "London", "United Kingdom", [-0.1276, 51.5072], "International", "A global city where history and modern life meet."),
  place("derbyshire", "Derbyshire", "Derbyshire", "United Kingdom", [-1.6, 53.1], "Countryside", "A scenic county known for countryside and the Peak District."),
  place("cornwall", "Cornwall", "Cornwall", "United Kingdom", [-5.1, 50.4], "Coast", "A dramatic coastal region in southwest England."),
  place("yorkshire", "Yorkshire", "Yorkshire", "United Kingdom", [-1.3, 53.9], "Countryside", "A northern region filled with historic cities and countryside."),
  place("southampton", "Southampton", "Southampton", "United Kingdom", [-1.4044, 50.9097], "Coast", "A historic port city on England's south coast."),
  place("manchester", "Manchester", "Manchester", "United Kingdom", [-2.2426, 53.4808], "International", "A major northern English city of culture and innovation."),
  place("leicester", "Leicester", "Leicester", "United Kingdom", [-1.1398, 52.6369], "International", "A diverse East Midlands city with layered history."),
  place("cardiff", "Cardiff", "Cardiff", "United Kingdom", [-3.1791, 51.4816], "International", "The capital of Wales."),
  place("edinburgh", "Edinburgh", "Edinburgh", "United Kingdom", [-3.1883, 55.9533], "International", "The capital of Scotland, known for its dramatic skyline."),
  place("dublin", "Dublin", "Dublin", "Ireland", [-6.2603, 53.3498], "International", "The capital of Ireland, blending history and modern life."),
  place("paris", "Paris", "Paris", "France", [2.3522, 48.8566], "International", "The French capital of art, architecture, and culture."),
  place("madrid", "Madrid", "Madrid", "Spain", [-3.7038, 40.4168], "International", "Spain's vibrant capital of culture and lively streets."),
  place("dubai", "Dubai", "Dubai", "United Arab Emirates", [55.2708, 25.2048], "International", "A Gulf city known for its skyline and coastline."),
];
