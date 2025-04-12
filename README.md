# Random Presenter

발표자 랜덤 선택 애플리케이션입니다. 팀원들의 발표 순서를 공정하게 선정하고 관리할 수 있습니다.

[Live Demo](your-vercel-url) // 배포 후 URL 추가 예정

## 사용 방법

### 1. 사용자 등록

- 이름 입력 후 이미지 선택 (선택사항)
- 이미지를 선택하지 않을 경우 기본 아바타 이미지가 적용됩니다
- 등록된 사용자는 발표 대기 상태로 표시됩니다

### 2. 발표자 선택

- '랜덤 선택' 버튼을 클릭하면 드럼롤 효과와 함께 발표자가 선정됩니다
- 이미 발표한 사용자는 다음 선택에서 제외됩니다
- 모든 사용자가 발표를 완료하면 자동으로 상태가 초기화됩니다

### 3. 사용자 관리

- 각 사용자 카드의 삭제 버튼으로 명단에서 제거할 수 있습니다
- 발표 상태는 사용자 카드에 표시됩니다 (발표 완료/발표 대기)

## 주요 기능

### 1. 사용자 관리

- 사용자 추가/삭제
- 프로필 이미지 업로드 기능
- 기본 아바타 이미지 제공

### 2. 랜덤 발표자 선택

- 공정한 랜덤 선택 알고리즘
- 발표자 선택 시 애니메이션 효과
- 이전 발표자 제외 로직

### 3. 발표 이력 관리

- 발표 완료/대기 상태 표시
- 모든 팀원이 발표 완료 시 자동 초기화
- 발표 순서 이력 관리

## 기술 스택

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend

- Next.js API Routes
- Prisma (ORM)
- PostgreSQL (Supabase)

### Storage

- Supabase Storage (이미지 저장)

### 배포

- Vercel (예정)

### 데이터베이스 설정

1. Supabase 프로젝트에서 다음 설정 확인:

   - Database: PostgreSQL 연결 활성화
   - Storage: 'avatars' 버킷이 public으로 설정
   - API: CORS 설정이 배포 도메인 허용

2. 프로덕션 환경 마이그레이션:

```bash
npx prisma db push
```

### 배포 후 확인사항

- [ ] 환경 변수가 올바르게 설정되었는지 확인
- [ ] 이미지 업로드가 정상적으로 작동하는지 테스트
- [ ] 데이터베이스 연결 확인
- [ ] CORS 설정 확인

## 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/dltkr12311/random-presenter.git
cd random-presenter
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 변수들을 설정:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
```

5. 개발 서버 실행

```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── app/
│   ├── api/          # API 라우트
│   │   ├── random/   # 랜덤 선택 API
│   │   ├── upload/   # 이미지 업로드 API
│   │   └── users/    # 사용자 관리 API
│   ├── page.tsx      # 메인 페이지
│   └── layout.tsx    # 레이아웃
├── components/       # UI 컴포넌트
├── lib/             # 유틸리티 함수
└── types/           # TypeScript 타입 정의
```

## 개발 노트

### API 엔드포인트

1. `POST /api/users`

   - 새로운 사용자 추가
   - 이름과 이미지 URL을 받아 처리

2. `POST /api/random`

   - 랜덤 발표자 선택
   - 이전 발표자를 제외하고 선택
   - 모든 사용자가 발표했을 경우 상태 초기화

3. `POST /api/upload`
   - 이미지 파일 업로드
   - Supabase Storage에 저장
   - 공개 접근 가능한 URL 반환

### 데이터베이스 스키마

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  imageUrl      String?
  selected      Boolean   @default(false)
  lastSelectedAt DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## 라이선스

MIT License
