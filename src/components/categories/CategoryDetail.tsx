import { Category, CategoryType } from '@/types';
import { useItemViewModel } from '@/viewmodels/items/useItemViewModel';
import { ArrowRight, Filter, Map, Package, Pin, Settings } from 'lucide-react';
import { useState } from 'react';
import FoodItemForm from '../items/food/FoodItemForm';
import ItemForm from '../items/ItemForm';
import ItemList from '../items/ItemList';
import RandomSelector from '../items/RandomSelector';

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
    selectedItem,
    isSpinning,
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
    shareResult,
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

  const selectedCount = items.filter(item => item.selected).length || 0;
  const totalItems = items.length || 0;

  return (
    <div className='container p-6 mx-auto mb-8 rounded-xl bg-white/10 backdrop-blur-sm'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-white flex items-center gap-2'>
          <span>{category.icon}</span>
          <span>{category.name}</span>
          {category.type === CategoryType.FOOD && (
            <span className='px-2 py-1 text-xs bg-orange-500 rounded-full text-white'>
              음식
            </span>
          )}
          {category.type === CategoryType.PERSON && (
            <span className='px-2 py-1 text-xs bg-blue-500 rounded-full text-white'>
              인물
            </span>
          )}
          {category.type === CategoryType.ACTIVITY && (
            <span className='px-2 py-1 text-xs bg-green-500 rounded-full text-white'>
              활동
            </span>
          )}
        </h1>

        <div className='flex gap-2'>
          <button
            className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-1'
            onClick={() => setActiveTab('random')}
          >
            <ArrowRight size={16} />
            <span>바로 랜덤 선택</span>
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className='flex mb-8 space-x-2 overflow-x-auto border-b border-white/20'>
        <button
          className={`px-4 py-2 text-white transition-colors rounded-t-lg flex items-center gap-1 ${
            activeTab === 'items'
              ? 'bg-white/20 font-medium'
              : 'hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('items')}
        >
          <Package size={16} />
          <span>아이템 관리</span>
        </button>
        <button
          className={`px-4 py-2 text-white transition-colors rounded-t-lg flex items-center gap-1 ${
            activeTab === 'random'
              ? 'bg-white/20 font-medium'
              : 'hover:bg-white/10'
          }`}
          onClick={() => setActiveTab('random')}
        >
          <span>🎲</span>
          <span>랜덤 선택</span>
        </button>

        {/* 카테고리 타입이 FOOD인 경우에만 추가 탭 표시 */}
        {category.type === CategoryType.FOOD && (
          <>
            <button
              className={`px-4 py-2 text-white transition-colors rounded-t-lg flex items-center gap-1 ${
                activeTab === 'map'
                  ? 'bg-white/20 font-medium'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('map')}
            >
              <Map size={16} />
              <span>지도 보기</span>
            </button>
            <button
              className={`px-4 py-2 text-white transition-colors rounded-t-lg flex items-center gap-1 ${
                activeTab === 'filters'
                  ? 'bg-white/20 font-medium'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('filters')}
            >
              <Filter size={16} />
              <span>필터</span>
            </button>
            <button
              className={`px-4 py-2 text-white transition-colors rounded-t-lg flex items-center gap-1 ${
                activeTab === 'settings'
                  ? 'bg-white/20 font-medium'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} />
              <span>설정</span>
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
          selectedItem={selectedItem}
          isSpinning={isSpinning}
          totalItems={totalItems}
          selectedCount={selectedCount}
          onSelectRandom={setRandomItem}
          onShareResult={shareResult}
        />
      )}

      {/* 카테고리 타입에 따른 추가 탭 콘텐츠 */}
      {category.type === CategoryType.FOOD && activeTab === 'map' && (
        <div className='p-6 bg-white/10 rounded-xl'>
          <h2 className='mb-4 text-xl font-bold text-white flex items-center gap-2'>
            <Map size={20} />
            <span>음식점 지도 보기</span>
          </h2>

          <div className='h-80 bg-white/5 rounded-lg flex items-center justify-center'>
            <div className='text-center'>
              <Pin size={40} className='mx-auto mb-4 text-white/50' />
              <p className='text-white/70'>
                지도 기능은 아직 개발 중입니다. 곧 제공될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {category.type === CategoryType.FOOD && activeTab === 'filters' && (
        <div className='p-6 bg-white/10 rounded-xl'>
          <h2 className='mb-4 text-xl font-bold text-white flex items-center gap-2'>
            <Filter size={20} />
            <span>음식 필터</span>
          </h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='bg-white/5 p-4 rounded-lg'>
              <h3 className='mb-4 text-lg font-medium text-white'>
                가격대 필터
              </h3>
              <div className='space-y-3'>
                {['저렴', '보통', '비싼'].map(price => (
                  <div key={price} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`price-${price}`}
                      className='w-5 h-5 mr-3 accent-purple-500'
                    />
                    <label htmlFor={`price-${price}`} className='text-white'>
                      {price}
                      {price === '저렴' && (
                        <span className='text-sm text-white/70 ml-2'>
                          (만원 미만)
                        </span>
                      )}
                      {price === '보통' && (
                        <span className='text-sm text-white/70 ml-2'>
                          (1-3만원)
                        </span>
                      )}
                      {price === '비싼' && (
                        <span className='text-sm text-white/70 ml-2'>
                          (3만원 이상)
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-white/5 p-4 rounded-lg'>
              <h3 className='mb-4 text-lg font-medium text-white'>
                음식 종류 필터
              </h3>
              <div className='grid grid-cols-2 gap-3'>
                {[
                  '한식',
                  '중식',
                  '일식',
                  '양식',
                  '분식',
                  '카페',
                  '패스트푸드',
                  '기타',
                ].map(type => (
                  <div key={type} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`type-${type}`}
                      className='w-5 h-5 mr-3 accent-purple-500'
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

      {category.type === CategoryType.FOOD && activeTab === 'settings' && (
        <div className='p-6 bg-white/10 rounded-xl'>
          <h2 className='mb-4 text-xl font-bold text-white flex items-center gap-2'>
            <Settings size={20} />
            <span>음식 카테고리 설정</span>
          </h2>
          <div className='space-y-6'>
            <div className='bg-white/5 p-4 rounded-lg'>
              <h3 className='text-lg font-medium text-white mb-3'>
                랜덤 선택 설정
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='exclude-recent'
                    className='w-5 h-5 mr-3 accent-purple-500'
                  />
                  <label htmlFor='exclude-recent' className='text-white'>
                    최근 선택된 음식 제외하기
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='price-balance'
                    className='w-5 h-5 mr-3 accent-purple-500'
                  />
                  <label htmlFor='price-balance' className='text-white'>
                    가격대 균형 맞추기
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
