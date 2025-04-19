import { AnimatePresence, motion } from 'framer-motion';

interface HelpContentProps {
  showHelp: boolean;
}

export default function HelpContent({ showHelp }: HelpContentProps) {
  if (!showHelp) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className='p-6 mb-8 overflow-hidden text-white bg-white/10 backdrop-blur-sm rounded-xl'
      >
        <h2 className='mb-4 text-2xl font-bold'>랜덤 선택기 사용법</h2>
        <ol className='pl-6 space-y-2 list-decimal'>
          <li>
            <strong>카테고리 추가</strong>: 카테고리 선택 섹션에서 새 카테고리를
            생성합니다.
          </li>
          <li>
            <strong>아이템 추가</strong>: 카테고리 선택 후, 아래 폼에서 개별
            아이템을 추가하거나 대량 추가 기능을 사용합니다.
          </li>
          <li>
            <strong>랜덤 선택</strong>: 카테고리와 아이템이 준비되면 '랜덤 선택'
            버튼을 클릭합니다.
          </li>
          <li>
            <strong>사이클 관리</strong>: 모든 아이템이 선택되면 자동으로 새
            사이클이 시작됩니다.
          </li>
          <li>
            <strong>아이템 삭제</strong>: 아이템에 마우스를 올리면 나타나는 삭제
            버튼을 클릭합니다. 실수로 삭제한 경우 5초 이내에 실행 취소
            가능합니다.
          </li>
        </ol>
        <p className='mt-4'>더 많은 기능은 지속적으로 업데이트됩니다!</p>
      </motion.div>
    </AnimatePresence>
  );
}
