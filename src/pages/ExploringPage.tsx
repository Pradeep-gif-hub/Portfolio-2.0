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
        <div className="container px-4 mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-theme-subtle rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-theme-subtle rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 surface-card"></div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="container px-4 mx-auto">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Currently Exploring', path: '/exploring' }]} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-10"
        >
          <h1 className="heading-1 mb-3">
            Currently Exploring
          </h1>
          <p className="text-theme-muted text-base max-w-3xl">
            Topics, ideas, and systems I'm actively learning and refining.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <p className="text-theme-muted text-base">
              No areas of exploration at the moment.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl space-y-4 mb-12">
            {items.map((item) => (
              <div
                key={item._id}
                className="surface-card p-6 card-hover"
              >
                <h2 className="heading-4 mb-2 text-theme-text">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-theme-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {lastUpdated && (
          <footer className="pt-8 border-t border-theme-border max-w-4xl">
            <p className="text-sm text-theme-muted">
              Last updated: {lastUpdated}
            </p>
          </footer>
        )}
      </div>
    </SectionWrapper>
  );

};