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
          <div className="mb-10">
            <div className="h-8 bg-theme-subtle rounded w-64 mb-3"></div>
            <div className="h-5 bg-theme-subtle rounded w-96"></div>
          </div>
          <div className="space-y-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="surface-card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-theme-subtle rounded mt-0.5"></div>
                  <div className="h-5 bg-theme-subtle rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="h-11 bg-theme-subtle rounded-lg w-64 mx-auto"></div>
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
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="mb-10"
        >
          <h2 className="heading-2 mb-3">
            Currently Exploring
          </h2>
          <p className="text-theme-muted text-base">
            What I'm actively learning and thinking about right now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="space-y-4 mb-10"
        >
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="surface-card p-5 hover:border-theme-accent/70 transition-colors"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-theme-accent mt-0.5 flex-shrink-0" size={18} />
                <h3 className="text-base font-medium text-theme-text">
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
          transition={{ duration: 0.25 }}
          className="text-center"
        >
          <Link to="/exploring">
            <Button variant="primary" className="inline-flex items-center gap-2">
              View all areas I'm exploring
              <ArrowRight size={17} />
            </Button>
          </Link>
        </motion.div>
    </SectionWrapper>
  );
};