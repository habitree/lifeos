# 작업 4: 로컬 저장소 서비스

## 작업 개요
IndexedDB와 LocalStorage를 활용한 로컬 저장소 서비스를 구현합니다. Local-first 원칙에 따라 모든 데이터는 로컬에 먼저 저장됩니다.

## 목표
- IndexedDB 서비스 구현
- LocalStorage 서비스 구현
- 타입 안전한 저장소 인터페이스
- 오프라인 지원

## 의존성
- 작업 2: 타입 정의 (완료 필요)

## 작업 내용

### 1. IndexedDB 서비스 (`services/LocalStorageService.ts`)
- 데이터베이스 초기화
- CRUD 작업
- 트랜잭션 관리
- 에러 처리

### 2. LocalStorage 서비스 (선택)
- 설정 저장
- 간단한 데이터 저장

### 3. 저장소 키 관리
- 타입 안전한 키 정의
- 키 네임스페이스 관리

## 결과물
- `services/LocalStorageService.ts`
- `services/StorageKeys.ts` (키 정의)
- IndexedDB 스키마 정의

## 프롬프트

```
다음 요구사항에 따라 로컬 저장소 서비스를 구현해주세요:

1. IndexedDB 서비스 (services/LocalStorageService.ts):
   - idb 라이브러리 사용
   - 데이터베이스 이름: 'life-os-db'
   - 버전: 1
   - Object Stores:
     * users: keyPath 'id'
     * baselines: keyPath 'id', index 'user_id'
     * daily_logs: keyPath 'id', index 'user_id', index 'log_date'

2. 메서드 구현:
   - get<T>(store: string, key: string): Promise<T | undefined>
   - set<T>(store: string, key: string, value: T): Promise<void>
   - delete(store: string, key: string): Promise<void>
   - getAll<T>(store: string): Promise<T[]>
   - getByIndex<T>(store: string, index: string, value: any): Promise<T[]>

3. 타입 안전성:
   - 제네릭 타입 사용
   - 저장소 이름 타입 정의
   - 키 타입 정의

4. 에러 처리:
   - IndexedDB 사용 불가 시 LocalStorage 폴백
   - 명확한 에러 메시지

5. 저장소 키 관리 (services/StorageKeys.ts):
   - 타입 안전한 키 정의
   - 네임스페이스 관리

참고 문서:
- software_design.md (섹션 1.4, 6.2)
- lifeos_PRD.md (섹션 6.2)
- user_stories.md (US-018, US-020)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 1.4 (로컬 저장소), 섹션 6.2 (데이터 최적화)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 6.2 (Local-first 원칙)
- [user_stories.md](../../user_stories.md) - US-018 (로컬 저장소 우선 저장), US-020 (오프라인 모드 지원)

## 체크리스트
- [x] IndexedDB 서비스 구현 완료
- [x] 모든 CRUD 메서드 구현 완료
- [x] 타입 안전성 확보
- [x] 에러 처리 구현 완료
- [x] 저장소 키 관리 구현 완료
- [x] 기본 동작 테스트 완료

