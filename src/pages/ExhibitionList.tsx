import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExhibitionCard } from '@/components/ExhibitionCard';
import { MuseumHeader } from '@/components/MuseumHeader';
import { useMuseumStore, type ExhibitionType } from '@/lib/museumStore';
import NotFound from './NotFound';

const ExhibitionList = () => {
  const { type } = useParams<{ type: ExhibitionType }>();
  const allowedTypes = ['常設展', '企画展'] as const;

  if (!type || !allowedTypes.includes(type)) {
    return <NotFound />;
  }

  const { exhibitions } = useMuseumStore();
  
  const filteredExhibitions = exhibitions
    .filter((ex) => ex.type === type)
    .sort((a, b) => a.order - b.order);

  const isPermanent = type === '常設展';

  return (
    <div className="min-h-screen bg-background">
      <MuseumHeader />

      <main className="max-w-3xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-1 h-12 bg-primary origin-top"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-medium">{type}</h1>
              <p className="text-sm text-muted-foreground tracking-widest mt-1">
                {isPermanent ? 'Permanent Exhibition' : 'Special Exhibition'}
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground mt-6">
            {isPermanent
              ? '人生の節目となった記憶や活動を常時展示しています。'
              : '期間限定の特別企画をお楽しみください。'}
          </p>
        </motion.div>

        {/* Exhibition list */}
        <div className="space-y-4">
          {filteredExhibitions.length > 0 ? (
            filteredExhibitions.map((exhibition, index) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <p>現在、展示はありません。</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExhibitionList;
