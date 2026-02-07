import { motion } from 'framer-motion';
import { useState } from 'react';
import { resolveAssetUrl } from '@/lib/assets';

interface PhotoFrameProps {
  imageSrc: string;
  caption: string;
  index: number;
  onClick?: () => void;
}

export const PhotoFrame = ({ imageSrc, caption, index, onClick }: PhotoFrameProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Frame container */}
      <div className="photo-frame transition-transform duration-300 group-hover:-translate-y-1">
        {/* Inner frame with vermilion border */}
        <div className="relative bg-background p-1">
          {/* Vermilion inner border */}
          <div className="absolute inset-0 border-2 border-primary/60 pointer-events-none" />
          
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {!isLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <img
              src={resolveAssetUrl(imageSrc)}
              alt={caption}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-105`}
            />
          </div>
        </div>
      </div>
      
      {/* Caption */}
      <motion.p 
        className="mt-4 text-center text-sm text-muted-foreground font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        {caption}
      </motion.p>
    </motion.div>
  );
};
