# LocalStorageService 테스트 가이드

LocalStorageService를 테스트하는 방법을 안내합니다.

## 방법 1: 테스트 페이지 사용 (권장)

### 1. 개발 서버 실행

```bash
npm run dev
```

### 2. 테스트 페이지 접속

브라우저에서 다음 URL로 접속:

```
http://localhost:3001/test-storage
```

### 3. 테스트 실행

1. 페이지에서 **"테스트 실행"** 버튼 클릭
2. 테스트 결과가 로그 영역에 표시됩니다
3. 각 테스트 단계의 성공/실패 여부를 확인할 수 있습니다

### 4. 결과 확인

- **페이지 로그**: 테스트 결과가 실시간으로 표시됩니다
- **브라우저 콘솔**: 개발자 도구(F12) > Console 탭에서 상세 로그 확인
- **IndexedDB 데이터**: 개발자 도구 > Application 탭 > IndexedDB > life-os-db에서 확인

## 방법 2: 브라우저 콘솔에서 직접 실행

### 1. 개발 서버 실행

```bash
npm run dev
```

### 2. 브라우저에서 페이지 열기

어떤 페이지든 열어서 개발자 도구(F12)를 엽니다.

### 3. 콘솔에서 테스트 함수 실행

브라우저 콘솔에 다음 코드를 붙여넣고 실행:

```javascript
// 테스트 함수 import (동적 import 사용)
(async () => {
  const { testLocalStorageService } = await import('/services/__tests__/LocalStorageService.test.ts');
  await testLocalStorageService();
})();
```

또는 직접 테스트 코드 작성:

```javascript
import { localStorageService } from '@/services/LocalStorageService';
import { IDB_STORE_NAMES } from '@/types/services';

// 간단한 테스트
const testUser = {
  id: 'test-user-1',
  created_at: new Date().toISOString(),
  current_phase: 1,
};

// 저장
await localStorageService.set(IDB_STORE_NAMES.USER, testUser.id, testUser);
console.log('✅ 저장 완료');

// 조회
const user = await localStorageService.get(IDB_STORE_NAMES.USER, testUser.id);
console.log('✅ 조회 완료:', user);
```

## 방법 3: Next.js API Route로 테스트

### API Route 생성 (선택사항)

`app/api/test-storage/route.ts` 파일을 생성하여 서버 사이드에서도 테스트할 수 있습니다.

## 테스트 항목

테스트는 다음 항목들을 검증합니다:

1. ✅ **User 저장 및 조회**: 사용자 데이터 저장 및 조회
2. ✅ **Baseline 저장 및 조회**: Baseline 데이터 저장 및 조회
3. ✅ **DailyLog 저장 및 조회**: 일일 로그 데이터 저장 및 조회
4. ✅ **getAll**: 모든 데이터 조회
5. ✅ **getByIndex**: 인덱스를 사용한 검색
6. ✅ **delete**: 데이터 삭제

## 문제 해결

### IndexedDB가 작동하지 않는 경우

- LocalStorage 폴백이 자동으로 작동합니다
- 브라우저 콘솔에서 에러 메시지를 확인하세요
- 브라우저가 IndexedDB를 지원하는지 확인하세요

### 테스트 데이터 초기화

테스트 페이지의 **"저장소 초기화"** 버튼을 클릭하면 모든 테스트 데이터가 삭제됩니다.

### 브라우저 개발자 도구에서 확인

1. **F12** 키를 눌러 개발자 도구 열기
2. **Application** 탭 선택
3. 왼쪽 메뉴에서 **IndexedDB** > **life-os-db** 선택
4. Object Stores에서 데이터 확인:
   - `user`
   - `baseline`
   - `daily_logs`

## 주의사항

- ⚠️ 테스트는 실제 데이터를 생성합니다
- ⚠️ 프로덕션 환경에서는 테스트 페이지를 제거하거나 보호해야 합니다
- ⚠️ 테스트 데이터는 수동으로 삭제하거나 "저장소 초기화" 버튼으로 삭제할 수 있습니다

## 다음 단계

테스트가 성공적으로 완료되면:

1. ✅ 로컬 저장소 서비스가 정상 작동하는 것을 확인
2. ✅ 다음 작업(동기화 서비스 등)으로 진행 가능
3. ✅ 실제 애플리케이션에서 사용 준비 완료

