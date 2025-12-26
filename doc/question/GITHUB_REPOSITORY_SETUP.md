# GitHub 저장소 연결 가이드

현재 프로젝트를 GitHub 저장소(`https://github.com/habitree/lifeos.git`)에 연결하고 푸시하는 방법을 설명합니다.

## 목차

1. [GitHub 인증 설정](#1-github-인증-설정)
2. [원격 저장소 연결](#2-원격-저장소-연결)
3. [코드 푸시](#3-코드-푸시)
4. [문제 해결](#4-문제-해결)

---

## 1. GitHub 인증 설정

### 1.1 Personal Access Token 생성 (HTTPS 사용 시)

GitHub에 푸시하려면 인증이 필요합니다.

#### 단계:

1. **GitHub 로그인** 후 우측 상단 프로필 클릭
2. **Settings** 클릭
3. 왼쪽 메뉴 하단 **Developer settings** 클릭
4. **Personal access tokens** > **Tokens (classic)** 클릭
5. **Generate new token** > **Generate new token (classic)** 클릭
6. 다음 설정:
   - **Note**: `life-os-project` (원하는 이름)
   - **Expiration**: 원하는 기간 선택
   - **Scopes**: 다음 체크
     - ✅ `repo` (전체 저장소 권한)
     - ✅ `workflow` (GitHub Actions 권한)
7. **Generate token** 클릭
8. **토큰 복사** (한 번만 표시되므로 저장해두세요!)

#### 토큰 사용:

```bash
# 푸시 시 사용자 이름과 토큰 입력
git push origin main
# Username: your-github-username
# Password: [복사한 토큰 붙여넣기]
```

### 1.2 SSH 키 설정 (SSH 사용 시)

SSH 키를 사용하면 매번 토큰을 입력할 필요가 없습니다.

#### SSH 키 생성:

```bash
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub
```

#### GitHub에 SSH 키 추가:

1. GitHub > Settings > **SSH and GPG keys**
2. **New SSH key** 클릭
3. **Title**: `life-os-dev` (원하는 이름)
4. **Key**: 복사한 공개 키 붙여넣기
5. **Add SSH key** 클릭

#### SSH로 원격 저장소 설정:

```bash
# HTTPS 대신 SSH URL 사용
git remote set-url origin git@github.com:habitree/lifeos.git
```

---

## 2. 원격 저장소 연결

### 2.1 현재 원격 저장소 확인

```bash
# 원격 저장소 목록 확인
git remote -v
```

### 2.2 원격 저장소 추가

```bash
# 원격 저장소 추가
git remote add origin https://github.com/habitree/lifeos.git

# 또는 SSH 사용 시
git remote add origin git@github.com:habitree/lifeos.git
```

### 2.3 원격 저장소 변경

이미 다른 원격 저장소가 연결되어 있다면:

```bash
# 기존 원격 저장소 제거
git remote remove origin

# 새로운 원격 저장소 추가
git remote add origin https://github.com/habitree/lifeos.git
```

### 2.4 원격 저장소 확인

```bash
# 원격 저장소 목록 확인
git remote -v
```

**예상 출력:**
```
origin  https://github.com/habitree/lifeos.git (fetch)
origin  https://github.com/habitree/lifeos.git (push)
```

---

## 3. 코드 푸시

### 3.1 브랜치 이름 확인

```bash
# 현재 브랜치 확인
git branch

# 브랜치 이름을 main으로 변경 (필요한 경우)
git branch -M main
```

### 3.2 변경사항 확인

```bash
# 변경된 파일 확인
git status

# 변경사항이 있다면 커밋
git add .
git commit -m "커밋 메시지"
```

### 3.3 첫 푸시

```bash
# GitHub에 푸시 (첫 푸시)
git push -u origin main
```

**`-u` 옵션의 의미:**
- `-u` 또는 `--set-upstream`: 로컬 브랜치와 원격 브랜치를 연결
- 이후에는 `git push`만으로 푸시 가능

### 3.4 이후 푸시

```bash
# 간단하게 푸시
git push
```

---

## 4. 문제 해결

### 4.1 인증 오류

**증상:**
```
fatal: Authentication failed
```

**해결 방법:**

1. **Personal Access Token 확인**
   - 토큰이 만료되지 않았는지 확인
   - `repo` 권한이 있는지 확인

2. **자격 증명 재설정 (Windows)**
   ```bash
   # 자격 증명 관리자에서 GitHub 항목 삭제
   # 제어판 > 자격 증명 관리자 > Windows 자격 증명
   # GitHub 관련 항목 삭제
   ```

3. **Git 자격 증명 재설정**
   ```bash
   git config --global credential.helper manager-core
   ```

### 4.2 권한 오류

**증상:**
```
remote: Permission denied (publickey)
```

**해결 방법:**

1. **SSH 키 확인**
   ```bash
   ssh -T git@github.com
   ```

2. **SSH 에이전트에 키 추가**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

### 4.3 충돌 오류

**증상:**
```
error: failed to push some refs
hint: Updates were rejected because the remote contains work
```

**해결 방법:**

1. **원격 변경사항 가져오기**
   ```bash
   git pull origin main --rebase
   ```

2. **강제 푸시 (주의: 원격 데이터 덮어쓰기)**
   ```bash
   git push -f origin main
   ```
   ⚠️ **주의**: 강제 푸시는 팀 작업 시 위험할 수 있습니다!

### 4.4 브랜치 이름 오류

**증상:**
```
error: src refspec main does not match any
```

**해결 방법:**

1. **브랜치 확인**
   ```bash
   git branch
   ```

2. **브랜치 이름 변경**
   ```bash
   git branch -M main
   ```

3. **다시 푸시**
   ```bash
   git push -u origin main
   ```

---

## 5. 확인 방법

### 5.1 푸시 성공 확인

1. **GitHub 저장소 페이지**로 이동: `https://github.com/habitree/lifeos`
2. **파일 목록** 확인
3. **커밋 히스토리** 확인 (Commits 탭)

### 5.2 원격 저장소 정보 확인

```bash
# 원격 저장소 URL 확인
git remote get-url origin

# 원격 브랜치 확인
git branch -r

# 로컬과 원격 브랜치 비교
git branch -a
```

---

## 6. 자주 사용하는 Git 명령어

```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 모든 변경사항 스테이징
git add .

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push

# 원격 변경사항 가져오기
git pull

# 원격 저장소 정보 확인
git remote -v

# 브랜치 확인
git branch -a
```

---

## 7. 다음 단계

저장소 연결이 완료되면:

1. ✅ [GitHub Actions 설정](./GITHUB_ACTIONS_SETUP.md) 진행
2. ✅ GitHub Secrets 설정
3. ✅ 첫 푸시 후 Actions 실행 확인

---

## 참고 자료

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub 문서](https://docs.github.com)
- [Personal Access Token 가이드](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

