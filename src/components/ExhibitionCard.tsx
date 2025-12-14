import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Exhibition } from '@/lib/museumStore';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  index: number;
}

export const ExhibitionCard = ({ exhibition, index }: ExhibitionCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(`/room/${exhibition.id}`)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ x: 8 }}
      className="group w-full text-left p-6 bg-card border border-border rounded hover:border-primary/40 transition-colors duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <span className="inline-block px-2 py-0.5 text-xs tracking-wider text-primary bg-primary/10 rounded mb-3">
            {exhibition.type}
          </span>
          
          {/* Exhibition name */}
          <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
            {exhibition.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {exhibition.description}
          </p>
        </div>
        
        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-4 flex-shrink-0" />
      </div>
      
      {/* Bottom accent line */}
      <div className="mt-4 h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
};
