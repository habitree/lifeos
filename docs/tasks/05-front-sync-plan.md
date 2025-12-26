# 작업 5: 동기화 서비스

## 작업 개요
로컬 저장소와 Supabase 간의 데이터 동기화 서비스를 구현합니다. 백그라운드에서 자동으로 동기화되며, 오프라인 지원을 포함합니다.

## 목표
- 로컬 → Supabase 동기화
- Supabase → 로컬 동기화
- 백그라운드 동기화
- 충돌 해결 (로컬 우선)
- 재시도 로직

## 의존성
- 작업 3: Supabase 클라이언트 설정 (완료 필요)
- 작업 4: 로컬 저장소 서비스 (완료 필요)

## 작업 내용

### 1. 동기화 서비스 (`services/SyncService.ts`)
- syncToSupabase 메서드
- syncFromSupabase 메서드
- backgroundSync 메서드
- 충돌 해결 로직

### 2. 동기화 큐 관리
- 오프라인 작업 큐
- 재시도 로직
- 네트워크 상태 감지

### 3. 동기화 상태 관리
- 동기화 상태 추적
- 에러 로깅

## 결과물
- `services/SyncService.ts`
- `services/SyncQueue.ts` (큐 관리)
- 동기화 상태 타입

## 프롬프트

```
다음 요구사항에 따라 동기화 서비스를 구현해주세요:

1. 동기화 서비스 (services/SyncService.ts):
   - syncToSupabase(localData: LocalData): Promise<void>
     * 로컬 데이터 읽기
     * Supabase에 업로드
     * 충돌 해결 (로컬 우선)
     * 동기화 상태 업데이트
   
   - syncFromSupabase(): Promise<LocalData>
     * Supabase에서 데이터 조회
     * 로컬 데이터와 병합
     * 로컬 저장소에 저장
   
   - backgroundSync(): Promise<void>
     * 네트워크 상태 확인
     * 대기 중인 동기화 작업 실행
     * 재시도 로직 (최대 3회)

2. 동기화 큐 관리 (services/SyncQueue.ts):
   - 오프라인 작업 저장
   - 네트워크 연결 시 자동 실행
   - 큐 상태 관리

3. 충돌 해결:
   - 로컬 데이터 우선 원칙
   - 타임스탬프 기반 최신 데이터 선택
   - 사용자 알림 없이 자동 처리

4. 에러 처리:
   - 네트워크 에러 처리
   - 재시도 로직
   - 에러 로깅 (조용히)

5. 동기화 상태:
   - 'idle' | 'syncing' | 'success' | 'error'
   - 상태 변경 이벤트 (선택)

참고 문서:
- software_design.md (섹션 5.2)
- lifeos_PRD.md (섹션 6.2)
- user_stories.md (US-019, US-020)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 5.2 (동기화 서비스)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 6.2 (Local-first 원칙)
- [user_stories.md](../../user_stories.md) - US-019 (Supabase 백그라운드 동기화), US-020 (오프라인 모드 지원)

## 체크리스트
- [ ] syncToSupabase 메서드 구현 완료
- [ ] syncFromSupabase 메서드 구현 완료
- [ ] backgroundSync 메서드 구현 완료
- [ ] 동기화 큐 관리 구현 완료
- [ ] 충돌 해결 로직 구현 완료
- [ ] 재시도 로직 구현 완료
- [ ] 에러 처리 구현 완료
- [ ] 기본 동작 테스트 완료

