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
    name: '好きなモノ展',
    description: '内藤の好きなモノをたどる常設展示',
    order: 0,
  },
  {
    id: 'ex2',
    type: '常設展',
    name: '好きなコト展',
    description: '内藤の好きなコトをたどる常設展示',
    order: 1,
  },
  {
    id: 'ex3',
    type: '企画展',
    name: '今ハマっていること展',
    description: '内藤が今ハマっていることを覗く企画展',
    order: 0,
  },
];

const initialExhibitItems: ExhibitItem[] = [
  {
    id: 'item1',
    exhibitionId: 'ex1',
    name: 'フランスパン',
    description: '内藤の人生を彩る最高の相棒でありアイデンティティ',
    episode: '内藤は小学生時代からフランスパンに対して並々ならぬ好意を抱いていた。その硬さとシンプルな造形に感銘を受け、山遊びの際は何時もカバンに忍ばせていた。',
    coverImage: 'https://cocolomy.com/wp-content/uploads/2025/11/ce0bc83c15776e90439127d48d4e5179-420x560.jpg',
    order: 0,
  },
  {
    id: 'item2',
    exhibitionId: 'ex1',
    name: '日本刀',
    description: '鉄のみから創られたとは思えない豊かな表情に一目惚れ',
    episode: '侍に憧れた幼年期、剣道に熱中した中学時代、居合に出会った高校時代。その全ての中心には日本刀があった。',
    coverImage: 'https://cocolomy.com/wp-content/uploads/2025/11/da27f4727d6853ac73ba31a0c4625196-560x373.jpg',
    order: 1,
  },
  {
    id: 'item3',
    exhibitionId: 'ex1',
    name: '水墨画',
    description: '墨と水のみで表現する空白の美学',
    episode: '内藤が水墨画に初めて触れたのは中学生に読んだ「線は僕を描く」という小説だった。その後、毎年年賀状に自作の水墨画を描くようになった。メルカリで購入した硯がお気に入りで、墨をするときの音と匂いがたまらない。',
    coverImage: 'https://cocolomy.com/wp-content/uploads/2025/11/040c81722483394bad967e111bb8e48f-392x560.jpg',
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
    imageSrc: 'https://cocolomy.com/wp-content/uploads/2025/11/4360a162abbff56bbffc82f83992c28e-560x392.jpg',
    caption: '発酵酵母のフランスパン',
    order: 0,
  },
  {
    id: 'ph2',
    exhibitItemId: 'item1',
    imageSrc: 'https://cocolomy.com/wp-content/uploads/2025/11/51c6d33dcc4ab9097b4c7b712f886663-768x1024.jpg',
    caption: 'お昼ご飯のTapanのフランスパン',
    order: 1,
  },
  {
    id: 'ph3',
    exhibitItemId: 'item2',
    imageSrc: 'https://cocolomy.com/wp-content/uploads/2025/11/1d252e57c53884b0a22198d12270dc68-520x560.jpg',
    caption: '川に流れる花びらを見立てた刃文',
    order: 0,
  },
  {
    id: 'ph4',
    exhibitItemId: 'item2',
    imageSrc: 'https://cocolomy.com/wp-content/uploads/2025/11/e038a64a1a659c0f6ac21079b0e5de8c.jpg',
    caption: '刀鍛冶へのあこがれのあまり、内藤自身でペーパーナイフを作ったこともあった。',
    order: 1,
  },
  {
    id: 'ph5',
    exhibitItemId: 'item3',
    imageSrc: 'https://cocolomy.com/wp-content/uploads/2025/11/2491bebb121c4909216bd4c22faefd7a-420x560.jpg',
    caption: 'メルカリで買ったお気に入りの硯',
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
