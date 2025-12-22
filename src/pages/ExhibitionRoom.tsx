import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExhibitItemCard } from '@/components/ExhibitItemCard';
import { MuseumHeader } from '@/components/MuseumHeader';
import { useMuseumStore } from '@/lib/museumStore';

const ExhibitionRoom = () => {
  const { id } = useParams<{ id: string }>();
  const { exhibitions, exhibitItems } = useMuseumStore();
  
  const exhibition = exhibitions.find((ex) => ex.id === id);
  const items = exhibitItems
    .filter((item) => item.exhibitionId === id)
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
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            to={`/exhibitions/${exhibition.type}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {exhibition.type}一覧へ戻る
          </Link>

          <p className="text-sm text-muted-foreground">
            {items.length} 点の展示
          </p>
        </div>

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

        {/* Exhibit items gallery */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {items.map((item, index) => (
              <ExhibitItemCard
                key={item.id}
                item={item}
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
            <p>この展示にはまだアイテムがありません</p>
          </motion.div>
        )}

        {/* Items count */}
      </main>
    </div>
  );
};

export default ExhibitionRoom;
