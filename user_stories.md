# LIFE OS - User Stories
## 사용자 스토리 형식 요구사항 명세서

**버전**: v0.1  
**작성일**: 2025-01-27  
**기준 문서**: [lifeos_PRD.md](./lifeos_PRD.md)

---

## 사용자 스토리 형식 설명

각 사용자 스토리는 다음 형식을 따릅니다:

**As a** [사용자 유형]  
**I want to** [원하는 기능]  
**So that** [이유/목적]

**Acceptance Criteria:**
- Given [전제 조건]
- When [행동]
- Then [기대 결과]

---

## 1. 초기 설정 및 앱 시작

### US-001: 앱 최초 실행 시 사용자 초기화
**As a** 새로운 사용자  
**I want to** 앱을 처음 실행했을 때 자동으로 초기 설정이 되도록  
**So that** 로그인 없이도 바로 사용할 수 있다

**Acceptance Criteria:**
- Given 앱을 처음 실행했을 때
- When 앱이 로드되면
- Then 사용자 ID가 자동 생성되고 로컬 저장소에 저장된다
- Then 기본 Phase는 1(Baseline)로 설정된다
- Then 기본 Baseline 값이 설정된다 (수면: 22:00-05:00, 이동: 1km, 기록: 3줄)
- Then Home 화면이 표시된다

**우선순위**: 높음  
**스토리 포인트**: 3

---

### US-002: 오늘 날짜 확인
**As a** 사용자  
**I want to** Home 화면에서 오늘 날짜를 확인할 수 있도록  
**So that** 오늘의 기준을 확인할 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When 화면이 로드되면
- Then 오늘 날짜가 명확하게 표시된다 (예: 2025년 1월 27일 월요일)
- Then 날짜 형식은 사용자가 이해하기 쉽게 표시된다

**우선순위**: 높음  
**스토리 포인트**: 1

---

## 2. Home 화면 기능

### US-003: Baseline 3개 항목 확인
**As a** 사용자  
**I want to** Home 화면에서 오늘의 Baseline 3개 항목을 확인할 수 있도록  
**So that** 오늘 달성해야 할 기준을 명확히 알 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When 화면이 로드되면
- Then 수면 Baseline이 표시된다 (예: "22:00-05:00")
- Then 이동 Baseline이 표시된다 (예: "걷기/러닝 1km 이상")
- Then 기록 Baseline이 표시된다 (예: "3줄")
- Then 각 항목은 ON/OFF 상태를 표시할 수 있는 토글이 있다

**우선순위**: 높음  
**스토리 포인트**: 2

---

### US-004: Baseline 항목 ON/OFF 토글
**As a** 사용자  
**I want to** Baseline 항목을 클릭하여 ON/OFF 상태를 변경할 수 있도록  
**So that** 오늘의 기준 달성 여부를 기록할 수 있다

**Acceptance Criteria:**
- Given Home 화면에서 Baseline 항목이 표시되어 있을 때
- When Baseline 항목을 클릭하면
- Then 해당 항목의 상태가 ON/OFF로 토글된다
- Then 변경된 상태가 즉시 로컬 저장소에 저장된다
- Then 변경된 상태가 백그라운드에서 Supabase에 동기화된다
- Then 점수나 연속일 카운터는 표시되지 않는다

**우선순위**: 높음  
**스토리 포인트**: 2

---

### US-005: Reset Today 기능
**As a** 사용자  
**I want to** Reset Today 버튼을 눌러 오늘을 초기화할 수 있도록  
**So that** 무너진 날에도 압박감 없이 Baseline으로 돌아올 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When Reset Today 버튼을 클릭하면
- Then "오늘은 돌아오기만 하면 된다" 메시지가 표시된다
- Then Baseline 3개 항목만 남고 나머지 모든 확장 기능은 숨겨진다
- Then 모든 Baseline 항목이 OFF 상태로 초기화된다
- Then 오늘의 기록은 그대로 유지된다
- Then 점수나 연속일은 표시되지 않는다

**우선순위**: 높음  
**스토리 포인트**: 3

---

