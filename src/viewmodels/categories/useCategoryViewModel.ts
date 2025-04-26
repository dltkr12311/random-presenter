import {
  createCategory,
  createCategoryFromTemplate,
  deleteCategory as deleteCategoryModel,
  fetchAllCategories,
  templates,
} from '@/models';
import { Category, CategoryType } from '@/types';
import { useEffect, useState } from 'react';

export const useCategoryViewModel = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState<
    string | null
  >(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('🎲');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 목록 로드
  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllCategories();
      setCategories(data);

      // 카테고리가 있으면 첫 번째 카테고리 선택 (선택된 카테고리가 없을 때만)
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0]);
      }
    } catch (err) {
      setError('카테고리를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    loadCategories();
  }, []);

  // 새 카테고리 추가
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // 아이콘에 따라 기본 타입 추론
      let type = CategoryType.GENERAL; // 기본 타입
      if (newCategoryIcon === '🍽️') type = CategoryType.FOOD;
      else if (newCategoryIcon === '👨‍💼') type = CategoryType.PERSON;
      else if (newCategoryIcon === '🎮') type = CategoryType.ACTIVITY;

      const newCategory = await createCategory(
        newCategoryName,
        newCategoryIcon,
        type // 타입 정보 추가
      );

      if (newCategory) {
        setNewCategoryName('');
        setNewCategoryIcon('🎲');
        await loadCategories();
      } else {
        setError('카테고리 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('카테고리 생성에 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 템플릿으로 카테고리 생성
  const createFromTemplate = async (templateIndex: number) => {
    if (templateIndex < 0 || templateIndex >= templates.length) {
      setError('유효하지 않은 템플릿입니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const template = templates[templateIndex];
      const newCategory = await createCategoryFromTemplate(
        template.name,
        template.icon,
        template.items
      );

      if (newCategory) {
        setShowTemplates(false);
        await loadCategories();
        setSelectedCategory(newCategory);
      } else {
        setError('템플릿으로 카테고리 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('템플릿으로 카테고리 생성에 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 삭제 시도
  const confirmDelete = (slug: string) => {
    setConfirmDeleteCategory(slug);
  };

  // 삭제 취소
  const cancelDelete = () => {
    setConfirmDeleteCategory(null);
  };

  // 카테고리 삭제
  const deleteCategory = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await deleteCategoryModel(slug);

      if (success) {
        if (selectedCategory?.slug === slug) {
          setSelectedCategory(null);
        }
        await loadCategories();
      } else {
        setError('카테고리 삭제에 실패했습니다.');
      }
      setConfirmDeleteCategory(null); // 모달 닫기
    } catch (err) {
      setError('카테고리 삭제에 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
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
  };
};
