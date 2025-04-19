'use client';

import CategoryList from '@/components/CategoryList';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import HelpContent from '@/components/HelpContent';
import ItemForm from '@/components/ItemForm';
import ItemList from '@/components/ItemList';
import RandomSelector from '@/components/RandomSelector';
import TemplateSelector from '@/components/TemplateSelector';
import UndoNotification from '@/components/UndoNotification';
import { useCategoryViewModel } from '@/viewmodels/useCategoryViewModel';
import { useItemViewModel } from '@/viewmodels/useItemViewModel';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // 카테고리 뷰모델
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    newCategoryName,
    setNewCategoryName,
    newCategoryIcon,
    setNewCategoryIcon,
    showTemplates,
    setShowTemplates,
    confirmDeleteCategory,
    addCategory,
    createFromTemplate,
    confirmDelete,
    cancelDelete,
    deleteCategory,
    templates,
  } = useCategoryViewModel();

  // 아이템 뷰모델 (선택된 카테고리에 종속)
  const {
    items,
    selectedItem,
    isSpinning,
    isUndoVisible,
    newItemName,
    setNewItemName,
    imagePreview,
    isUploading,
    bulkItemsText,
    setBulkItemsText,
    isBulkMode,
    setIsBulkMode,
    handleImageChange,
    handleAddItem,
    handleAddBulkItems,
    deleteItem,
    undoDelete,
    selectRandom,
    shareResult,
  } = useItemViewModel(selectedCategory?.slug || null);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드 렌더링 중에는 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

  const selectedCount = items.filter(item => item.selected).length;
  const totalItems = items.length;

  return (
    <main className='min-h-screen p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'>
      <div className='container max-w-5xl px-4 py-12 mx-auto'>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='mb-8 text-5xl font-bold text-center text-white'
        >
          랜덤 선택기
        </motion.h1>

        {/* 상단 버튼 영역 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex justify-between mb-4'
        >
          {/* 템플릿 버튼 */}
          <button
            onClick={() => setShowTemplates(prev => !prev)}
            className='flex items-center gap-1 px-4 py-2 text-white transition-colors rounded-lg bg-white/20 hover:bg-white/30'
          >
            <span>{showTemplates ? '템플릿 닫기' : '빠른 시작 템플릿'}</span>
            <span>{showTemplates ? '❌' : '📋'}</span>
          </button>

          {/* 도움말 버튼 */}
          <button
            onClick={() => setShowHelp(prev => !prev)}
            className='flex items-center gap-1 px-4 py-2 text-white transition-colors rounded-lg bg-white/20 hover:bg-white/30'
          >
            <span>{showHelp ? '도움말 닫기' : '도움말'}</span>
            <span>{showHelp ? '❌' : '❓'}</span>
          </button>
        </motion.div>

        {/* 템플릿 선택 */}
        <TemplateSelector
          templates={templates}
          showTemplates={showTemplates}
          onCreateFromTemplate={createFromTemplate}
        />

        {/* 도움말 내용 */}
        <HelpContent showHelp={showHelp} />

        {/* 카테고리 선택 */}
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onDeleteCategory={confirmDelete}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          newCategoryIcon={newCategoryIcon}
          setNewCategoryIcon={setNewCategoryIcon}
          onAddCategory={addCategory}
        />

        {selectedCategory && (
          <>
            {/* 진행 상황 및 랜덤 선택 */}
            <RandomSelector
              category={selectedCategory}
              items={items}
              selectedItem={selectedItem}
              isSpinning={isSpinning}
              totalItems={totalItems}
              selectedCount={selectedCount}
              onSelectRandom={selectRandom}
              onShareResult={shareResult}
            />

            {/* 아이템 목록 */}
            <ItemList items={items} onDeleteItem={deleteItem} />

            {/* 새 아이템 추가 */}
            <ItemForm
              category={selectedCategory}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              imagePreview={imagePreview}
              isUploading={isUploading}
              bulkItemsText={bulkItemsText}
              setBulkItemsText={setBulkItemsText}
              isBulkMode={isBulkMode}
              setIsBulkMode={setIsBulkMode}
              onImageChange={handleImageChange}
              onAddItem={handleAddItem}
              onAddBulkItems={handleAddBulkItems}
            />
          </>
        )}

        {/* 실행 취소 알림 */}
        <UndoNotification isVisible={isUndoVisible} onUndo={undoDelete} />

        {/* 카테고리 삭제 확인 모달 */}
        <DeleteConfirmModal
          confirmDeleteCategory={confirmDeleteCategory}
          onDeleteCategory={deleteCategory}
          onCancelDelete={cancelDelete}
        />
      </div>
    </main>
  );
}
