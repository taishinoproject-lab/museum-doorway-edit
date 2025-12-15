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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      className="
        group relative
        w-[340px] h-[120px]
        bg-secondary
        border border-border
        rounded
        overflow-hidden
        shadow-door
        flex items-center
        px-6
      "
    >
      {/* Door texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-muted to-secondary opacity-40" />
  
      {/* Vermilion accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
  
      {/* Content */}
      <div className="relative flex flex-col text-left">
        <span className="text-3xl font-medium tracking-wide text-foreground">
          {type}
        </span>
        <span className="mt-1 text-xs tracking-[0.35em] uppercase text-muted-foreground">
          {isPermanent ? 'Permanent' : 'Special'}
        </span>
      </div>
  
      {/* Hover light */}
      <motion.div
        className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
  
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/50" />
    </motion.button>
  );
  
}
