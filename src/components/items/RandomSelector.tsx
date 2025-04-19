import { Category, Item } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface RandomSelectorProps {
  category: Category;
  items: Item[];
  onSelectRandom: () => Promise<void>;
}

export default function RandomSelector({
  category,
  items,
  onSelectRandom,
}: RandomSelectorProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // 현재 선택된 항목 계산
  const selectedCount = items.filter(item => item.selected).length;
  const totalItems = items.length;

  // 선택된 항목이 변경되면 업데이트
  useEffect(() => {
    if (items.length > 0) {
      const lastSelected = items.find(
        item => item.selected && item.lastSelectedAt
      );
      if (lastSelected) {
        setSelectedItem(lastSelected);
      }
    }
  }, [items]);

  // 랜덤 선택 처리
  const handleSelectRandom = async () => {
    setIsSpinning(true);

    // 드럼롤 효과
    const interval = setInterval(() => {
      if (items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length);
        setSelectedItem(items[randomIndex]);
      }
    }, 100);

    // 실제 선택 실행
    await onSelectRandom();

    // 드럼롤 종료
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
    }, 2000);
  };

  // 결과 공유
  const handleShareResult = () => {
    if (!selectedItem) return;

    if (navigator.share) {
      navigator
        .share({
          title: `랜덤 ${category.name} 선택 결과`,
          text: `오늘의 ${category.name}: ${selectedItem.name}`,
        })
        .catch(err => {
          console.error('공유 실패:', err);
        });
    } else {
      // 클립보드 복사 대체
      navigator.clipboard.writeText(
        `오늘의 ${category.name}: ${selectedItem.name}`
      );
      alert('클립보드에 복사되었습니다!');
    }
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='p-6 mb-8 bg-white/10 rounded-xl backdrop-blur-sm'
    >
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-3xl'>{category.icon}</span>
        <h2 className='text-2xl font-bold text-white'>{category.name}</h2>
      </div>
      <div className='flex flex-col items-center justify-between gap-4 mb-4 text-white md:flex-row'>
        <span className='text-lg'>전체: {totalItems}개</span>
        <span className='text-lg'>선택 완료: {selectedCount}개</span>
        <span className='text-lg'>
          남은 항목: {totalItems - selectedCount}개
        </span>
      </div>

      {totalItems > 0 && (
        <div className='w-full h-4 mb-6 rounded-full bg-white/10'>
          <div
            className='h-4 transition-all duration-500 bg-white rounded-full'
            style={{
              width: `${totalItems ? (selectedCount / totalItems) * 100 : 0}%`,
            }}
          ></div>
        </div>
      )}

      <div className='flex justify-center'>
        <button
          onClick={handleSelectRandom}
          disabled={isSpinning || items.length === 0}
          className='px-8 py-3 text-lg font-bold text-purple-700 transition-colors bg-white rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSpinning ? '선택 중...' : `랜덤 ${category.name} 선택`}
        </button>
      </div>

      {/* 선택된 아이템 표시 */}
      <AnimatePresence mode='wait'>
        {selectedItem && (
          <motion.div
            key={isSpinning ? 'spinning' : 'selected'}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='flex flex-col items-center p-6 mt-8 bg-white/20 rounded-xl backdrop-blur-md'
          >
            <h3 className='mb-2 text-xl text-white'>
              {isSpinning ? '선택 중...' : '선택 완료!'}
            </h3>
            <div className='relative w-24 h-24 my-2 overflow-hidden border-4 border-white rounded-full'>
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                fill
                sizes='96px'
                className='object-cover'
              />
            </div>
            <p className='mt-2 text-2xl font-bold text-white'>
              {selectedItem.name}
            </p>

            {/* 공유 버튼 추가 */}
            {!isSpinning && (
              <button
                onClick={handleShareResult}
                className='flex items-center gap-2 px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-white/30 hover:bg-white/40'
              >
                <span>공유하기</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
                  />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
