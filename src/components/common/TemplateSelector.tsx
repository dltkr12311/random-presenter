import { CategoryType } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

interface Template {
  name: string;
  icon: string;
  items: string[];
  type?: CategoryType;
}

interface TemplateSelectorProps {
  templates: Template[];
  showTemplates: boolean;
  onCreateFromTemplate: (templateIndex: number) => void;
}

export default function TemplateSelector({
  templates,
  showTemplates,
  onCreateFromTemplate,
}: TemplateSelectorProps) {
  if (!showTemplates) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className='p-6 mb-8 overflow-hidden text-white bg-white/10 backdrop-blur-sm rounded-xl'
      >
        <h2 className='mb-4 text-2xl font-bold'>템플릿으로 빠르게 시작하기</h2>
        <p className='mb-4'>
          아래 템플릿 중 하나를 선택하여 미리 정의된 카테고리와 아이템으로
          시작하세요.
        </p>

        <div className='grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-4'>
          {templates.map((template, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCreateFromTemplate(idx)}
              className='p-4 text-left transition-colors bg-white/20 hover:bg-white/30 rounded-xl'
            >
              <div className='mb-2 text-3xl'>{template.icon}</div>
              <h3 className='text-lg font-bold'>{template.name}</h3>
              <p className='text-sm text-white/70'>
                {template.items.length}개 아이템 포함
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
