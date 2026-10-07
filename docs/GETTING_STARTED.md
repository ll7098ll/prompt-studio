> 이전 업로드의 참고 문서입니다. 현재 기능·설치·출처 안내는 [문서 목차](README.md)를 기준으로 확인하세요.

# 시작하기

## 준비

- 검증 환경: Node.js 24.14.0, npm, Windows.
- 설치된 Next.js 16.3.7의 Node 엔진 조건은 20.9.0 이상입니다. 이 패키지의 재현 환경은 `.nvmrc`의 24.14.0을 기준으로 합니다.
- Git은 저장소를 복제하거나 업로드할 때 필요합니다.
- 설치·최초 빌드에는 인터넷 연결이 필요합니다. 레이아웃의 `next/font/google`이 Geist와 Geist Mono를 빌드할 때 가져옵니다.
- 앱 실행용 환경 변수, AI API 키, 데이터베이스는 없습니다.

## 설치와 개발

압축을 풀고 `package.json`이 있는 폴더에서 실행합니다.

```sh
npm ci
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 엽니다. 개발 서버 종료는 터미널에서 Ctrl+C입니다.

다른 포트가 필요하면:

```sh
npm run dev -- --port 3001
```

## 빌드와 로컬 확인

```sh
npm run build
npm start
```

[http://localhost:3200](http://localhost:3200)을 엽니다. `out/`에 정적 파일이 생성됩니다. `npm start`는 파일 확인용 서버이므로 실제 배포는 [배포 문서](DEPLOYMENT.md)를 따릅니다.

## 명령어

| 명령어                     | 용도                                |
| -------------------------- | ----------------------------------- |
| `npm ci`                   | lockfile에 맞춰 의존성 설치         |
| `npm run dev`              | Next 개발 서버                      |
| `npm run build`            | 정적 배포 파일과 Next 타입 생성     |
| `npm start`                | 빌드된 out 디렉터리 로컬 확인       |
| `npm test`                 | 문서 모델·토큰·프리셋 등 단위 검사  |
| `npm run typecheck`        | TypeScript 검사                     |
| `npm run lint:studio`      | 현재 편집기와 테스트의 ESLint 검사  |
| `npm run lint`             | 기존 데모를 포함한 전체 ESLint 검사 |
| `npm run test:e2e`         | 세 엔진의 기능·접근성·복구 검사     |
| `npm run test:performance` | 단일 작업자로 성능 별도 측정        |

깨끗한 체크아웃에서 타입 검사 전에 `npm run build`를 실행하세요. `next-env.d.ts`가 가리키는 라우트 타입은 Next가 생성합니다. 브라우저 검사에는 [추가 준비](TESTING.md)가 필요합니다.

## 자주 만나는 문제

**npm ci 실패**  
Node/npm 버전과 네트워크 접근을 확인합니다. `package.json`만 수정하고 lockfile을 갱신하지 않았다면 두 파일의 차이를 먼저 확인합니다. 인증 정보가 포함된 npm 설정을 저장소에 올리지 마세요.

**빌드 중 Google Fonts 다운로드 실패**  
현재 앱은 Geist 계열을 빌드 시 가져옵니다. 네트워크·프록시를 확인하거나, 의도적으로 로컬 폰트 방식으로 변경한 뒤 화면을 재검증합니다. 빌드 실패를 코드 검사 통과로 기록하지 않습니다.

**npm start에서 404가 나옴**  
같은 폴더에서 `npm run build`가 성공했는지, `out/index.html`이 있는지 확인합니다.

**타입 검사에 .next/types 파일이 없다고 나옴**  
깨끗한 설치에서 먼저 `npm run build`로 Next 타입을 생성합니다.

**다른 주소에서 프로젝트가 보이지 않음**  
localhost, 배포 도메인, 브라우저 프로필은 저장 공간이 다릅니다. 원래 주소에서 JSON을 내보낸 뒤 새 주소에서 가져옵니다.

**Edge를 찾지 못해 브라우저 검사가 실패함**  
기본 Chromium 프로젝트는 Microsoft Edge를 사용합니다. [검증 문서](TESTING.md)의 엔진 설정을 확인합니다.
