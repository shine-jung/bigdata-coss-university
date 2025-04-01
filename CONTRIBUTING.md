# Git 컨벤션 가이드

## 브랜치 전략

프로젝트는 Git Flow를 기반으로 한 브랜치 전략을 사용합니다.

### 브랜치 구조

- `main`: 프로덕션 브랜치
- `dev`: 개발 브랜치
- `feature/*`: 새로운 기능 개발
- `hotfix/*`: 긴급 버그 수정
- `release/*`: 릴리즈 준비

### 브랜치 네이밍 규칙

- feature 브랜치: `feature/feature-name`
- hotfix 브랜치: `hotfix/bug-name`
- release 브랜치: `release/version-name`

## 커밋 메시지 규칙

커밋 메시지는 다음 형식을 따릅니다:

```
[type] <subject>
```

### Type 종류

- [feat] 새로운 기능
- [fix] 버그 수정
- [docs] 문서 수정
- [style] 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- [refactor] 코드 리팩토링
- [test] 테스트 코드, 리팩토링 테스트 코드 추가
- [chore] 빌드 업무 수정, 패키지 매니저 수정

### 커밋 메시지 작성 규칙

#### 제목 (Subject)

- 50자 이내로 작성
- 현재 시제로 작성
- 첫 글자는 대문자로 작성
- 끝에 마침표(.) 금지

### 예시

```
[feat] Add student management feature
```

## Pull Request 규칙

### PR 제목

- 커밋 메시지와 동일한 형식 사용

### PR 설명

다음 내용을 포함해야 합니다:

- 변경 사항 설명
- 테스트 방법
- 관련 이슈 번호
- 스크린샷 (UI 변경의 경우)

## 머지 규칙

1. `dev` → `main` 머지 시 자동 배포
2. 머지 전 코드 리뷰 필수
3. CI/CD 파이프라인 통과 필수

## 자동화된 도구

- 커밋 메시지 템플릿: `.gitmessage`
- 코드 포맷팅: Prettier
- 린팅: ESLint
