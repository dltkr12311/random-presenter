import { AnimatePresence, motion } from 'framer-motion';

interface UndoNotificationProps {
  isVisible: boolean;
  onUndo: () => void;
}

export default function UndoNotification({
  isVisible,
  onUndo,
}: UndoNotificationProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className='fixed flex items-center gap-3 px-6 py-3 text-purple-700 bg-white rounded-lg shadow-lg bottom-4 right-4'
      >
        <p>아이템이 삭제되었습니다</p>
        <button onClick={onUndo} className='font-bold underline'>
          실행 취소
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
