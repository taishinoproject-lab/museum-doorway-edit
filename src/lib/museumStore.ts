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

export interface Photo {
  id: string;
  exhibitionId: string;
  imageSrc: string;
  caption: string;
  order: number;
}

interface MuseumState {
  exhibitions: Exhibition[];
  photos: Photo[];
  isAdminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  addExhibition: (exhibition: Omit<Exhibition, 'id' | 'order'>) => void;
  updateExhibition: (id: string, updates: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  addPhoto: (photo: Omit<Photo, 'id' | 'order'>) => void;
  addPhotos: (photos: Omit<Photo, 'id' | 'order'>[]) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  reorderPhotos: (exhibitionId: string, photoIds: string[]) => void;
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

const initialPhotos: Photo[] = [
  {
    id: 'ph1',
    exhibitionId: 'ex1',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    caption: '始まりの場所',
    order: 0,
  },
  {
    id: 'ph2',
    exhibitionId: 'ex1',
    imageSrc: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    caption: '静寂の朝',
    order: 1,
  },
  {
    id: 'ph3',
    exhibitionId: 'ex1',
    imageSrc: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop',
    caption: '記憶の風景',
    order: 2,
  },
  {
    id: 'ph4',
    exhibitionId: 'ex2',
    imageSrc: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    caption: 'デジタルの世界',
    order: 0,
  },
  {
    id: 'ph5',
    exhibitionId: 'ex2',
    imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    caption: '技術と芸術の融合',
    order: 1,
  },
  {
    id: 'ph6',
    exhibitionId: 'ex3',
    imageSrc: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
    caption: '波の記憶',
    order: 0,
  },
  {
    id: 'ph7',
    exhibitionId: 'ex3',
    imageSrc: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    caption: '霧の中の光',
    order: 1,
  },
];

export const useMuseumStore = create<MuseumState>()(
  persist(
    (set, get) => ({
      exhibitions: initialExhibitions,
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
        set({
          exhibitions: get().exhibitions.filter((e) => e.id !== id),
          photos: get().photos.filter((p) => p.exhibitionId !== id),
        });
      },

      addPhoto: (photo) => {
        const photos = get().photos.filter(p => p.exhibitionId === photo.exhibitionId);
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
          const existingPhotos = currentPhotos.filter(p => p.exhibitionId === photo.exhibitionId);
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

      reorderPhotos: (exhibitionId, photoIds) => {
        set({
          photos: get().photos.map((p) => {
            if (p.exhibitionId !== exhibitionId) return p;
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
