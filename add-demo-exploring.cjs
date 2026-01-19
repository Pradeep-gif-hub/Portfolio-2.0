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



const demoExploringItems = [

    {

        title: 'Natural Language Processing',

        description: 'Designing NLP systems with a focus on real-world constraints.',

        isActive: true,

        order: 1,

    },

    {

        title: 'Machine Learning Optimization',

        description: 'Exploring model efficiency, trade-offs, and performance tuning.',

        isActive: true,

        order: 2,

    },

    {

        title: 'AI System Reliability',

        description: 'Understanding how AI systems behave in production environments.',

        isActive: true,

        order: 3,

    },

    {

        title: 'Distributed Systems Architecture',

        description: 'Learning about scalability, fault tolerance, and consistency patterns.',

        isActive: true,

        order: 4,

    },

    {

        title: 'Cloud-Native Development',

        description: 'Building resilient applications with containerization and microservices.',

        isActive: true,

        order: 5,

    },

    {

        title: 'TypeScript Advanced Patterns',

        description: 'Mastering type-safe architectures and design patterns.',

        isActive: true,

        order: 6,

    },

];



async function addDemoExploring() {

    const client = new MongoClient(uri);



    try {

        await client.connect();

        console.log('Connected to MongoDB');



        const db = client.db();

        const collection = db.collection('explorings');



        // Check if collection already has items

        const existingCount = await collection.countDocuments();

        if (existingCount > 0) {

            console.log(`Collection already has ${existingCount} exploring items.`);

            const proceed = await askQuestion('Do you want to add demo items anyway? (y/n): ');

            if (proceed.toLowerCase() !== 'y') {

                console.log('Aborted.');

                return;

            }

        }



        // Insert demo exploring items

        const result = await collection.insertMany(demoExploringItems);

        console.log(`✅ Successfully added ${result.insertedCount} exploring items!`);



        // Display the items

        console.log('\nAdded items:');

        demoExploringItems.forEach((item, index) => {

            console.log(`${index + 1}. ${item.title}`);

            if (item.description) {
                console.log(` ${item.description}`);
            }
        });
    } catch (error) {
        console.error('Error adding demo exploring items:', error);
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



// Run the script

addDemoExploring();