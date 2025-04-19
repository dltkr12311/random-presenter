import { Category } from '@/types';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 개별 모드로 전환 시 이름 입력 필드에 자동 포커스
  useEffect(() => {
    if (!isBulkMode && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isBulkMode]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        // 파일 입력 필드에 파일 설정
        if (fileInputRef.current) {
          // 파일 입력에 드롭된 파일 할당을 위한 DataTransfer 객체 생성
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;

          // 변경 이벤트 수동 트리거
          const event = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);

          // onImageChange 호출
          onImageChange({
            target: { files: dataTransfer.files },
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }
    }
  };

  const handleImageBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      // 이미지 미리보기 지우기 위한 빈 이벤트 전달
      onImageChange({
        target: { files: null },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

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
        // 개별 추가 모드 - 개선된 UI
        <form onSubmit={onAddItem} className='space-y-4'>
          <div>
            <label className='block mb-2 text-white'>이름</label>
            <input
              type='text'
              placeholder={`${category.name} 이름`}
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              ref={nameInputRef}
              className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-white'>이미지 (선택사항)</label>
            <div
              className={`w-full border-2 border-dashed rounded-lg p-4 transition-colors ${
                isDragging
                  ? 'border-purple-400 bg-purple-500/10'
                  : 'border-white/20 bg-white/5'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!imagePreview ? (
                <div className='flex flex-col items-center justify-center py-4 text-center'>
                  <Upload className='w-12 h-12 mb-2 text-white/70' />
                  <p className='mb-2 text-sm text-white/70'>
                    이미지 파일을 드래그 앤 드롭 또는
                  </p>
                  <button
                    type='button'
                    onClick={handleImageBrowseClick}
                    className='px-4 py-2 text-sm text-white transition-colors rounded-lg bg-purple-500/50 hover:bg-purple-500'
                  >
                    파일 선택
                  </button>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={onImageChange}
                    ref={fileInputRef}
                    className='hidden'
                    aria-label='이미지 업로드'
                  />
                </div>
              ) : (
                <div className='relative'>
                  <div className='flex items-center justify-center'>
                    <div className='relative w-full max-w-xs mx-auto overflow-hidden border-2 rounded-lg aspect-square border-white/40'>
                      <Image
                        src={imagePreview}
                        alt='Preview'
                        fill
                        sizes='(max-width: 768px) 100vw, 256px'
                        className='object-cover'
                      />
                      <button
                        type='button'
                        onClick={handleClearImage}
                        className='absolute p-1 text-white transition-colors bg-red-500 rounded-full top-2 right-2 hover:bg-red-600'
                        aria-label='이미지 삭제'
                      >
                        <X className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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
