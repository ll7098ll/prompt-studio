# 설치와 개발

## 개발 환경

검증 기준은 Node.js 24.x와 npm입니다. 설치된 Next.js 16.3.7 안내의 최소 Node.js 버전은 20.9입니다. Windows PowerShell, macOS, Linux에서 npm 명령을 사용할 수 있습니다.

환경 변수·API 키·데이터베이스 서버·로그인이 필요하지 않습니다. `.env.example`은 필수 설정이 없으므로 제공하지 않습니다. 의존성은 `package-lock.json`을 유지하고 `npm ci`로 설치합니다.

```sh
npm ci
npm run dev
```

기본 개발 주소는 `http://localhost:3000`입니다. 포트를 지정하려면 `npm run dev -- --port 3001`을 사용합니다. Tailwind 생성 CSS는 개발 시작과 빌드 전에 자동으로 만듭니다.

## 명령 목록

| 명령                       | 용도                                           |
| -------------------------- | ---------------------------------------------- |
| `npm run dev`              | CSS 생성 후 Next.js 개발 서버                  |
| `npm run styles`           | iframe·캡처용 `public/studio-ui.css` 생성      |
| `npm run build`            | 정적 사이트를 `out/`으로 출력                  |
| `npm start`                | `out/` 검증 서버, 기본 3200 포트               |
| `npm test`                 | 문서·디자인·자산·팩·콘텐츠·장면·모션 단위 검사 |
| `npm run typecheck`        | TypeScript 검사                                |
| `npm run lint:studio`      | 현재 편집기·라우트·테스트 검사                 |
| `npm run lint`             | 보존된 기존 데모까지 포함한 전체 검사          |
| `npm run test:e2e`         | Edge·Firefox·WebKit 기능 검사                  |
| `npm run test:performance` | 별도 단일 작업자 성능 검사                     |
| `npm run docs:screenshots` | 로컬 정적 서버에서 문서용 화면 캡처            |
| `npm run package:github`   | 업로드 소스 폴더·ZIP·파일 해시 목록 생성       |

깨끗한 설치에서 `npm run build`를 먼저 실행한 뒤 `npm run typecheck`를 실행합니다. `src/app/layout.tsx`의 `LayoutProps`와 `next-env.d.ts`가 사용하는 라우트 타입은 Next.js가 생성합니다.

빌드 없이 타입만 확인하려면 `npx next typegen` 후 `npm run typecheck`를 사용합니다. 이 명령도 설치된 Next.js의 CLI 안내를 따릅니다.

## 라우트

| 경로       | 역할                               |
| ---------- | ---------------------------------- |
| `/`        | 현재 프로젝트 작업 공간            |
| `/studio/` | 같은 작업 공간의 명시적 경로       |
| `/view/`   | URL fragment의 읽기 전용 공유 사본 |
| `/legacy/` | 이전 데모                          |

## 기능별 변경 지점

컴포넌트 추가는 등록부의 정의·속성·기본값, 공통 렌더러, 편집 패널, AI 동작 명세를 함께 확인합니다. 조합 블록은 독립 자식을 만드는 recipe를 사용합니다. 테마는 실제 값과 토큰 출력의 일치를, 자산은 참조·원본 보관·ZIP 복원을, 모션은 설정·실행·정지·부분 스타일 보존을 확인합니다.

파일 형식을 바꾸면 `model.ts`의 검증과 이전 버전 변환을 함께 다룹니다. 사용자 문서를 조용히 삭제하거나 기존 저장소를 초기화하지 않습니다. [아키텍처](ARCHITECTURE.md)에 핵심 파일을 정리했습니다.

Next.js 코드 변경 전에는 이 설치의 `node_modules/next/dist/docs/`에서 관련 안내를 읽습니다. 저장소의 [AGENTS.md](../AGENTS.md)가 이 규칙을 기록합니다. 일반적인 과거 Next.js 사용법을 그대로 적용하지 마세요.

## 이미지와 고정 자료

정적 빌드 후 `npm start`를 실행한 별도 터미널을 열고 다음 명령을 사용합니다.

```sh
npm run docs:screenshots
npx tsx scripts/template-previews.ts
npx tsx scripts/audit-templates.ts
```

문서 화면과 프리셋 캡처는 기본적으로 Microsoft Edge를 사용합니다. 프리셋 이미지를 갱신하면 다시 `npm run build`해야 배포 산출물에 포함됩니다. 미디어 생성·shadcn 가져오기 스크립트는 기본 설치에 필요하지 않습니다. vendored 소스를 갱신할 때는 [원본 출처와 로컬 수정](../src/builder/vendor/shadcn/README.md)을 확인하세요.

## 자주 막히는 부분

| 증상                                   | 확인할 내용                                        |
| -------------------------------------- | -------------------------------------------------- |
| 깨끗한 설치에서 라우트 타입을 못 찾음  | `npm run build`로 타입을 생성한 후 검사            |
| 빌드에서 Geist 다운로드 실패           | `next/font/google`의 네트워크 접근 확인            |
| iframe의 UI 스타일 누락                | `npm run styles` 후 새로고침                       |
| `npm start`에서 404                    | `npm run build`와 `out/index.html` 확인            |
| Playwright 엔진을 못 찾음              | [테스트 안내](TESTING.md)의 엔진 설치              |
| 백업 ZIP의 자산 누락 오류              | 같은 출처의 자산 원본이 남아 있는지 확인           |
| 전체 lint 실패                         | 현재 검사 범위 `lint:studio`와 기존 데모 진단 구분 |
| 패키지를 다시 생성할 때 폴더 존재 오류 | 새 이름으로 `--name prompt-studio-v2` 지정         |