### US-006: 현재 Phase 확인
**As a** 사용자  
**I want to** Home 화면에서 현재 Phase를 확인할 수 있도록  
**So that** 내 현재 상태를 인지할 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When 화면이 로드되면
- Then 현재 Phase가 표시된다 (Phase 1-4)
- Then Phase는 숫자와 함께 표시된다 (예: "Phase 1: Baseline")
- Then Phase는 자동으로 변경되지 않는다

**우선순위**: 중간  
**스토리 포인트**: 1

---

## 3. Daily Log 화면 기능

### US-007: Daily Log 화면 접근
**As a** 사용자  
**I want to** Daily Log 화면으로 이동할 수 있도록  
**So that** 하루의 기록을 남길 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When Daily Log 메뉴/버튼을 클릭하면
- Then Daily Log 화면으로 이동한다
- Then 오늘 날짜가 표시된다

**우선순위**: 높음  
**스토리 포인트**: 1

---

### US-008: 오늘의 기준 한 줄 입력
**As a** 사용자  
**I want to** 오늘의 기준을 한 줄로 입력할 수 있도록  
**So that** 오늘의 목표나 기준을 기록할 수 있다

**Acceptance Criteria:**
- Given Daily Log 화면에 있을 때
- When 오늘의 기준 한 줄 입력 필드에 텍스트를 입력하면
- Then 텍스트가 실시간으로 표시된다
- Then 입력 필드는 필수 항목으로 표시된다
- Then 빈 값으로도 저장 가능하다 (실패 개념 없음)

**우선순위**: 높음  
**스토리 포인트**: 2

---

### US-009: 몸 상태 선택
**As a** 사용자  
**I want to** 오늘의 몸 상태를 선택할 수 있도록  
**So that** 내 상태를 기록할 수 있다

**Acceptance Criteria:**
- Given Daily Log 화면에 있을 때
- When 몸 상태를 선택하면
- Then "좋음", "보통", "무거움" 중 하나를 선택할 수 있다
- Then 라디오 버튼 형식으로 표시된다
- Then 선택하지 않아도 저장 가능하다

**우선순위**: 중간  
**스토리 포인트**: 1

---

### US-010: 자유 메모 입력
**As a** 사용자  
**I want to** 자유 메모를 입력할 수 있도록  
**So that** 추가적인 생각이나 기록을 남길 수 있다

**Acceptance Criteria:**
- Given Daily Log 화면에 있을 때
- When 자유 메모 텍스트 영역에 입력하면
- Then 여러 줄 입력이 가능하다
- Then 입력하지 않아도 저장 가능하다 (선택 사항)
- Then 텍스트 영역은 적절한 크기로 표시된다

**우선순위**: 중간  
**스토리 포인트**: 1

---

### US-011: Daily Log 저장
**As a** 사용자  
**I want to** Daily Log를 저장할 수 있도록  
**So that** 오늘의 기록이 보존된다

**Acceptance Criteria:**
- Given Daily Log 화면에서 기록을 입력했을 때
- When "저장" 또는 "기록하기" 버튼을 클릭하면
- Then 입력한 내용이 로컬 저장소에 저장된다
- Then 저장된 내용이 백그라운드에서 Supabase에 동기화된다
- Then 저장 성공 메시지가 표시된다 (선택적, 조용하게)
- Then Baseline 체크를 못 해도 저장 가능하다
- Then 빈 기록도 저장 가능하다

**우선순위**: 높음  
**스토리 포인트**: 3

---

### US-012: 이전 Daily Log 조회
**As a** 사용자  
**I want to** 이전 날짜의 Daily Log를 조회할 수 있도록  
**So that** 과거 기록을 확인할 수 있다

**Acceptance Criteria:**
- Given Daily Log 화면에 있을 때
- When 날짜 선택 기능을 사용하면
- Then 이전 날짜의 기록을 조회할 수 있다
- Then 조회한 기록은 수정 가능하다
- Then 기록이 없는 날짜도 조회 가능하다

**우선순위**: 낮음  
**스토리 포인트**: 2

---

## 4. Phase 화면 기능

### US-013: Phase 화면 접근
**As a** 사용자  
**I want to** Phase 화면으로 이동할 수 있도록  
**So that** 현재 Phase를 확인하고 변경할 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When Phase 메뉴/버튼을 클릭하면
- Then Phase 화면으로 이동한다
- Then 현재 Phase가 표시된다

