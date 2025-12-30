import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import museumData from '@/content/museum.json';

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

type MuseumContent = {
  exhibitions: Exhibition[];
  exhibitItems: ExhibitItem[];
  photos: Photo[];
};

const {
  exhibitions: initialExhibitions,
  exhibitItems: initialExhibitItems,
  photos: initialPhotos,
} = museumData as MuseumContent;

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
