import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ExhibitionType } from '@/lib/museumStore';

interface MuseumDoorProps {
  type: ExhibitionType;
  delay?: number;
}

export const MuseumDoor = ({ type, delay = 0 }: MuseumDoorProps) => {
  const navigate = useNavigate();
  const isPermanent = type === '常設展';

  const handleClick = () => {
    navigate(`/exhibitions/${type}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full max-w-xs aspect-[3/4] bg-secondary border border-border rounded overflow-hidden shadow-door door-hover"
    >
      {/* Door panel texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-muted to-secondary opacity-50" />
      
      {/* Vermilion accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      
      {/* Door handle area */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-muted rounded-full opacity-40 group-hover:opacity-60 transition-opacity" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Japanese vertical text */}
        <motion.div 
          className="writing-mode-vertical text-4xl md:text-5xl font-medium tracking-widest text-foreground mb-6"
          style={{ writingMode: 'vertical-rl' }}
        >
          {type}
        </motion.div>
        
        {/* English subtitle */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            {isPermanent ? 'Permanent' : 'Special'}
          </span>
        </div>
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>
      
      {/* Bottom vermilion accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/50" />
    </motion.button>
  );
};