**우선순위**: 중간  
**스토리 포인트**: 1

---

### US-014: 현재 Phase 확인
**As a** 사용자  
**I want to** 현재 Phase와 설명을 확인할 수 있도록  
**So that** 내 현재 상태를 이해할 수 있다

**Acceptance Criteria:**
- Given Phase 화면에 있을 때
- When 화면이 로드되면
- Then 현재 Phase가 표시된다 (Phase 1-4)
- Then 각 Phase의 설명이 표시된다:
  - Phase 1: Baseline - 기본 기준 회복
  - Phase 2: Stability - 안정화 단계
  - Phase 3: Growth - 성장 단계
  - Phase 4: Identity - 정체성 확립

**우선순위**: 중간  
**스토리 포인트**: 1

---

### US-015: Phase 수동 변경
**As a** 사용자  
**I want to** Phase를 수동으로 변경할 수 있도록  
**So that** 내 현재 상태를 선언할 수 있다

**Acceptance Criteria:**
- Given Phase 화면에 있을 때
- When Phase를 변경하면
- Then 드롭다운 또는 버튼을 통해 Phase 1-4 중 선택할 수 있다
- Then 선택한 Phase가 즉시 로컬 저장소에 저장된다
- Then 선택한 Phase가 백그라운드에서 Supabase에 동기화된다
- Then Phase는 자동으로 상승하지 않는다
- Then 무너졌다고 Phase가 자동으로 내려가지 않는다
- Then "나는 지금 이 상태다"를 선언하는 공간이 제공된다

**우선순위**: 중간  
**스토리 포인트**: 2

---

## 5. Baseline 설정 기능

### US-016: Baseline 값 확인
**As a** 사용자  
**I want to** 현재 설정된 Baseline 값을 확인할 수 있도록  
**So that** 내 기준을 명확히 알 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When 화면이 로드되면
- Then 수면 Baseline 값이 표시된다
- Then 이동 Baseline 값이 표시된다
- Then 기록 Baseline 값이 표시된다

**우선순위**: 높음  
**스토리 포인트**: 1

---

### US-017: Baseline 값 변경
**As a** 사용자  
**I want to** Baseline 값을 변경할 수 있도록  
**So that** 내 기준을 조정할 수 있다

**Acceptance Criteria:**
- Given Baseline 설정 화면에 있을 때
- When Baseline 값을 변경하면
- Then 수면 시간 범위를 변경할 수 있다
- Then 이동 거리/시간을 변경할 수 있다
- Then 기록 기준을 변경할 수 있다
- Then 변경된 값이 로컬 저장소에 저장된다
- Then 변경된 값이 백그라운드에서 Supabase에 동기화된다
- Then Baseline 변경 히스토리가 기록된다 (향후 기능)

**우선순위**: 중간  
**스토리 포인트**: 3

---

## 6. 데이터 저장 및 동기화

### US-018: 로컬 저장소 우선 저장
**As a** 사용자  
**I want to** 모든 데이터가 로컬에 먼저 저장되도록  
**So that** 오프라인에서도 사용할 수 있고 서버 장애 시에도 데이터가 안전하다

**Acceptance Criteria:**
- Given 데이터를 저장할 때
- When 저장 작업이 발생하면
- Then 데이터가 먼저 로컬 저장소(IndexedDB/LocalStorage)에 저장된다
- Then 저장이 즉시 완료되어 사용자가 기다리지 않는다
- Then 오프라인 상태에서도 저장이 가능하다
- Then 네트워크가 연결되면 백그라운드에서 Supabase에 동기화된다

**우선순위**: 높음  
**스토리 포인트**: 5

---

### US-019: Supabase 백그라운드 동기화
**As a** 사용자  
**I want to** 로컬 데이터가 Supabase에 자동으로 동기화되도록  
**So that** 데이터 백업이 자동으로 이루어진다

**Acceptance Criteria:**
- Given 로컬 저장소에 데이터가 저장되어 있을 때
- When 네트워크가 연결되어 있으면
- Then 백그라운드에서 자동으로 Supabase에 동기화된다
- Then 동기화는 사용자 작업을 방해하지 않는다
- Then 동기화 실패 시 재시도 로직이 작동한다
- Then 동기화 상태는 조용히 관리된다 (압박감 없는 방식)

