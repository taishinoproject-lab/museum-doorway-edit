import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { MuseumDoor } from '@/components/MuseumDoor';
import { MuseumHeader } from '@/components/MuseumHeader';
import { AdminModal } from '@/components/AdminModal';
import { useMuseumStore } from '@/lib/museumStore';

const Index = () => {
  const [searchParams] = useSearchParams();
  const { setAdminMode, isAdminMode } = useMuseumStore();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [footerTapCount, setFooterTapCount] = useState(0);

  // Check for admin mode in URL
  useEffect(() => {
    if (searchParams.get('admin') === '1') {
      setAdminMode(true);
    }
  }, [searchParams, setAdminMode]);

  // Secret footer tap to enable admin mode
  const handleFooterTap = () => {
    const newCount = footerTapCount + 1;
    setFooterTapCount(newCount);
    if (newCount >= 7) {
      setAdminMode(true);
      setFooterTapCount(0);
    }
    // Reset after 3 seconds
    setTimeout(() => setFooterTapCount(0), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MuseumHeader onAdminClick={() => setIsAdminModalOpen(true)} />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide mb-4">
            わたし博物館
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-px w-24 bg-primary mx-auto mb-4"
          />
          <p className="text-lg text-muted-foreground tracking-widest">
            Taishi Naito
          </p>
        </motion.div>

        {/* Doors */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <MuseumDoor type="常設展" delay={0.2} />
          <MuseumDoor type="企画展" delay={0.4} />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-sm text-muted-foreground tracking-wider text-center"
        >
          どちらかの扉をお選びください
        </motion.p>
      </main>

      {/* Footer */}
      <footer
        onClick={handleFooterTap}
        className="py-6 text-center select-none cursor-default"
      >
        <p className="text-xs text-muted-foreground/50 tracking-wide">
          © 2024 わたし博物館
        </p>
      </footer>

      {/* Admin Modal */}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  );
};

export default Index;
