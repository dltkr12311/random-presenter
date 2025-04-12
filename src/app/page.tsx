'use client';

import type { User } from '@/types';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserImage, setNewUserImage] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [drumrollCount, setDrumrollCount] = useState(0);
  const [cycleCompleted, setCycleCompleted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 사용자 목록 불러오기
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      if (data.length > 0 && data.every((user: User) => user.selected)) {
        setCycleCompleted(true);
      } else {
        setCycleCompleted(false);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  // 초기 로딩
  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  // 이미지 업로드 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  // 새 사용자 추가
  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    try {
      setIsUploading(true);
      let imageUrl = '/default-avatar.png';

      if (newUserImage) {
        try {
          imageUrl = await uploadImage(newUserImage);
        } catch (error) {
          console.error('Failed to upload image:', error);
          // 이미지 업로드 실패 시 기본 이미지 사용
        }
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add user');
      }

      setNewUserName('');
      setNewUserImage(null);
      setImagePreview(null);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to add user:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // 랜덤 선택
  const selectRandom = async () => {
    if (!users.length) return;

    setIsSpinning(true);
    setDrumrollCount(0);

    // 드럼롤 효과를 위한 임시 선택
    const drumrollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * users.length);
      setSelectedUser(users[randomIndex]);
      setDrumrollCount(prev => prev + 1);
    }, Math.max(50, 200 - drumrollCount * 2)); // 점점 빨라지는 효과

    try {
      // 실제 API 호출
      const response = await fetch('/api/random', { method: 'POST' });
      const finalUser = await response.json();

      // 드럼롤 효과 종료
      setTimeout(() => {
        clearInterval(drumrollInterval);
        setSelectedUser(finalUser);
        setIsSpinning(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        fetchUsers();
      }, 2000);
    } catch (error) {
      console.error('Failed to select random user:', error);
      clearInterval(drumrollInterval);
      setIsSpinning(false);
    }
  };

  // 사용자 삭제
  const deleteUser = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // 서버 사이드 렌더링 중에는 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

  const selectedCount = users.filter(user => user.selected).length;
  const totalUsers = users.length;

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4'>
      <div className='container mx-auto px-4 py-12 max-w-5xl'>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='text-5xl font-bold text-white mb-12 text-center'
        >
          랜덤 발표자 선정
        </motion.h1>

        {/* 진행 상황 표시 */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='mb-12 bg-white/10 p-6 rounded-xl backdrop-blur-sm'
        >
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-white mb-4'>
            <span className='text-lg'>전체 참가자: {totalUsers}명</span>
            <span className='text-lg'>발표 완료: {selectedCount}명</span>
            <span className='text-lg'>
              남은 인원: {totalUsers - selectedCount}명
            </span>
          </div>
          <div className='relative h-3 bg-white/20 rounded-full overflow-hidden'>
            <div
              className='absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500'
              style={{ width: `${(selectedCount / totalUsers) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* 사이클 완료 메시지 */}
        <AnimatePresence>
          {cycleCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='mb-8 p-6 bg-yellow-400/90 rounded-xl text-center backdrop-blur-sm'
            >
              <h2 className='text-2xl font-bold text-yellow-900 mb-2'>
                🎉 발표 사이클 완료! 🎉
              </h2>
              <p className='text-yellow-800'>
                모든 참가자가 발표를 완료했습니다. 다음 발표자 선택 시 새로운
                사이클이 시작됩니다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 사용자 추가 폼 */}
        <motion.form
          onSubmit={addUser}
          className='mb-12'
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 flex gap-4'>
              <div className='relative w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center group'>
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt='Preview'
                    fill
                    className='object-cover'
                  />
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-white/50'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <span className='text-white text-sm'>변경</span>
                </div>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='absolute inset-0 opacity-0 cursor-pointer'
                />
              </div>
              <input
                type='text'
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                placeholder='이름을 입력하세요'
                className='flex-1 p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-white/50 text-lg'
              />
            </div>
            <button
              type='submit'
              disabled={isUploading}
              className={`px-8 py-4 bg-white/20 text-white rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20 text-lg font-semibold
                ${
                  isUploading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-white/30'
                }`}
            >
              {isUploading ? '업로드 중...' : '추가'}
            </button>
          </div>
        </motion.form>

        {/* 랜덤 선택 섹션 */}
        <div className='mb-12 text-center'>
          <motion.button
            onClick={selectRandom}
            disabled={isSpinning || !users.length}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-12 py-6 text-2xl font-bold rounded-2xl transition-all transform shadow-lg
              ${
                isSpinning
                  ? 'bg-gray-500/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 animate-pulse'
              } text-white`}
          >
            {isSpinning ? '선택 중...' : '랜덤 선택!'}
          </motion.button>

          {/* 선택된 사용자 표시 */}
          <AnimatePresence mode='wait'>
            {selectedUser && (
              <motion.div
                key={selectedUser.id + drumrollCount}
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: isSpinning ? [1, 1.02, 1] : 1,
                  rotate: isSpinning ? [-1, 1, -1] : 0,
                }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  scale: { repeat: Infinity, duration: 0.5 },
                  rotate: { repeat: Infinity, duration: 0.2 },
                }}
                className='mt-12 p-8 bg-white rounded-2xl shadow-2xl transform transition-all backdrop-blur-sm mx-auto max-w-2xl'
              >
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                  🎉 발표자 🎉
                </h2>
                <p className='text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  {selectedUser.name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 사용자 목록 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <AnimatePresence>
            {users.map(user => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-6 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300
                  ${
                    user.selected
                      ? 'bg-white/10 text-white/70'
                      : 'bg-white/20 text-white'
                  }`}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='relative w-12 h-12 rounded-full overflow-hidden bg-white/10'>
                    <Image
                      src={user.imageUrl || '/default-avatar.png'}
                      alt={`${user.name}'s avatar`}
                      fill
                      className='object-cover'
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='text-xl font-semibold'>{user.name}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        user.selected
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {user.selected ? '발표 완료' : '대기 중'}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className='p-2 rounded-full hover:bg-red-500/20 text-red-300 transition-colors'
                    title='삭제'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
                {user.lastSelectedAt && (
                  <p className='text-sm text-white/50'>
                    마지막 발표:{' '}
                    {new Date(user.lastSelectedAt).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