**우선순위**: 높음  
**스토리 포인트**: 5

---

### US-020: 오프라인 모드 지원
**As a** 사용자  
**I want to** 인터넷 연결 없이도 앱을 사용할 수 있도록  
**So that** 언제 어디서나 내 기준을 확인하고 기록할 수 있다

**Acceptance Criteria:**
- Given 인터넷 연결이 없을 때
- When 앱을 사용하면
- Then 모든 기능이 정상적으로 작동한다
- Then 데이터는 로컬 저장소에 저장된다
- Then 네트워크가 연결되면 자동으로 동기화된다
- Then 오프라인 상태임을 알리는 메시지는 조용하게 표시된다 (압박감 없이)

**우선순위**: 높음  
**스토리 포인트**: 3

---

## 7. UI/UX 요구사항

### US-021: 최소주의 디자인
**As a** 사용자  
**I want to** 불필요한 요소가 없는 깔끔한 인터페이스를 경험하도록  
**So that** 집중을 방해받지 않고 내 기준에 집중할 수 있다

**Acceptance Criteria:**
- Given 어떤 화면에 있든
- When 화면을 확인하면
- Then 불필요한 장식 요소가 없다
- Then 핵심 기능만 명확하게 표시된다
- Then 여백이 적절하게 사용된다

**우선순위**: 중간  
**스토리 포인트**: 2

---

### US-022: 압박감 없는 인터페이스
**As a** 사용자  
**I want to** 압박감을 주는 요소가 없는 인터페이스를 경험하도록  
**So that** 편안하게 내 기준을 지킬 수 있다

**Acceptance Criteria:**
- Given 어떤 화면에 있든
- When 화면을 확인하면
- Then 점수나 달성률이 표시되지 않는다
- Then 연속일 카운터가 표시되지 않는다
- Then 경고색이나 위협적인 메시지가 없다
- Then 부드러운 색상 톤이 사용된다
- Then 알림이 최소화되어 있다

**우선순위**: 높음  
**스토리 포인트**: 3

---

### US-023: 명확한 ON/OFF 상태 표시
**As a** 사용자  
**I want to** Baseline 항목의 ON/OFF 상태를 명확하게 확인할 수 있도록  
**So that** 오늘의 달성 여부를 쉽게 파악할 수 있다

**Acceptance Criteria:**
- Given Home 화면에 있을 때
- When Baseline 항목을 확인하면
- Then ON/OFF 상태가 시각적으로 명확하게 구분된다
- Then 색상은 부드럽지만 구분이 명확하다
- Then 상태 변경이 즉시 반영된다

**우선순위**: 높음  
**스토리 포인트**: 2

---

## 8. 성능 요구사항

### US-024: 빠른 로딩 속도
**As a** 사용자  
**I want to** 앱이 빠르게 로드되도록  
**So that** 즉시 사용할 수 있다

**Acceptance Criteria:**
- Given 앱을 실행할 때
- When 앱이 로드되면
- Then 초기 로딩 시간이 2초 이내이다
- Then Next.js SSR/SSG를 활용하여 최적화된다
- Then 필요한 데이터만 로드된다

**우선순위**: 중간  
**스토리 포인트**: 3

---

### US-025: 부드러운 인터랙션
**As a** 사용자  
**I want to** 모든 인터랙션이 부드럽게 작동하도록  
**So that** 사용 경험이 방해받지 않는다

**Acceptance Criteria:**
- Given 어떤 화면에서든
- When 사용자 인터랙션을 수행하면
- Then 즉각적인 피드백이 제공된다
- Then 화면 전환이 부드럽다
- Then 로딩 상태가 적절하게 표시된다 (과도하지 않게)

**우선순위**: 중간  
**스토리 포인트**: 2

---

## 9. 금지 사항 (Non-functional Requirements)

### NFR-001: 점수 시스템 금지
**As a** 개발자  
**I want to** 점수나 점수화 시스템을 절대 구현하지 않도록  
**So that** 앱의 철학이 훼손되지 않는다

