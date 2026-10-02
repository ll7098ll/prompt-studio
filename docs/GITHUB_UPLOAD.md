# GitHub에 업로드하기

이 폴더는 새 GitHub 저장소의 루트로 사용할 수 있는 소스 패키지입니다. **package.json과 README.md가 저장소 최상위에 오도록** 올립니다. ZIP 파일 한 개만 코드 저장소에 올리는 방식은 소스 업로드와 다릅니다.

## 포함한 것

- 현재 앱과 보존된 기존 데모의 소스
- package.json·package-lock.json, Next·TypeScript·Playwright 설정
- 15개 프리셋 이미지와 테스트·개발 스크립트
- README, 사용자·개발·배포·검증 문서
- GitHub CI, 이슈·PR 템플릿, Git 제외 규칙

## 제외한 것

원래 저장소의 Git 이력, 의존성, 빌드 결과, 브라우저 테스트 산출물, 환경 파일, 기존 운영 계정의 호스팅 설정과 배포 전용 스크립트는 제외했습니다. 원본 소스의 현재 앱 코드와 lockfile은 유지했습니다.

이 패키지는 스냅샷입니다. 원본 프로젝트를 이후 수정하면 별도로 다시 반영해야 합니다.

## 새 저장소에 올리는 순서

1. GitHub에서 원하는 이름의 빈 저장소를 만듭니다.
2. 이 폴더에 README와 .gitignore가 있으므로 저장소 생성 화면에서 중복으로 만들지 않습니다.
3. 아래 명령을 **이 폴더 안에서** 실행합니다.
4. YOUR_NAME과 YOUR_REPOSITORY는 실제 소유자와 저장소 이름으로 바꿉니다.

```sh
git init -b main
git add .
git commit -m "Initial import of Prompt Studio"
git remote add origin https://github.com/YOUR_NAME/YOUR_REPOSITORY.git
git push -u origin main
```

Git 사용자 이름·이메일을 묻는 경우 본인의 Git 설정을 사용합니다. 인증은 GitHub가 제공하는 로그인 방식으로 처리하고 비밀번호나 토큰을 파일에 적지 않습니다.

이미 커밋이 있는 원격 저장소라면 위 순서로 강제 푸시하지 말고 해당 저장소를 먼저 복제한 뒤 파일을 복사하고 변경을 검토합니다.

## 업로드 후

- 첫 화면에 README의 네 이미지와 문서 링크가 표시되는지 확인합니다.
- Actions에서 CI가 실행되는지 확인합니다. 이 패키지를 만들 때 GitHub 원격 실행까지 수행한 것은 아닙니다.
- 저장소의 About에는 아래 설명과 라이브 데모 URL을 넣을 수 있습니다.
- 소유자가 배포·라이선스·기여 접수 방침을 정하면 관련 문서를 갱신합니다.

설명 예:

> 로그인 없이 UI 컴포넌트와 테마를 조립하고, 반응형 미리보기와 AI 구현용 프롬프트·설계 ZIP을 만드는 웹 도구.

주제 예: `ui-builder`, `design-system`, `design-tokens`, `prompt-engineering`, `nextjs`, `react`, `typescript`

## 배포는 별도

GitHub에 소스를 올렸다고 서비스가 자동 배포되지는 않습니다. 포함된 workflow는 기본 검사를 수행합니다. [정적 배포 안내](DEPLOYMENT.md)에 따라 자신의 호스팅을 연결하세요. 현재 라이브 데모의 운영 계정 설정은 이 패키지에 없습니다.
