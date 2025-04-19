import { Category } from '@/types';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, Upload, UtensilsCrossed, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// 가격대 옵션
const PRICE_RANGES = [
  { value: '저렴', label: '저렴 (만원 미만)' },
  { value: '보통', label: '보통 (1-3만원)' },
  { value: '비싼', label: '비싼 (3만원 이상)' },
];

// 음식 종류 옵션
const FOOD_TYPES = [
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '패스트푸드',
  '카페/디저트',
  '술집',
  '기타',
];

interface FoodItemFormProps {
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
  onAddItem: (
    e: React.FormEvent,
    foodDetails?: {
      foodType?: string;
      priceRange?: string;
      location?: string;
      address?: string;
    }
  ) => void;
  onAddBulkItems: (e: React.FormEvent) => void;
}

export default function FoodItemForm({
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
}: FoodItemFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 음식 특화 필드
  const [foodType, setFoodType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [address, setAddress] = useState<string>('');

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
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;

          const event = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);

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
      onImageChange({
        target: { files: null },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 음식 세부 정보 추가
    const foodDetails = {
      foodType,
      priceRange,
      location,
      address,
    };

    onAddItem(e, foodDetails);

    // 폼 초기화
    setFoodType('');
    setPriceRange('');
    setLocation('');
    setAddress('');
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
              여러 음식 한번에 추가 (줄바꿈으로 구분)
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
        // 개별 추가 모드 - 음식 특화 UI
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* 기본 정보 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block mb-2 text-white'>음식명</label>
              <input
                type='text'
                placeholder='음식 이름'
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                ref={nameInputRef}
                className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
                required
              />
            </div>

            <div>
              <label className='flex items-center mb-2 space-x-2 text-white'>
                <UtensilsCrossed className='w-4 h-4' />
                <span>음식 종류</span>
              </label>
              <select
                value={foodType}
                onChange={e => setFoodType(e.target.value)}
                className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
              >
                <option value=''>선택하세요</option>
                {FOOD_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 음식 추가 정보 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='flex items-center mb-2 space-x-2 text-white'>
                <DollarSign className='w-4 h-4' />
                <span>가격대</span>
              </label>
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
              >
                <option value=''>선택하세요</option>
                {PRICE_RANGES.map(price => (
                  <option key={price.value} value={price.value}>
                    {price.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='flex items-center mb-2 space-x-2 text-white'>
                <MapPin className='w-4 h-4' />
                <span>위치 정보</span>
              </label>
              <input
                type='text'
                placeholder='위치 (예: 강남, 홍대 등)'
                value={location}
                onChange={e => setLocation(e.target.value)}
                className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
              />
            </div>
          </div>

          <div>
            <label className='block mb-2 text-white'>주소 (선택사항)</label>
            <input
              type='text'
              placeholder='상세 주소'
              value={address}
              onChange={e => setAddress(e.target.value)}
              className='w-full px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className='block mb-2 text-white'>
              음식 이미지 (선택사항)
            </label>
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
