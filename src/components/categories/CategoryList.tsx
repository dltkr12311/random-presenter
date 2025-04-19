import { Category } from '@/types';
import { motion } from 'framer-motion';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onDeleteCategory: (slug: string) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  newCategoryIcon: string;
  setNewCategoryIcon: (icon: string) => void;
  onAddCategory: (e: React.FormEvent) => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onDeleteCategory,
  newCategoryName,
  setNewCategoryName,
  newCategoryIcon,
  setNewCategoryIcon,
  onAddCategory,
}: CategoryListProps) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='p-6 mb-8 bg-white/10 rounded-xl backdrop-blur-sm'
    >
      <h2 className='mb-4 text-2xl font-bold text-white'>카테고리 선택</h2>
      <div className='flex flex-wrap gap-2 mb-4'>
        {categories.map(category => (
          <div key={category.id} className='relative group'>
            <button
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                selectedCategory?.id === category.id
                  ? 'bg-white text-purple-700 font-medium'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
            <button
              onClick={() => onDeleteCategory(category.slug)}
              className='absolute top-0 right-0 p-1 -mt-2 -mr-2 text-white transition-opacity bg-red-500 rounded-full opacity-0 group-hover:opacity-100'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4'
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
          </div>
        ))}
      </div>

      {/* 새 카테고리 추가 */}
      <form
        onSubmit={onAddCategory}
        className='flex flex-col gap-2 mt-4 sm:flex-row'
      >
        <div className='flex flex-grow gap-2'>
          <input
            type='text'
            placeholder='새 카테고리 이름'
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className='flex-grow px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
            required
          />
          <select
            value={newCategoryIcon}
            onChange={e => setNewCategoryIcon(e.target.value)}
            className='px-4 py-2 text-white border rounded-lg bg-white/10 placeholder-white/60 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40'
          >
            <option value='🎲'>🎲 주사위</option>
            <option value='👨‍💼'>👨‍💼 발표자</option>
            <option value='🍽️'>🍽️ 음식</option>
            <option value='✈️'>✈️ 여행</option>
            <option value='🎬'>🎬 영화</option>
            <option value='🎮'>🎮 게임</option>
            <option value='📚'>📚 도서</option>
          </select>
        </div>
        <button
          type='submit'
          className='flex-shrink-0 px-6 py-2 font-medium text-purple-700 transition-colors bg-white rounded-lg hover:bg-white/90'
        >
          추가
        </button>
      </form>
    </motion.div>
  );
}
