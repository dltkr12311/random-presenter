import { AnimatePresence, motion } from 'framer-motion';

interface DeleteConfirmModalProps {
  confirmDeleteCategory: string | null;
  onDeleteCategory: (slug: string) => void;
  onCancelDelete: () => void;
}

export default function DeleteConfirmModal({
  confirmDeleteCategory,
  onDeleteCategory,
  onCancelDelete,
}: DeleteConfirmModalProps) {
  if (!confirmDeleteCategory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70'
      >
        <div className='w-full max-w-md p-6 bg-white rounded-lg'>
          <h3 className='mb-4 text-lg font-bold text-gray-900'>
            카테고리 삭제 확인
          </h3>
          <p className='mb-6 text-gray-700'>
            정말로 이 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며
            모든 관련 아이템도 함께 삭제됩니다.
          </p>
          <div className='flex justify-end gap-3'>
            <button
              onClick={onCancelDelete}
              className='px-4 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300'
            >
              취소
            </button>
            <button
              onClick={() => onDeleteCategory(confirmDeleteCategory)}
              className='px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700'
            >
              삭제
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
