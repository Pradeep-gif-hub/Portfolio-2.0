import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { Breadcrumb } from '../components/ui/Breadcrumb';

import { SectionWrapper } from '../components/layout/SectionWrapper';



interface ExploringItem {

 _id: string;

 title: string;

 description?: string;

 isActive: boolean;

 order: number;

 updatedAt: string;

}



export const ExploringPage = () => {

 const [items, setItems] = useState<ExploringItem[]>([]);

 const [loading, setLoading] = useState(true);

 const [lastUpdated, setLastUpdated] = useState<string>('');



 useEffect(() => {

  const fetchItems = async () => {

   try {

    const response = await fetch('/api/exploring');

    const data = await response.json();

    

    if (data.success) {

     setItems(data.data);

     

     // Find the most recent update date

     if (data.data.length > 0) {

      const mostRecent = data.data.reduce((latest: ExploringItem, item: ExploringItem) => {

       const itemDate = item.updatedAt ? new Date(item.updatedAt) : new Date(0);

       const latestDate = latest.updatedAt ? new Date(latest.updatedAt) : new Date(0);

       return itemDate > latestDate ? item : latest;

      });

      

      if (mostRecent.updatedAt) {

       const date = new Date(mostRecent.updatedAt);

       if (!isNaN(date.getTime())) {

        setLastUpdated(date.toLocaleDateString('en-US', {

         year: 'numeric',

         month: 'long',

         day: 'numeric',

        }));

       } else {

        // Fallback to current date if invalid

        setLastUpdated(new Date().toLocaleDateString('en-US', {

         year: 'numeric',

         month: 'long',

         day: 'numeric',

        }));

       }

      } else {

       // No updatedAt, use current date

       setLastUpdated(new Date().toLocaleDateString('en-US', {

        year: 'numeric',

        month: 'long',

        day: 'numeric',

       }));

      }

     }

    }

   } catch (error) {

    console.error('Error fetching exploring items:', error);

   } finally {

    setLoading(false);

   }

  };



  fetchItems();

 }, []);



 if (loading) {

  return (

   <SectionWrapper>

    <div className="container px-6 mx-auto">

     <div className="animate-pulse">

      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>

      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>

      <div className="space-y-4">

       {[1, 2, 3].map((i) => (

        <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>

       ))}

      </div>

     </div>

    </div>

   </SectionWrapper>

  );

 }



 return (

  <SectionWrapper>

   <div className="container px-6 mx-auto">

    <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Currently Exploring', path: '/exploring' }]} />

    

    <motion.div

     initial={{ opacity: 0, y: 20 }}

     animate={{ opacity: 1, y: 0 }}

     transition={{ duration: 0.6 }}

     className="mb-12"

    >

     <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r">

      Currently Exploring

     </h1>

     <p className="text-text-secondary text-lg max-w-3xl">

      Topics, ideas, and systems I'm actively learning and refining.

     </p>

    </motion.div>



    {items.length === 0 ? (

     <div className="glass-effect p-12 rounded-xl border-2 border-dark-700 text-center ">

      <p className="text-text-secondary text-lg">

       No areas of exploration at the moment.

      </p>

     </div>

    ) : (

     <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      transition={{ duration: 0.6, delay: 0.2 }}

      className="max-w-4xl mx-auto space-y-6 mb-16"

     >

      {items.map((item, index) => (

       <motion.div

        key={item._id}

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5, delay: index * 0.1 }}

        className="glass-effect p-6 rounded-xl border-2 border-dark-700 hover:border-accent-primary/50 transition-all duration-300"

       >

        <h2 className="text-xl font-semibold mb-2 text-white">

         {item.title}

        </h2>

        {item.description && (

         <p className="text-text-secondary leading-relaxed">

          {item.description}

         </p>

        )}

       </motion.div>

      ))}

     </motion.div>

    )}



    {lastUpdated && (

     <motion.footer

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      transition={{ duration: 0.6, delay: 0.4 }}

      className="pt-8 border-t border-dark-700 max-w-4xl mx-auto"

     >

      <p className="text-sm text-text-secondary">

       Last updated: {lastUpdated}

      </p>

     </motion.footer>

    )}

   </div>

  </SectionWrapper>

 );

};