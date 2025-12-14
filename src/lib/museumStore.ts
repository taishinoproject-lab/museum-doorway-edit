import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExhibitionType = '常設展' | '企画展';

export interface Exhibition {
  id: string;
  type: ExhibitionType;
  name: string;
  description: string;
  order: number;
}

export interface ExhibitItem {
  id: string;
  exhibitionId: string;
  name: string;
  description: string;
  episode: string;
  coverImage: string;
  order: number;
}

export interface Photo {
  id: string;
  exhibitItemId: string;
  imageSrc: string;
  caption: string;
  order: number;
}

interface MuseumState {
  exhibitions: Exhibition[];
  exhibitItems: ExhibitItem[];
  photos: Photo[];
  isAdminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  addExhibition: (exhibition: Omit<Exhibition, 'id' | 'order'>) => void;
  updateExhibition: (id: string, updates: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  addExhibitItem: (item: Omit<ExhibitItem, 'id' | 'order'>) => void;
  updateExhibitItem: (id: string, updates: Partial<ExhibitItem>) => void;
  deleteExhibitItem: (id: string) => void;
  addPhoto: (photo: Omit<Photo, 'id' | 'order'>) => void;
  addPhotos: (photos: Omit<Photo, 'id' | 'order'>[]) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  reorderPhotos: (exhibitItemId: string, photoIds: string[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// Sample data for initial state
const initialExhibitions: Exhibition[] = [
  {
    id: 'ex1',
    type: '常設展',
    name: '記憶の回廊',
    description: '人生の節目となった瞬間を辿る常設展示',
    order: 0,
  },
  {
    id: 'ex2',
    type: '常設展',
    name: '創造の軌跡',
    description: '制作活動とプロジェクトの記録',
    order: 1,
  },
  {
    id: 'ex3',
    type: '企画展',
    name: '光と影',
    description: '特別企画：写真作品展',
    order: 0,
  },
];

const initialExhibitItems: ExhibitItem[] = [
  {
    id: 'item1',
    exhibitionId: 'ex1',
    name: 'フランスパン',
    description: 'パリで出会った忘れられない味',
    episode: 'パリの小さなブーランジェリーで初めて食べた焼きたてのバゲット。外はカリッと、中はもっちり。あの香ばしい香りと、店主の温かい笑顔は今でも鮮明に覚えている。',
    coverImage: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=600&fit=crop',
    order: 0,
  },
  {
    id: 'item2',
    exhibitionId: 'ex1',
    name: '日本刀',
    description: '祖父から受け継いだ家宝',
    episode: '祖父が大切にしていた日本刀。その刃紋の美しさに魅了され、日本の伝統工芸への関心が芽生えた。受け継ぐ時に聞いた祖父の話は、今も心に深く刻まれている。',
    coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
    order: 1,
  },
  {
    id: 'item3',
    exhibitionId: 'ex1',
    name: '古い写真機',
    description: '写真を始めるきっかけ',
    episode: '父から譲り受けたフィルムカメラ。デジタル全盛の時代に、一枚一枚丁寧に撮る楽しさを教えてくれた。シャッター音を聞くたびに、新しい物語が始まる気がした。',
    coverImage: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=600&fit=crop',
    order: 2,
  },
  {
    id: 'item4',
    exhibitionId: 'ex2',
    name: 'プログラミング',
    description: 'コードで世界を創る',
    episode: '初めて書いたHello Worldから始まった旅。画面に文字が表示された瞬間の感動は忘れられない。今では複雑なシステムを構築できるようになったが、あの初心は忘れずにいたい。',
    coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    order: 0,
  },
  {
    id: 'item5',
    exhibitionId: 'ex3',
    name: '朝焼けの海',
    description: '静寂の中の光',
    episode: '夜明け前から海岸で待ち続けた。寒さに震えながら待った甲斐があった。水平線から昇る太陽が海面を金色に染めた瞬間、すべての疲れが吹き飛んだ。',
    coverImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
    order: 0,
  },
];

const initialPhotos: Photo[] = [
  {
    id: 'ph1',
    exhibitItemId: 'item1',
    imageSrc: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=600&fit=crop',
    caption: 'パリのブーランジェリー',
    order: 0,
  },
  {
    id: 'ph2',
    exhibitItemId: 'item1',
    imageSrc: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    caption: '焼きたてのバゲット',
    order: 1,
  },
  {
    id: 'ph3',
    exhibitItemId: 'item2',
    imageSrc: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
    caption: '刃紋の美しさ',
    order: 0,
  },
  {
    id: 'ph4',
    exhibitItemId: 'item2',
    imageSrc: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
    caption: '伝統の技',
    order: 1,
  },
  {
    id: 'ph5',
    exhibitItemId: 'item3',
    imageSrc: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=600&fit=crop',
    caption: '父のカメラ',
    order: 0,
  },
  {
    id: 'ph6',
    exhibitItemId: 'item4',
    imageSrc: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    caption: 'デジタルの世界',
    order: 0,
  },
  {
    id: 'ph7',
    exhibitItemId: 'item4',
    imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    caption: '技術と芸術の融合',
    order: 1,
  },
  {
    id: 'ph8',
    exhibitItemId: 'item5',
    imageSrc: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
    caption: '波の記憶',
    order: 0,
  },
  {
    id: 'ph9',
    exhibitItemId: 'item5',
    imageSrc: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    caption: '霧の中の光',
    order: 1,
  },
];

export const useMuseumStore = create<MuseumState>()(
  persist(
    (set, get) => ({
      exhibitions: initialExhibitions,
      exhibitItems: initialExhibitItems,
      photos: initialPhotos,
      isAdminMode: false,

      setAdminMode: (mode) => set({ isAdminMode: mode }),

      addExhibition: (exhibition) => {
        const exhibitions = get().exhibitions;
        const maxOrder = Math.max(...exhibitions.filter(e => e.type === exhibition.type).map(e => e.order), -1);
        set({
          exhibitions: [
            ...exhibitions,
            { ...exhibition, id: generateId(), order: maxOrder + 1 },
          ],
        });
      },

      updateExhibition: (id, updates) => {
        set({
          exhibitions: get().exhibitions.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        });
      },

      deleteExhibition: (id) => {
        const itemIds = get().exhibitItems.filter(item => item.exhibitionId === id).map(item => item.id);
        set({
          exhibitions: get().exhibitions.filter((e) => e.id !== id),
          exhibitItems: get().exhibitItems.filter((item) => item.exhibitionId !== id),
          photos: get().photos.filter((p) => !itemIds.includes(p.exhibitItemId)),
        });
      },

      addExhibitItem: (item) => {
        const items = get().exhibitItems.filter(i => i.exhibitionId === item.exhibitionId);
        const maxOrder = Math.max(...items.map(i => i.order), -1);
        set({
          exhibitItems: [
            ...get().exhibitItems,
            { ...item, id: generateId(), order: maxOrder + 1 },
          ],
        });
      },

      updateExhibitItem: (id, updates) => {
        set({
          exhibitItems: get().exhibitItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        });
      },

      deleteExhibitItem: (id) => {
        set({
          exhibitItems: get().exhibitItems.filter((item) => item.id !== id),
          photos: get().photos.filter((p) => p.exhibitItemId !== id),
        });
      },

      addPhoto: (photo) => {
        const photos = get().photos.filter(p => p.exhibitItemId === photo.exhibitItemId);
        const maxOrder = Math.max(...photos.map(p => p.order), -1);
        set({
          photos: [
            ...get().photos,
            { ...photo, id: generateId(), order: maxOrder + 1 },
          ],
        });
      },

      addPhotos: (newPhotos) => {
        const currentPhotos = get().photos;
        const photosWithIds = newPhotos.map((photo, index) => {
          const existingPhotos = currentPhotos.filter(p => p.exhibitItemId === photo.exhibitItemId);
          const maxOrder = Math.max(...existingPhotos.map(p => p.order), -1);
          return {
            ...photo,
            id: generateId(),
            order: maxOrder + 1 + index,
          };
        });
        set({ photos: [...currentPhotos, ...photosWithIds] });
      },

      updatePhoto: (id, updates) => {
        set({
          photos: get().photos.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        });
      },

      deletePhoto: (id) => {
        set({ photos: get().photos.filter((p) => p.id !== id) });
      },

      reorderPhotos: (exhibitItemId, photoIds) => {
        set({
          photos: get().photos.map((p) => {
            if (p.exhibitItemId !== exhibitItemId) return p;
            const newOrder = photoIds.indexOf(p.id);
            return newOrder >= 0 ? { ...p, order: newOrder } : p;
          }),
        });
      },
    }),
    {
      name: 'museum-storage',
    }
  )
);