**Acceptance Criteria:**
- Given 어떤 기능을 개발하든
- When 점수화를 고려하게 되면
- Then 해당 기능은 구현하지 않는다
- Then Baseline 문서를 다시 검토한다

**우선순위**: 높음 (철학 유지)

---

### NFR-002: 연속일 카운터 금지
**As a** 개발자  
**I want to** 연속일 카운터를 절대 구현하지 않도록  
**So that** 앱의 정체성이 붕괴되지 않는다

**Acceptance Criteria:**
- Given 어떤 기능을 개발하든
- When 연속일 카운터를 고려하게 되면
- Then 해당 기능은 구현하지 않는다
- Then Baseline 문서를 다시 검토한다

**우선순위**: 높음 (철학 유지)

---

### NFR-003: 통계 그래프 금지 (MVP)
**As a** 개발자  
**I want to** MVP 범위에서 통계 그래프를 구현하지 않도록  
**So that** 앱이 조용하고 단순하게 유지된다

**Acceptance Criteria:**
- Given MVP 개발 중
- When 통계 그래프 기능을 추가하려고 하면
- Then 해당 기능은 MVP 범위에서 제외한다
- Then 향후 로드맵으로 이동한다

**우선순위**: 높음 (MVP 범위 준수)

---

### NFR-004: 알림 폭탄 금지
**As a** 개발자  
**I want to** 과도한 알림을 구현하지 않도록  
**So that** 앱이 조용하게 유지된다

**Acceptance Criteria:**
- Given 알림 기능을 구현할 때
- When 알림을 추가하려고 하면
- Then 최소한의 알림만 구현한다
- Then 사용자가 알림을 쉽게 끌 수 있다
- Then 압박감을 주는 알림은 절대 사용하지 않는다

**우선순위**: 높음 (철학 유지)

---

## 10. 우선순위 요약

### 높은 우선순위 (MVP 필수)
- US-001: 앱 최초 실행 시 사용자 초기화
- US-002: 오늘 날짜 확인
- US-003: Baseline 3개 항목 확인
- US-004: Baseline 항목 ON/OFF 토글
- US-005: Reset Today 기능
- US-007: Daily Log 화면 접근
- US-008: 오늘의 기준 한 줄 입력
- US-011: Daily Log 저장
- US-018: 로컬 저장소 우선 저장
- US-019: Supabase 백그라운드 동기화
- US-020: 오프라인 모드 지원
- US-022: 압박감 없는 인터페이스
- US-023: 명확한 ON/OFF 상태 표시

### 중간 우선순위
- US-006: 현재 Phase 확인
- US-009: 몸 상태 선택
- US-010: 자유 메모 입력
- US-013: Phase 화면 접근
- US-014: 현재 Phase 확인
- US-015: Phase 수동 변경
- US-016: Baseline 값 확인
- US-021: 최소주의 디자인
- US-024: 빠른 로딩 속도
- US-025: 부드러운 인터랙션

### 낮은 우선순위 (MVP 이후)
- US-012: 이전 Daily Log 조회
- US-017: Baseline 값 변경

---

## 11. 참고 사항

- 모든 사용자 스토리는 **로그인 기능 없이** 구현되어야 합니다
- 익명 사용자도 모든 기능을 사용할 수 있어야 합니다
- 데이터는 로컬 저장소에 우선 저장되고, Supabase는 백업 및 동기화 용도로만 사용됩니다
- 모든 기능은 앱의 핵심 철학을 준수해야 합니다:
  - Baseline이 전부다
  - 확장은 옵션이고, 복귀는 필수다
  - 기록은 평가가 아니라 좌표다
  - 실패라는 개념은 존재하지 않는다
  - 오늘의 성공은 '기준으로 돌아왔는가'다

---

## 12. 승인 및 검토

**작성자**: Product Team  
**검토자**: [미정]  
**승인일**: [미정]

---

> 이 사용자 스토리 문서는 MVP 개발을 위한 기준 문서입니다.  
> 모든 개발 작업은 이 문서의 사용자 스토리를 기반으로 진행되어야 합니다.  
> 로그인 기능은 명시적으로 제외되었습니다.

