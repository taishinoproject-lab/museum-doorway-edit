import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ExhibitItem } from '@/lib/museumStore';

interface ExhibitItemCardProps {
  item: ExhibitItem;
  index: number;
}

export const ExhibitItemCard = ({ item, index }: ExhibitItemCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => navigate(`/item/${item.id}`)}
      className="group cursor-pointer"
    >
      {/* Image frame */}
      <div className="relative aspect-[4/3] mb-4 overflow-hidden">
        {/* Outer frame */}
        <div className="absolute inset-0 border-4 border-foreground/80 z-10 pointer-events-none" />
        {/* Inner vermilion border */}
        <div className="absolute inset-1 border-2 border-primary/60 z-10 pointer-events-none" />
        
        {/* Image */}
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={item.coverImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-background/60 flex items-center justify-center z-20"
        >
          <span className="text-foreground text-sm tracking-wider">展示を見る</span>
        </motion.div>
      </div>

      {/* Item info */}
      <div className="text-center">
        <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
};
