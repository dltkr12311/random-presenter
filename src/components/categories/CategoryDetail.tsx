import { Category, CategoryType } from '@/types';
import { useItemViewModel } from '@/viewmodels/useItemViewModel';
import { useState } from 'react';
import FoodItemForm from './FoodItemForm';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import RandomSelector from './RandomSelector';

interface CategoryDetailProps {
  category: Category;
  onUpdate: () => void;
}

// 탭 타입 정의 (가능한 모든 탭 포함)
type TabType = 'items' | 'random' | 'map' | 'filters' | 'settings';

export default function CategoryDetail({
  category,
  onUpdate,
}: CategoryDetailProps) {
  // 가능한 모든 탭을 포함하도록 타입 수정
  const [activeTab, setActiveTab] = useState<TabType>('items');

  // 카테고리 slug 전달
  const {
    items,
    newItemName,
    imagePreview,
    isUploading,
    bulkItemsText,
    isBulkMode,
    setNewItemName,
    setBulkItemsText,
    setIsBulkMode,
    handleImageChange: onImageChange,
    handleAddItem: addItem,
    handleAddBulkItems: addBulkItems,
    deleteItem,
    selectRandom: setRandomItem,
  } = useItemViewModel(category.slug);

  // 음식 세부 정보 처리 함수
  const handleAddFoodItem = async (
    e: React.FormEvent,
    foodDetails?: {
      foodType?: string;
      priceRange?: string;
      location?: string;
      address?: string;
    }
  ) => {
    // foodDetails를 함께 전달하여 음식 상세 정보 저장
    await addItem(e, foodDetails);
  };

  return (
    <div className='container p-6 mx-auto'>
      <h1 className='mb-6 text-3xl font-bold text-white'>{category.name}</h1>

      {/* 탭 네비게이션 */}
      <div className='flex mb-8 space-x-2 overflow-x-auto border-b border-white/20'>
        <button
          className={`px-4 py-2 text-white transition-colors rounded-t-lg ${
            activeTab === 'items' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('items')}
        >
          아이템 관리
        </button>
        <button
          className={`px-4 py-2 text-white transition-colors rounded-t-lg ${
            activeTab === 'random' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('random')}
        >
          랜덤 선택
        </button>

        {/* 카테고리 타입이 FOOD인 경우에만 추가 탭 표시 */}
        {category.type === CategoryType.FOOD && (
          <>
            <button
              className={`px-4 py-2 text-white transition-colors rounded-t-lg ${
                activeTab === 'map' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('map')}
            >
              지도 보기
            </button>
            <button
              className={`px-4 py-2 text-white transition-colors rounded-t-lg ${
                activeTab === 'filters' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('filters')}
            >
              필터
            </button>
          </>
        )}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'items' && (
        <div className='space-y-8'>
          {/* 카테고리 타입에 따라 다른 폼 표시 */}
          {category.type === CategoryType.FOOD ? (
            <FoodItemForm
              category={category}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              imagePreview={imagePreview}
              isUploading={isUploading}
              bulkItemsText={bulkItemsText}
              setBulkItemsText={setBulkItemsText}
              isBulkMode={isBulkMode}
              setIsBulkMode={setIsBulkMode}
              onImageChange={onImageChange}
              onAddItem={handleAddFoodItem}
              onAddBulkItems={addBulkItems}
            />
          ) : (
            <ItemForm
              category={category}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              imagePreview={imagePreview}
              isUploading={isUploading}
              bulkItemsText={bulkItemsText}
              setBulkItemsText={setBulkItemsText}
              isBulkMode={isBulkMode}
              setIsBulkMode={setIsBulkMode}
              onImageChange={onImageChange}
              onAddItem={addItem}
              onAddBulkItems={addBulkItems}
            />
          )}

          <ItemList items={items} onDeleteItem={deleteItem} />
        </div>
      )}

      {activeTab === 'random' && (
        <RandomSelector
          category={category}
          items={items}
          onSelectRandom={setRandomItem}
        />
      )}

      {/* 카테고리 타입에 따른 추가 탭 콘텐츠 */}
      {category.type === CategoryType.FOOD && activeTab === 'map' && (
        <div className='p-6 bg-white/10 rounded-xl'>
          <h2 className='mb-4 text-xl font-bold text-white'>지도 보기</h2>
          <p className='text-white/70'>
            지도 기능은 아직 개발 중입니다. 곧 제공될 예정입니다.
          </p>
        </div>
      )}

      {category.type === CategoryType.FOOD && activeTab === 'filters' && (
        <div className='p-6 bg-white/10 rounded-xl'>
          <h2 className='mb-4 text-xl font-bold text-white'>음식 필터</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <h3 className='mb-2 text-lg font-medium text-white'>
                가격대 필터
              </h3>
              <div className='space-y-2'>
                {['저렴', '보통', '비싼'].map(price => (
                  <div key={price} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`price-${price}`}
                      className='w-4 h-4 mr-2 accent-purple-500'
                    />
                    <label htmlFor={`price-${price}`} className='text-white'>
                      {price}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium text-white'>
                음식 종류 필터
              </h3>
              <div className='space-y-2'>
                {['한식', '중식', '일식', '양식', '기타'].map(type => (
                  <div key={type} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`type-${type}`}
                      className='w-4 h-4 mr-2 accent-purple-500'
                    />
                    <label htmlFor={`type-${type}`} className='text-white'>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
