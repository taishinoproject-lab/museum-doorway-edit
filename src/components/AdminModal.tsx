import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useMuseumStore, type Exhibition, type ExhibitionType } from '@/lib/museumStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
  const { exhibitions, photos, addExhibition, updateExhibition, deleteExhibition, addPhotos, updatePhoto, deletePhoto } = useMuseumStore();
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string>(exhibitions[0]?.id || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newExhibition, setNewExhibition] = useState<{ name: string; description: string; type: ExhibitionType }>({
    name: '',
    description: '',
    type: '常設展',
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleFiles(files);
  }, [selectedExhibitionId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = (files: File[]) => {
    if (!selectedExhibitionId) {
      toast.error('展示室を選択してください');
      return;
    }

    if (files.length === 0) return;

    const newPhotos = files.map(file => ({
      exhibitionId: selectedExhibitionId,
      imageSrc: URL.createObjectURL(file),
      caption: file.name.replace(/\.[^/.]+$/, ''),
    }));

    addPhotos(newPhotos);
    toast.success(`${files.length}枚の写真を追加しました`);
  };

  const handleAddExhibition = () => {
    if (!newExhibition.name.trim()) {
      toast.error('展示名を入力してください');
      return;
    }
    addExhibition(newExhibition);
    setNewExhibition({ name: '', description: '', type: '常設展' });
    toast.success('展示室を追加しました');
  };

  const exhibitionPhotos = photos.filter(p => p.exhibitionId === selectedExhibitionId).sort((a, b) => a.order - b.order);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-card border border-border rounded-lg shadow-museum"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-medium">管理者編集</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Tabs defaultValue="exhibitions" className="p-6">
                <TabsList className="mb-6">
                  <TabsTrigger value="exhibitions">展示室</TabsTrigger>
                  <TabsTrigger value="photos">写真</TabsTrigger>
                </TabsList>

                {/* Exhibitions Tab */}
                <TabsContent value="exhibitions" className="space-y-6">
                  {/* Add new exhibition */}
                  <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">新規展示室</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        value={newExhibition.type}
                        onValueChange={(v) => setNewExhibition(prev => ({ ...prev, type: v as ExhibitionType }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="常設展">常設展</SelectItem>
                          <SelectItem value="企画展">企画展</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="展示名"
                        value={newExhibition.name}
                        onChange={(e) => setNewExhibition(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="説明"
                        value={newExhibition.description}
                        onChange={(e) => setNewExhibition(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleAddExhibition} className="w-full md:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      追加
                    </Button>
                  </div>

                  {/* Exhibition list */}
                  <div className="space-y-3">
                    {exhibitions.map((ex) => (
                      <ExhibitionEditor key={ex.id} exhibition={ex} onUpdate={updateExhibition} onDelete={deleteExhibition} />
                    ))}
                  </div>
                </TabsContent>

                {/* Photos Tab */}
                <TabsContent value="photos" className="space-y-6">
                  {/* Exhibition selector */}
                  <Select value={selectedExhibitionId} onValueChange={setSelectedExhibitionId}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="展示室を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {exhibitions.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.type}: {ex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Drop zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      画像をドラッグ&ドロップ、またはクリックして選択
                    </p>
                    <p className="text-xs text-muted-foreground">
                      複数選択可能
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Photo grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {exhibitionPhotos.map((photo) => (
                      <PhotoEditor key={photo.id} photo={photo} onUpdate={updatePhoto} onDelete={deletePhoto} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Exhibition editor component
interface ExhibitionEditorProps {
  exhibition: Exhibition;
  onUpdate: (id: string, updates: Partial<Exhibition>) => void;
  onDelete: (id: string) => void;
}

const ExhibitionEditor = ({ exhibition, onUpdate, onDelete }: ExhibitionEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(exhibition.name);
  const [description, setDescription] = useState(exhibition.description);
  const [type, setType] = useState<ExhibitionType>(exhibition.type);

  const handleSave = () => {
    onUpdate(exhibition.id, { name, description, type });
    setIsEditing(false);
    toast.success('保存しました');
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-secondary/30 rounded-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={type} onValueChange={(v) => setType(v as ExhibitionType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="常設展">常設展</SelectItem>
              <SelectItem value="企画展">企画展</SelectItem>
            </SelectContent>
          </Select>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="展示名" />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="説明" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>保存</Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>キャンセル</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg group">
      <div>
        <span className="text-xs text-primary mr-2">{exhibition.type}</span>
        <span className="font-medium">{exhibition.name}</span>
        <p className="text-sm text-muted-foreground">{exhibition.description}</p>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>編集</Button>
        <Button size="sm" variant="destructive" onClick={() => { onDelete(exhibition.id); toast.success('削除しました'); }}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Photo editor component
interface PhotoEditorProps {
  photo: { id: string; imageSrc: string; caption: string; exhibitionId: string };
  onUpdate: (id: string, updates: { caption?: string; exhibitionId?: string }) => void;
  onDelete: (id: string) => void;
}

const PhotoEditor = ({ photo, onUpdate, onDelete }: PhotoEditorProps) => {
  const { exhibitions } = useMuseumStore();
  const [caption, setCaption] = useState(photo.caption);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(photo.id, { caption });
    setIsEditing(false);
    toast.success('保存しました');
  };

  return (
    <div className="group relative">
      <div className="aspect-square rounded overflow-hidden bg-muted">
        <img src={photo.imageSrc} alt={photo.caption} className="w-full h-full object-cover" />
      </div>
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-3">
        {isEditing ? (
          <>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="キャプション"
              className="mb-2"
            />
            <div className="flex gap-2 mt-auto">
              <Button size="sm" onClick={handleSave} className="flex-1">保存</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>戻る</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm truncate mb-2">{photo.caption}</p>
            <div className="flex gap-2 mt-auto">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="flex-1">編集</Button>
              <Button size="sm" variant="destructive" onClick={() => { onDelete(photo.id); toast.success('削除しました'); }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
