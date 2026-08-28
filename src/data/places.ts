export interface Place {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number];
  image: string;
  description?: string;
  visitedDate?: string;
  images?: string[];
  category?: string;
}

const imageFor = (query: string) =>
  `https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80&sig=${encodeURIComponent(query)}`;

export const places: Place[] = [
  { id: "varanasi", name: "Varanasi", city: "Varanasi", country: "India", coordinates: [82.9739, 25.3176], image: imageFor("varanasi"), description: "A historic city on the Ganges." },
  { id: "prayagraj", name: "Prayagraj", city: "Prayagraj", country: "India", coordinates: [81.8463, 25.4358], image: imageFor("prayagraj"), description: "A city at the meeting of three rivers." },
  { id: "lucknow", name: "Lucknow", city: "Lucknow", country: "India", coordinates: [80.9462, 26.8467], image: imageFor("lucknow"), description: "The capital of Uttar Pradesh." },
  { id: "mathura-vrindavan", name: "Mathura & Vrindavan", city: "Mathura and Vrindavan", country: "India", coordinates: [77.6737, 27.4924], image: imageFor("mathura-vrindavan"), description: "Twin heritage towns in the Braj region." },
  { id: "new-delhi", name: "New Delhi", city: "New Delhi", country: "India", coordinates: [77.209, 28.6139], image: imageFor("new-delhi"), description: "India's capital in the National Capital Region." },
  { id: "agra", name: "Agra", city: "Agra", country: "India", coordinates: [78.0081, 27.1767], image: imageFor("agra"), description: "A city known for its Mughal heritage." },
  { id: "chandigarh", name: "Chandigarh", city: "Chandigarh", country: "India", coordinates: [76.7794, 30.7333], image: imageFor("chandigarh"), description: "A planned city at the foothills of the Himalayas." },
  { id: "mohali", name: "Mohali", city: "Mohali", country: "India", coordinates: [76.7179, 30.7046], image: imageFor("mohali"), description: "A city in the Chandigarh Tricity area." },
  { id: "jalandhar", name: "Jalandhar", city: "Jalandhar", country: "India", coordinates: [75.5762, 31.326,], image: imageFor("jalandhar"), description: "A city in the Doaba region of Punjab." },
  { id: "phagwara", name: "Phagwara", city: "Phagwara", country: "India", coordinates: [75.7733, 31.224,], image: imageFor("phagwara"), description: "A city between Jalandhar and Ludhiana." },
  { id: "shimla", name: "Shimla", city: "Shimla", country: "India", coordinates: [77.1734, 31.1048], image: imageFor("shimla"), description: "A hill city in Himachal Pradesh." },
  { id: "solan", name: "Solan", city: "Solan", country: "India", coordinates: [76.787, 30.9045], image: imageFor("solan"), description: "A Himalayan town in Himachal Pradesh." },
  { id: "dharamshala", name: "Dharamshala", city: "Dharamshala", country: "India", coordinates: [76.3234, 32.219], image: imageFor("dharamshala"), description: "A mountain city in the Kangra Valley." },
  { id: "kangra", name: "Kangra", city: "Kangra", country: "India", coordinates: [76.2691, 32.0998], image: imageFor("kangra"), description: "A historic town in the Kangra Valley." },
  { id: "chail", name: "Chail", city: "Chail", country: "India", coordinates: [77.1656, 30.9646], image: imageFor("chail"), description: "A quiet hill station near Shimla." },
  { id: "kullu", name: "Kullu", city: "Kullu", country: "India", coordinates: [77.1095, 31.9579], image: imageFor("kullu"), description: "A valley town beside the Beas River." },
  { id: "manali", name: "Manali", city: "Manali", country: "India", coordinates: [77.1892, 32.2396], image: imageFor("manali"), description: "A mountain town in the upper Beas Valley." },
  { id: "mcleod-ganj", name: "McLeod Ganj", city: "McLeod Ganj", country: "India", coordinates: [76.3234, 32.2426], image: imageFor("mcleod-ganj"), description: "A hillside town above Dharamshala." },
  { id: "ahmedabad", name: "Ahmedabad", city: "Ahmedabad", country: "India", coordinates: [72.5714, 23.0225], image: imageFor("ahmedabad"), description: "A major city on the Sabarmati River." },
  { id: "mumbai", name: "Mumbai", city: "Mumbai", country: "India", coordinates: [72.8777, 19.076], image: imageFor("mumbai"), description: "A coastal city on India's western shore." },
  { id: "bhopal", name: "Bhopal", city: "Bhopal", country: "India", coordinates: [77.4126, 23.2599], image: imageFor("bhopal"), description: "The capital of Madhya Pradesh." },
  { id: "jaipur", name: "Jaipur", city: "Jaipur", country: "India", coordinates: [75.7873, 26.9124], image: imageFor("jaipur"), description: "The historic Pink City of Rajasthan." },
  { id: "jodhpur", name: "Jodhpur", city: "Jodhpur", country: "India", coordinates: [73.0243, 26.2389], image: imageFor("jodhpur"), description: "A historic city in the Thar region." },
  { id: "jaisalmer", name: "Jaisalmer", city: "Jaisalmer", country: "India", coordinates: [70.9025, 26.9157], image: imageFor("jaisalmer"), description: "The Golden City near the Thar Desert." },
  { id: "kota", name: "Kota", city: "Kota", country: "India", coordinates: [75.8648, 25.2138], image: imageFor("kota"), description: "A city on the Chambal River." },
  { id: "london", name: "London", city: "London", country: "United Kingdom", coordinates: [-0.1276, 51.5072], image: imageFor("london"), description: "The capital of the United Kingdom." },
  { id: "derbyshire", name: "Derbyshire", city: "Derbyshire", country: "United Kingdom", coordinates: [-1.6, 53.1], image: imageFor("derbyshire"), description: "A county in the East Midlands." },
  { id: "cornwall", name: "Cornwall", city: "Cornwall", country: "United Kingdom", coordinates: [-5.1, 50.4], image: imageFor("cornwall"), description: "A coastal county in southwest England." },
  { id: "yorkshire", name: "Yorkshire", city: "Yorkshire", country: "United Kingdom", coordinates: [-1.3, 53.9], image: imageFor("yorkshire"), description: "A historic region in northern England." },
  { id: "southampton", name: "Southampton", city: "Southampton", country: "United Kingdom", coordinates: [-1.4044, 50.9097], image: imageFor("southampton"), description: "A port city on the south coast of England." },
  { id: "manchester", name: "Manchester", city: "Manchester", country: "United Kingdom", coordinates: [-2.2426, 53.4808], image: imageFor("manchester"), description: "A major city in northwest England." },
  { id: "leicester", name: "Leicester", city: "Leicester", country: "United Kingdom", coordinates: [-1.1398, 52.6369], image: imageFor("leicester"), description: "A city in the East Midlands." },
  { id: "cardiff", name: "Cardiff", city: "Cardiff", country: "United Kingdom", coordinates: [-3.1791, 51.4816], image: imageFor("cardiff"), description: "The capital of Wales." },
  { id: "edinburgh", name: "Edinburgh", city: "Edinburgh", country: "United Kingdom", coordinates: [-3.1883, 55.9533], image: imageFor("edinburgh"), description: "The capital of Scotland." },
  { id: "dublin", name: "Dublin", city: "Dublin", country: "Ireland", coordinates: [-6.2603, 53.3498], image: imageFor("dublin"), description: "The capital of Ireland." },
  { id: "paris", name: "Paris", city: "Paris", country: "France", coordinates: [2.3522, 48.8566], image: imageFor("paris"), description: "The capital of France." },
  { id: "madrid", name: "Madrid", city: "Madrid", country: "Spain", coordinates: [-3.7038, 40.4168], image: imageFor("madrid"), description: "The capital of Spain." },
  { id: "dubai", name: "Dubai", city: "Dubai", country: "United Arab Emirates", coordinates: [55.2708, 25.2048], image: imageFor("dubai"), description: "A city on the Arabian Gulf." },
];
