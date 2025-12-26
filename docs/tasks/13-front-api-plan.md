# 작업 13: API Routes

## 작업 개요
Next.js API Routes를 구현합니다. Supabase와 연동하여 데이터를 처리합니다.

## 목표
- /api/user 라우트
- /api/baseline 라우트
- /api/daily-log 라우트
- /api/sync 라우트
- 에러 처리

## 의존성
- 작업 3: Supabase 클라이언트 설정 (완료 필요)
- 작업 2: 타입 정의 (완료 필요)

## 작업 내용

### 1. User API (`app/api/user/route.ts`)
- GET: 사용자 정보 조회
- POST: 사용자 생성

### 2. Baseline API (`app/api/baseline/route.ts`)
- GET: Baseline 조회
- PUT: Baseline 업데이트

### 3. Daily Log API (`app/api/daily-log/route.ts`)
- GET: Daily Log 조회 (날짜별)
- POST: Daily Log 생성
- PUT: Daily Log 업데이트

### 4. Sync API (`app/api/sync/route.ts`)
- POST: 동기화 요청
- GET: 동기화 상태 확인

## 결과물
- `app/api/user/route.ts`
- `app/api/baseline/route.ts`
- `app/api/daily-log/route.ts`
- `app/api/sync/route.ts`
- 에러 처리 유틸리티

## 프롬프트

```
다음 요구사항에 따라 API Routes를 구현해주세요:

1. User API (app/api/user/route.ts):
   - GET: 사용자 정보 조회
     * userId를 쿼리 파라미터로 받음
     * Supabase에서 조회
     * 없으면 생성 후 반환
   - POST: 사용자 생성
     * 기본 Phase는 1
     * UUID 생성
     * Supabase에 저장

2. Baseline API (app/api/baseline/route.ts):
   - GET: Baseline 조회
     * userId를 쿼리 파라미터로 받음
     * Supabase에서 조회
   - PUT: Baseline 업데이트
     * userId와 baseline 데이터를 body로 받음
     * Supabase에 업데이트
     * upsert 사용

3. Daily Log API (app/api/daily-log/route.ts):
   - GET: Daily Log 조회
     * userId와 date를 쿼리 파라미터로 받음
     * Supabase에서 조회
   - POST: Daily Log 생성
     * userId와 log 데이터를 body로 받음
     * Supabase에 저장
   - PUT: Daily Log 업데이트
     * userId, date, log 데이터를 body로 받음
     * Supabase에 업데이트
     * upsert 사용

4. Sync API (app/api/sync/route.ts):
   - POST: 동기화 요청
     * userId와 localData를 body로 받음
     * Supabase에 동기화
     * 충돌 해결 (로컬 우선)
   - GET: 동기화 상태 확인
     * 동기화 상태 반환

5. 에러 처리:
   - 명확한 에러 메시지
   - HTTP 상태 코드 적절히 사용
   - 타입 안전성

6. 보안:
   - 입력 검증
   - SQL Injection 방지 (Supabase가 자동 처리)
   - Rate Limiting (선택)

참고 문서:
- software_design.md (섹션 5.1)
- lifeos_PRD.md (섹션 6.1.2)
- Next.js API Routes 문서
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 5.1 (API 라우트 구조)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 6.1.2 (Supabase)
- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 체크리스트
- [ ] User API 구현 완료
- [ ] Baseline API 구현 완료
- [ ] Daily Log API 구현 완료
- [ ] Sync API 구현 완료
- [ ] 에러 처리 구현 완료
- [ ] 입력 검증 완료
- [ ] API 테스트 완료

