import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMuseumStore } from '@/lib/museumStore';

interface MuseumHeaderProps {
  onAdminClick?: () => void;
}

export const MuseumHeader = ({ onAdminClick }: MuseumHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminMode } = useMuseumStore();
  const isHome = location.pathname === '/';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Back button */}
        {!isHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm tracking-wide">戻る</span>
          </Button>
        )}

        {isHome && <div />}

        {/* Admin button (only visible in admin mode) */}
        {isAdminMode && onAdminClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAdminClick}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            編集
          </Button>
        )}
      </div>
    </motion.header>
  );
};
