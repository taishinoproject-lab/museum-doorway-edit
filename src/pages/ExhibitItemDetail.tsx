import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PhotoFrame } from '@/components/PhotoFrame';
import { MuseumHeader } from '@/components/MuseumHeader';
import { useMuseumStore } from '@/lib/museumStore';

const ExhibitItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exhibitItems, photos, exhibitions } = useMuseumStore();

  const item = exhibitItems.find((i) => i.id === id);
  const itemPhotos = photos
    .filter((p) => p.exhibitItemId === id)
    .sort((a, b) => a.order - b.order);
  const exhibition = item ? exhibitions.find((e) => e.id === item.exhibitionId) : null;

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">展示アイテムが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MuseumHeader />

      <main className="max-w-4xl mx-auto px-6 py-24">
        {/* Back navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/room/${item.exhibitionId}`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm"> {exhibition?.name ?? '部屋'}へ戻る</span>
        </motion.button>

        {/* Item header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        > {exhibition && (
            <p className="text-sm text-muted-foreground tracking-wider mb-3">
              {exhibition.type} / {exhibition.name}
            </p>
          )}
        
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
            {item.name}
          </h1>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-px w-32 bg-primary mx-auto mb-6"
          />

          <p className="text-lg text-muted-foreground">
            {item.description}
          </p>
        </motion.div>

        {/* Episode section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative p-8 md:p-12 border border-primary/30 bg-primary/5">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

            <h2 className="text-sm tracking-wider text-primary mb-4">エピソード</h2>
            <p className="text-foreground/90 leading-relaxed text-lg">
              {item.episode}
            </p>
          </div>
        </motion.section>

        {/* Photo gallery */}
        {itemPhotos.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-sm tracking-wider text-primary mb-8 text-center">ギャラリー</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {itemPhotos.map((photo, index) => (
                <PhotoFrame
                  key={photo.id}
                  imageSrc={photo.imageSrc}
                  caption={photo.caption}
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Photo count */}
        {itemPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-sm text-muted-foreground">
              {itemPhotos.length} 点の写真
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ExhibitItemDetail;
