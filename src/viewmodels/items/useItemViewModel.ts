import {
  addBulkItems,
  addItem,
  deleteItem as deleteItemModel,
  fetchCategoryItems,
  restoreItem,
  selectRandomItem,
  uploadImage,
} from '@/models';
import { Item } from '@/types';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

export const useItemViewModel = (categorySlug: string | null) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemImage, setNewItemImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [bulkItemsText, setBulkItemsText] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isUndoVisible, setIsUndoVisible] = useState(false);
  const [lastDeletedItem, setLastDeletedItem] = useState<{
    id: string;
    data: any;
  } | null>(null);
  const [drumrollCount, setDrumrollCount] = useState(0);
  const [cycleCompleted, setCycleCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 아이템 로드
  const loadItems = async () => {
    if (!categorySlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCategoryItems(categorySlug);
      setItems(data);

      if (data.length > 0 && data.every((item: Item) => item.selected)) {
        setCycleCompleted(true);
      } else {
        setCycleCompleted(false);
      }
    } catch (err) {
      setError('아이템을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 변경 시 아이템 로드
  useEffect(() => {
    if (categorySlug) {
      loadItems();
    } else {
      setItems([]);
    }
  }, [categorySlug]);

  // 이미지 업로드 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewItemImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 새 아이템 추가
  const handleAddItem = async (
    e: React.FormEvent,
    foodDetails?: {
      foodType?: string;
      priceRange?: string;
      location?: string;
      address?: string;
    }
  ) => {
    e.preventDefault();
    if (!newItemName.trim() || !categorySlug) return;

    setIsUploading(true);
    setError(null);

    try {
      let imageUrl = '/default-avatar.png';

      if (newItemImage) {
        try {
          imageUrl = await uploadImage(newItemImage);
        } catch (error) {
          console.error('Failed to upload image:', error);
          // 이미지 업로드 실패 시 기본 이미지 사용
        }
      }

      // 음식 관련 추가 정보가 있는 경우
      const newItem = await addItem(
        categorySlug,
        newItemName,
        imageUrl,
        foodDetails
      );

      if (newItem) {
        setNewItemName('');
        setNewItemImage(null);
        setImagePreview(null);
        await loadItems();
      } else {
        setError('아이템 추가에 실패했습니다.');
      }
    } catch (err) {
      setError('아이템 추가에 실패했습니다.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // 아이템 대량 추가
  const handleAddBulkItems = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkItemsText.trim() || !categorySlug) return;

    const itemNames = bulkItemsText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (itemNames.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const success = await addBulkItems(categorySlug, itemNames);

      if (success) {
        setBulkItemsText('');
        setIsBulkMode(false);
        await loadItems();
      } else {
        setError('아이템 대량 추가에 실패했습니다.');
      }
    } catch (err) {
      setError('아이템 대량 추가에 실패했습니다.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // 아이템 삭제
  const deleteItem = async (itemId: string) => {
    if (!categorySlug) return;

    try {
      // 먼저 아이템 정보를 저장해둡니다 (복원용)
      const itemToDelete = items.find(item => item.id === itemId);
      if (itemToDelete) {
        setLastDeletedItem({
          id: itemId,
          data: itemToDelete,
        });
        setIsUndoVisible(true);

        // 5초 후에 실행취소 옵션 숨기기
        setTimeout(() => {
          setIsUndoVisible(false);
        }, 5000);
      }

      const success = await deleteItemModel(categorySlug, itemId);

      if (success) {
        await loadItems();
      } else {
        setError('아이템 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('아이템 삭제에 실패했습니다.');
      console.error(err);
    }
  };

  // 삭제 실행 취소
  const undoDelete = async () => {
    if (!lastDeletedItem || !categorySlug) return;

    try {
      setIsUndoVisible(false);

      const restoredItem = await restoreItem(
        categorySlug,
        lastDeletedItem.data.name,
        lastDeletedItem.data.imageUrl,
        lastDeletedItem.data.selected
      );

      if (restoredItem) {
        setLastDeletedItem(null);
        await loadItems();
      } else {
        setError('아이템 복원에 실패했습니다.');
      }
    } catch (err) {
      setError('아이템 복원에 실패했습니다.');
      console.error(err);
    }
  };

  // 랜덤 선택
  const selectRandom = async () => {
    if (!items.length || !categorySlug) return;

    setIsSpinning(true);
    setDrumrollCount(0);
    setError(null);

    // 드럼롤 효과를 위한 임시 선택
    const drumrollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setSelectedItem(items[randomIndex]);
      setDrumrollCount(prev => prev + 1);
    }, Math.max(50, 200 - drumrollCount * 2)); // 점점 빨라지는 효과

    try {
      // 실제 API 호출
      const finalItem = await selectRandomItem(categorySlug);

      // 드럼롤 효과 종료
      setTimeout(() => {
        clearInterval(drumrollInterval);
        setSelectedItem(finalItem);
        setIsSpinning(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        loadItems();
      }, 2000);
    } catch (err) {
      clearInterval(drumrollInterval);
      setIsSpinning(false);
      setError('랜덤 아이템 선택에 실패했습니다.');
      console.error(err);
    }
  };

  // 선택 결과 공유
  const shareResult = () => {
    if (!selectedItem) return;

    // 공유할 텍스트 생성
    const shareText = `랜덤 선택기에서 선택된 아이템: ${selectedItem.name}`;

    // 클립보드에 복사
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert('클립보드에 복사되었습니다!');
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
      });

    // 공유 기능이 지원되는 브라우저에서는 네이티브 공유 다이얼로그 사용
    if (navigator.share) {
      navigator
        .share({
          title: '랜덤 선택 결과',
          text: shareText,
        })
        .catch(err => {
          console.error('공유 실패:', err);
        });
    }
  };

  return {
    items,
    selectedItem,
    isSpinning,
    cycleCompleted,
    isLoading,
    error,
    newItemName,
    setNewItemName,
    newItemImage,
    imagePreview,
    isUploading,
    bulkItemsText,
    setBulkItemsText,
    isBulkMode,
    setIsBulkMode,
    isUndoVisible,
    handleImageChange,
    handleAddItem,
    handleAddBulkItems,
    deleteItem,
    undoDelete,
    selectRandom,
    shareResult,
  };
};
