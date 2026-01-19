import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionWrapper } from '../layout/SectionWrapper';
import { Button } from '../ui/Button';

interface ExploringItem {
  _id: string;
  title: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export const ExploringPreview = () => {
  const [items, setItems] = useState<ExploringItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/exploring?limit=4');
        const data = await response.json();
        
        if (data.success) {
          setItems(data.data);
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
      <SectionWrapper id="exploring-preview">
        <div className="animate-pulse">
          <div className="mb-12">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="max-w-6xl space-y-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-effect p-5 rounded-xl border-2 border-dark-700">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <SectionWrapper id="exploring-preview">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="heading-2 mb-4">
            Currently Exploring
          </h2>
          <p className="text-text-secondary text-lg">
            What I'm actively learning and thinking about right now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl space-y-4 mb-12"
          
        >
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-effect p-5 rounded-xl border-2 border-dark-700 hover:border-accent-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-accent-primary mt-1 flex-shrink-0" size={20} />
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/exploring">
            <Button className="btn-neon inline-flex items-center gap-2">
              View all areas I'm exploring
              <ArrowRight size={18} />
            </Button>
          </Link>
        </motion.div>
    </SectionWrapper>
  );
};