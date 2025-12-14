import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhotoFrame } from '@/components/PhotoFrame';
import { MuseumHeader } from '@/components/MuseumHeader';
import { useMuseumStore } from '@/lib/museumStore';

const ExhibitionRoom = () => {
  const { id } = useParams<{ id: string }>();
  const { exhibitions, photos } = useMuseumStore();
  
  const exhibition = exhibitions.find((ex) => ex.id === id);
  const exhibitionPhotos = photos
    .filter((p) => p.exhibitionId === id)
    .sort((a, b) => a.order - b.order);

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">展示が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MuseumHeader />

      <main className="max-w-6xl mx-auto px-6 py-24">
        {/* Exhibition header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Type badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 text-xs tracking-wider text-primary bg-primary/10 rounded mb-4"
          >
            {exhibition.type}
          </motion.span>

          {/* Exhibition name */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
            {exhibition.name}
          </h1>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-px w-32 bg-primary mx-auto mb-6"
          />

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {exhibition.description}
          </p>
        </motion.div>

        {/* Photo gallery */}
        {exhibitionPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {exhibitionPhotos.map((photo, index) => (
              <PhotoFrame
                key={photo.id}
                imageSrc={photo.imageSrc}
                caption={photo.caption}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <p>この展示にはまだ写真がありません</p>
          </motion.div>
        )}

        {/* Gallery count */}
        {exhibitionPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-sm text-muted-foreground">
              {exhibitionPhotos.length} 点の展示
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ExhibitionRoom;
