import { Category } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ItemFormProps {
  category: Category;
  newItemName: string;
  setNewItemName: (name: string) => void;
  imagePreview: string | null;
  isUploading: boolean;
  bulkItemsText: string;
  setBulkItemsText: (text: string) => void;
  isBulkMode: boolean;
  setIsBulkMode: (mode: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddItem: (e: React.FormEvent) => void;
  onAddBulkItems: (e: React.FormEvent) => void;
}

export default function ItemForm({
  category,
  newItemName,
  setNewItemName,
  imagePreview,
  isUploading,
  bulkItemsText,
  setBulkItemsText,
  isBulkMode,
  setIsBulkMode,
  onImageChange,
  onAddItem,
  onAddBulkItems,
}: ItemFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='p-6 mb-12 bg-white/10 rounded-xl backdrop-blur-sm'
    >
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold text-white'>
          새 {category.name} 추가
        </h2>
        <button
          onClick={() => setIsBulkMode(!isBulkMode)}
          className='px-4 py-2 text-sm text-white transition-colors rounded-lg bg-purple-500/70 hover:bg-purple-500'
        >
          {isBulkMode ? '개별 추가 모드' : '대량 추가 모드'}
        </button>
      </div>

      {isBulkMode ? (
        // 대량 추가 모드
        <form onSubmit={onAddBulkItems} className='space-y-4'>
          <div>
            <label className='block mb-2 text-white'>
              여러 아이템 한번에 추가 (줄바꿈으로 구분)
            </label>
            <textarea
              placeholder={`${category.name}1\n${category.name}2\n${category.name}3`}
              value={bulkItemsText}
              onChange={e => setBulkItemsText(e.target.value)}
              className='w-full h-40 px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
              required
            />
          </div>

          <div className='flex justify-center'>
            <button
              type='submit'
              disabled={isUploading}
              className='px-6 py-3 font-bold text-purple-700 transition-colors bg-white rounded-lg hover:bg-white/90 disabled:opacity-70 disabled:cursor-wait'
            >
              {isUploading ? '추가 중...' : '일괄 추가'}
            </button>
          </div>
        </form>
      ) : (
        // 개별 추가 모드
        <form onSubmit={onAddItem} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block mb-2 text-white'>이름</label>
              <input
                type='text'
                placeholder={`${category.name} 이름`}
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
                required
              />
            </div>
            <div>
              <label className='block mb-2 text-white'>이미지 (선택사항)</label>
              <input
                type='file'
                accept='image/*'
                onChange={onImageChange}
                className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500'
              />
            </div>
          </div>

          {imagePreview && (
            <div className='flex justify-center'>
              <div className='relative w-32 h-32 overflow-hidden border-2 rounded-lg border-white/40'>
                <Image
                  src={imagePreview}
                  alt='Preview'
                  fill
                  sizes='128px'
                  className='object-cover'
                />
              </div>
            </div>
          )}

          <div className='flex justify-center'>
            <button
              type='submit'
              disabled={isUploading}
              className='px-6 py-3 font-bold text-purple-700 transition-colors bg-white rounded-lg hover:bg-white/90 disabled:opacity-70 disabled:cursor-wait'
            >
              {isUploading ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
