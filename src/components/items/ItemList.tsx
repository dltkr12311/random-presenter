import { Item } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ItemListProps {
  items: Item[];
  onDeleteItem: (itemId: string) => void;
}

export default function ItemList({ items, onDeleteItem }: ItemListProps) {
  return (
    <div className='grid grid-cols-1 gap-4 mb-12 md:grid-cols-2 lg:grid-cols-3'>
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${
            item.selected
              ? 'bg-white/20 border-green-400'
              : 'bg-white/10 border-transparent'
          } rounded-xl backdrop-blur-sm p-4 flex items-center gap-4 border-2 relative group`}
        >
          <div className='relative w-16 h-16 overflow-hidden rounded-full'>
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes='64px'
              className='object-cover'
            />
          </div>
          <div className='flex-grow'>
            <h3 className='text-xl font-medium text-white'>{item.name}</h3>
            <p className='text-white/70'>
              {item.selected ? '선택 완료' : '대기 중'}
            </p>
          </div>
          <button
            onClick={() => onDeleteItem(item.id)}
            className='absolute p-1 text-white transition-opacity rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 bg-red-500/70 hover:bg-red-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </motion.div>
      ))}
    </div>
  );
}
