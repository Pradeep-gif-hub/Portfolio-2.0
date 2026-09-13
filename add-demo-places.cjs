const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

// Try to load .env.local first, then .env
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envLocalPath)) {
    require('dotenv').config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config();
}

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ Error: MONGODB_URI is not set in .env file');
    console.log('\nPlease ensure your .env file contains:');
    console.log('MONGODB_URI=your_mongodb_connection_string');
    process.exit(1);
}

const demoPlaces = [
    { name: "Varanasi", city: "Varanasi", country: "India", coordinates: [82.9739, 25.3176], category: "Heritage", description: "A timeless city on the Ganges, known for its ghats and temples.", order: 1 },
    { name: "Prayagraj", city: "Prayagraj", country: "India", coordinates: [81.8463, 25.4358], category: "Heritage", description: "A historic city at the confluence of three rivers.", order: 2 },
    { name: "Lucknow", city: "Lucknow", country: "India", coordinates: [80.9462, 26.8467], category: "City", description: "The elegant capital of Uttar Pradesh and Awadhi culture.", order: 3 },
    { name: "Mathura & Vrindavan", city: "Mathura & Vrindavan", country: "India", coordinates: [77.6737, 27.4924], category: "Heritage", description: "The historic Braj region, filled with temples and tradition.", order: 4 },
    { name: "New Delhi", city: "New Delhi", country: "India", coordinates: [77.209, 28.6139], category: "City", description: "India's capital, where historic landmarks meet modern city life.", order: 5 },
    { name: "Agra", city: "Agra", country: "India", coordinates: [78.0081, 27.1767], category: "Heritage", description: "A historic Mughal city known for remarkable architectural heritage.", order: 6 },
    { name: "Chandigarh", city: "Chandigarh", country: "India", coordinates: [76.7794, 30.7333], category: "City", description: "A planned modern city at the Himalayan foothills.", order: 7 },
    { name: "Mohali", city: "Mohali", country: "India", coordinates: [76.7179, 30.7046], category: "City", description: "A growing city in the Chandigarh Tricity area.", order: 8 },
    { name: "Jalandhar", city: "Jalandhar", country: "India", coordinates: [75.5762, 31.326], category: "City", description: "A major city in Punjab's Doaba region.", order: 9 },
    { name: "Phagwara", city: "Phagwara", country: "India", coordinates: [75.7733, 31.224], category: "City", description: "A city between Jalandhar and Ludhiana.", order: 10 },
    { name: "Shimla", city: "Shimla", country: "India", coordinates: [77.1734, 31.1048], category: "Mountains", description: "A Himalayan hill city with colonial architecture and mountain views.", order: 11 },
    { name: "Solan", city: "Solan", country: "India", coordinates: [76.787, 30.9045], category: "Mountains", description: "A Himalayan town surrounded by pine-covered hills.", order: 12 },
    { name: "Dharamshala", city: "Dharamshala", country: "India", coordinates: [76.3234, 32.219], category: "Mountains", description: "A mountain destination in the Kangra Valley.", order: 13 },
    { name: "Kangra", city: "Kangra", country: "India", coordinates: [76.2691, 32.0998], category: "Mountains", description: "A historic town surrounded by the Kangra Valley.", order: 14 },
    { name: "Chail", city: "Chail", country: "India", coordinates: [77.1656, 30.9646], category: "Mountains", description: "A quiet Himalayan hill station surrounded by forests.", order: 15 },
    { name: "Kullu", city: "Kullu", country: "India", coordinates: [77.1095, 31.9579], category: "Mountains", description: "A Himalayan valley along the Beas River.", order: 16 },
    { name: "Manali", city: "Manali", country: "India", coordinates: [77.1892, 32.2396], category: "Mountains", description: "A mountain town surrounded by forests, rivers, and peaks.", order: 17 },
    { name: "McLeod Ganj", city: "McLeod Ganj", country: "India", coordinates: [76.3234, 32.2426], category: "Mountains", description: "A hillside destination above Dharamshala.", order: 18 },
    { name: "Ahmedabad", city: "Ahmedabad", country: "India", coordinates: [72.5714, 23.0225], category: "City", description: "A major Gujarati city combining heritage and modern life.", order: 19 },
    { name: "Mumbai", city: "Mumbai", country: "India", coordinates: [72.8777, 19.076], category: "City", description: "India's energetic financial capital on the Arabian Sea.", order: 20 },
    { name: "Bhopal", city: "Bhopal", country: "India", coordinates: [77.4126, 23.2599], category: "City", description: "The capital of Madhya Pradesh, known for its lakes.", order: 21 },
    { name: "Jaipur", city: "Jaipur", country: "India", coordinates: [75.7873, 26.9124], category: "Heritage", description: "Rajasthan's Pink City, filled with forts and palaces.", order: 22 },
    { name: "Jodhpur", city: "Jodhpur", country: "India", coordinates: [73.0243, 26.2389], category: "Heritage", description: "The Blue City of Rajasthan, dominated by Mehrangarh Fort.", order: 23 },
    { name: "Jaisalmer", city: "Jaisalmer", country: "India", coordinates: [70.9025, 26.9157], category: "Desert", description: "The Golden City rising from the Thar Desert.", order: 24 },
    { name: "Kota", city: "Kota", country: "India", coordinates: [75.8648, 25.2138], category: "City", description: "A city on the Chambal River.", order: 25 },
    { name: "London", city: "London", country: "United Kingdom", coordinates: [-0.1276, 51.5072], category: "International", description: "A global city where history and modern life meet.", order: 26 },
    { name: "Derbyshire", city: "Derbyshire", country: "United Kingdom", coordinates: [-1.6, 53.1], category: "Countryside", description: "A scenic county known for countryside and the Peak District.", order: 27 },
    { name: "Cornwall", city: "Cornwall", country: "United Kingdom", coordinates: [-5.1, 50.4], category: "Coast", description: "A dramatic coastal region in southwest England.", order: 28 },
    { name: "Yorkshire", city: "Yorkshire", country: "United Kingdom", coordinates: [-1.3, 53.9], category: "Countryside", description: "A northern region filled with historic cities and countryside.", order: 29 },
    { name: "Southampton", city: "Southampton", country: "United Kingdom", coordinates: [-1.4044, 50.9097], category: "Coast", description: "A historic port city on England's south coast.", order: 30 },
    { name: "Manchester", city: "Manchester", country: "United Kingdom", coordinates: [-2.2426, 53.4808], category: "International", description: "A major northern English city of culture and innovation.", order: 31 },
    { name: "Leicester", city: "Leicester", country: "United Kingdom", coordinates: [-1.1398, 52.6369], category: "International", description: "A diverse East Midlands city with layered history.", order: 32 },
    { name: "Cardiff", city: "Cardiff", country: "United Kingdom", coordinates: [-3.1791, 51.4816], category: "International", description: "The capital of Wales.", order: 33 },
    { name: "Edinburgh", city: "Edinburgh", country: "United Kingdom", coordinates: [-3.1883, 55.9533], category: "International", description: "The capital of Scotland, known for its dramatic skyline.", order: 34 },
    { name: "Dublin", city: "Dublin", country: "Ireland", coordinates: [-6.2603, 53.3498], category: "International", description: "The capital of Ireland, blending history and modern life.", order: 35 },
    { name: "Paris", city: "Paris", country: "France", coordinates: [2.3522, 48.8566], category: "International", description: "The French capital of art, architecture, and culture.", order: 36 },
    { name: "Madrid", city: "Madrid", country: "Spain", coordinates: [-3.7038, 40.4168], category: "International", description: "Spain's vibrant capital of culture and lively streets.", order: 37 },
    { name: "Dubai", city: "Dubai", country: "United Arab Emirates", coordinates: [55.2708, 25.2048], category: "International", description: "A Gulf city known for its skyline and coastline.", order: 38 },
];

async function addDemoPlaces() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        const collection = db.collection('places');

        const existingCount = await collection.countDocuments();
        if (existingCount > 0) {
            console.log(`Collection already has ${existingCount} places.`);
            const proceed = await askQuestion('Do you want to add demo places anyway? (y/n): ');
            if (proceed.toLowerCase() !== 'y') {
                console.log('Aborted.');
                return;
            }
        }

        const now = new Date();
        const placesWithDates = demoPlaces.map(p => ({
            ...p,
            createdAt: now,
            updatedAt: now,
        }));

        const result = await collection.insertMany(placesWithDates);
        console.log(`✅ Successfully added ${result.insertedCount} places!`);
    } catch (error) {
        console.error('Error adding demo places:', error);
    } finally {
        await client.close();
    }
}

function askQuestion(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => {
        readline.question(question, answer => {
            readline.close();
            resolve(answer);
        });
    });
}

addDemoPlaces();
