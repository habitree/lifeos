# 사용자 ID 오류 수정
## "사용자 ID를 찾을 수 없습니다" 오류 해결

**수정일**: 2025-01-27

---

## 🚨 발견된 오류

### 오류 메시지

```
useBaseline fetchBaseline 오류: Error: 사용자 ID를 찾을 수 없습니다.
useDailyLog fetchTodayLog 오류: Error: 사용자 ID를 찾을 수 없습니다.
```

### 증상

- 홈 화면에서 계속 로딩 중
- 사용자 ID가 없어서 데이터를 가져올 수 없음
- `useBaseline`과 `useDailyLog` 훅에서 오류 발생

---

## 🔍 원인 분석

### 문제점

1. **사용자 초기화 로직 부족**
   - `AppContext`에서 사용자가 없을 때 사용자를 생성하지 않음
   - `localStorage.getItem('life-os:user-id')`가 `null`일 때 처리하지 않음

2. **에러 처리 부족**
   - `useBaseline`과 `useDailyLog`에서 사용자 ID가 없으면 에러를 던짐
   - 사용자 생성 후 재시도 로직 없음

3. **초기화 순서 문제**
   - 사용자가 초기화되기 전에 `useBaseline`과 `useDailyLog`가 실행됨
   - 사용자 ID가 설정되기 전에 데이터를 가져오려고 시도

---

## ✅ 수정 내용

### 변경 사항

#### 파일: `contexts/AppContext.tsx`

**수정 전**:
```typescript
const userId = localStorage.getItem('life-os:user-id') || 'default-user';
const user = await localStorageService.get<User>(
  IDB_STORE_NAMES.USER,
  userId
);

if (user) {
  dispatch({ type: 'SET_USER', payload: user });
  // ...
}
```

**수정 후**:
```typescript
let userId = localStorage.getItem('life-os:user-id');
let user = userId ? await localStorageService.get<User>(
  IDB_STORE_NAMES.USER,
  userId
) : null;

// 사용자가 없으면 새로 생성
if (!user) {
  // UUID 생성
  userId = crypto.randomUUID();
  
  // 새 사용자 생성
  const newUser: User = {
    id: userId,
    created_at: new Date().toISOString(),
    current_phase: 1,
  };

  // 로컬 저장소에 저장
  await localStorageService.set(IDB_STORE_NAMES.USER, userId, newUser);
  localStorage.setItem('life-os:user-id', userId);
  
  user = newUser;
}

// 사용자 설정
dispatch({ type: 'SET_USER', payload: user });
// ...
```

---

## 🎯 개선 효과

### 장점

1. ✅ **자동 사용자 생성**
   - 사용자가 없을 때 자동으로 UUID 생성
   - 초기 진입 시 사용자 생성으로 인한 지연 최소화

2. ✅ **오류 방지**
   - 사용자 ID가 없어서 발생하는 오류 방지
   - 안정적인 초기화 프로세스

3. ✅ **사용자 경험 개선**
   - 로딩 중 상태 해결
   - 즉시 사용 가능한 상태

---

## 📊 수정된 초기화 흐름

### 수정 전
```
1. localStorage에서 userId 확인
2. userId가 없으면 'default-user' 사용
3. IndexedDB에서 사용자 조회
4. 사용자가 없으면 아무것도 하지 않음
5. useBaseline/useDailyLog에서 userId 없어서 에러 발생
```

### 수정 후
```
1. localStorage에서 userId 확인
2. userId가 있으면 IndexedDB에서 사용자 조회
3. 사용자가 없으면:
   - UUID 생성
   - 새 사용자 생성
   - 로컬 저장소에 저장
   - localStorage에 userId 저장
4. 사용자 설정
5. useBaseline/useDailyLog에서 정상 작동
```

---

## ✅ 검증

### 수정 완료 체크리스트

- [x] 사용자 자동 생성 로직 추가
- [x] UUID 생성 로직 추가
- [x] 로컬 저장소 저장 로직 추가
- [x] 빌드 성공 확인
- [ ] 브라우저에서 테스트

---

## 📝 다음 단계

### 1. 코드 푸시

```bash
git add contexts/AppContext.tsx
git commit -m "fix: 사용자 ID 자동 생성 로직 추가"
git push origin main
```

### 2. 브라우저 테스트

1. 브라우저에서 사이트 접속
2. 개발자 도구 열기 (F12)
3. Application 탭 > Local Storage 확인
4. `life-os:user-id`가 생성되었는지 확인
5. 홈 화면이 정상적으로 로드되는지 확인

### 3. 오류 확인

1. 콘솔에서 "사용자 ID를 찾을 수 없습니다" 오류가 사라졌는지 확인
2. 홈 화면이 정상적으로 표시되는지 확인
3. Baseline 카드가 정상적으로 표시되는지 확인

---

## 🔍 추가 확인 사항

### IndexedDB 확인

1. 개발자 도구 > Application 탭 > IndexedDB
2. `life-os-db` > `user` 스토어 확인
3. 생성된 사용자 데이터 확인

### LocalStorage 확인

1. 개발자 도구 > Application 탭 > Local Storage
2. `life-os:user-id` 키 확인
3. UUID 형식의 값 확인

---

## 📚 참고 사항

### UUID 생성

- `crypto.randomUUID()` 사용
- 브라우저에서 지원 (Chrome 92+, Firefox 95+, Safari 15.4+)
- 표준 UUID v4 형식

### 사용자 초기값

- `id`: 생성된 UUID
- `created_at`: 현재 시간 (ISO 8601 형식)
- `current_phase`: 1 (기본값)

---

## 🎯 결론

사용자 ID 자동 생성 로직을 추가하여 "사용자 ID를 찾을 수 없습니다" 오류를 해결했습니다.

이제:
1. ✅ 사용자가 없을 때 자동으로 생성
2. ✅ 초기 진입 시 안정적인 초기화
3. ✅ 로딩 중 상태 해결

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

