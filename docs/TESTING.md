# 테스트와 검증 상태

## 기본 검사

깨끗한 설치에서 다음 순서로 실행합니다. 빌드가 Next 라우트 타입을 생성하므로 초기 타입 검사는 빌드 뒤에 둡니다.

```sh
npm ci
npm test
npm run lint:studio
npm run build
npm run typecheck
```

전체 `npm run lint`는 보존된 기존 데모도 포함하며 별도 정리가 남아 있습니다. 현재 편집기만의 검사를 전체 저장소 lint 통과로 표현하지 않습니다.

## 브라우저 검사

기본 구성은 **설치된 Microsoft Edge + Playwright Firefox·WebKit**입니다.

```sh
npx playwright install firefox webkit
```

Windows PowerShell:

```powershell
npm run build
$env:STUDIO_TEST_STATIC = '1'
npm run test:e2e
npm run test:performance
```

Linux/macOS:

```sh
npm run build
STUDIO_TEST_STATIC=1 npm run test:e2e
STUDIO_TEST_STATIC=1 npm run test:performance
```

Edge가 없으면 `npx playwright install chromium`으로 Chromium을 준비한 뒤 `playwright.config.ts`의 `channel: "msedge"`를 제거해 기본 Chromium을 사용하도록 변경합니다. 썸네일·프리셋 감사 스크립트도 같은 channel을 사용하므로 해당 launch 설정을 함께 바꿉니다. 환경별 실행 여부를 검증 결과에 기록하세요.

`STUDIO_TEST_STATIC`이 없으면 Playwright는 개발 서버를 사용합니다. 설정은 3200 포트의 기존 서버를 재사용할 수 있으므로 정적 배포를 검사할 때 다른 프로젝트나 개발 서버가 그 포트를 사용하지 않는지 확인하세요.

## 썸네일과 프리셋

별도 터미널에서 `npm start`로 빌드 결과를 제공한 뒤 실행합니다.

```sh
npx tsx scripts/template-previews.ts
npx tsx scripts/audit-templates.ts
npm run build
```

썸네일은 `public/template-previews/`에 저장합니다. 새 이미지를 배포하려면 다시 빌드합니다. 감사 결과는 `artifacts/`, 실패 자료는 `test-results/`에 생성되며 Git 추적 대상에서 제외됩니다.

## 기존 릴리스의 검증 기록

### 업로드 패키지 자체 확인

2026-10-02 패키지의 별도 복사본에서 `npm ci`로 새로 설치한 뒤 단위 검사 15/15, `lint:studio`, 정적 빌드, `typecheck`가 모두 통과했습니다. 문서의 상대 링크 48개와 GitHub workflow YAML 구문을 검사했습니다. 앱 소스·원본 설정·lockfile은 원본과 바이트 단위로 같으며 운영 계정 식별자와 로컬 생성 디렉터리를 제외했는지 점검했습니다. GitHub 호스팅 러너에서 CI를 실행한 것은 아닙니다.

### 원본 앱의 브라우저 검사

2026-10-02 / Windows / Node.js 24.14.0 기준입니다. 아래 브라우저 결과는 이 패키지와 동일한 앱 소스의 원본 릴리스에서 수행한 기록이며 새 GitHub Actions 실행 결과가 아닙니다.

| 항목                    | 결과                                                        |
| ----------------------- | ----------------------------------------------------------- |
| 단위 검사               | 15/15 통과                                                  |
| 기능 시나리오           | 엔진당 24개, 총 72개를 전체 및 변경 영향 범위 재검사로 확인 |
| 마지막 영향 범위 재검사 | 라이브러리·편집·저장·공유·내보내기 45/45 통과               |
| 프리셋                  | 15종 × 데스크톱·모바일 30개 화면, 가로 넘침 없음            |
| axe 검사                | 위 프리셋 30개 화면 WCAG 2 A/AA 및 2.1 AA 위반 0건          |
| 기타                    | 현재 편집기 lint, TypeScript, 정적 빌드 통과                |

검사에는 중첩 팝업 포커스, 실제 데모 동작, 사용자 지정 폭 PNG, Flex/Grid 배치, 대형 문서 끝 요소 편집·실행 취소, 재열기, 탭 충돌, 손상 자료 격리, 두 저장소 실패 시 JSON 백업을 포함합니다.

## 성능

200개 콘텐츠 요소(199개 텍스트 + 50행 표), 워밍업 5회 뒤 한국어 속성 변경 20회를 측정했습니다. 1600×1000 환경에서 단일 작업자로 trace·screenshot을 끄고 검사합니다. 입력 이벤트부터 DOM 반영 후 다음 animation frame까지의 지연이며 실제 모니터 픽셀 표시 시간을 직접 측정하지 않습니다.

| 엔진                   | DPR | 마지막 p95 | 최대   | p95 100ms 미만 |
| ---------------------- | --- | ---------- | ------ | -------------- |
| Edge / Chromium 153    | 1   | 61.7ms     | 65.3ms | 통과           |
| Firefox 155            | 1   | 95ms       | 102ms  | 통과           |
| Playwright WebKit 26.6 | 2   | 240ms      | 286ms  | 실패           |

WebKit은 직전 실행에서 102ms, 마지막 실행에서 240ms로 편차가 컸습니다. 원인이 확정되지 않았으며 목표를 완화하지 않았습니다. 이 검사는 다른 부하·기기·실제 Safari에서의 성능 보장이 아닙니다.

## 자동화 범위

`.github/workflows/ci.yml`은 push·pull request·수동 실행에서 npm 설치, 단위 검사, 현재 편집기 lint, 정적 빌드, 타입 검사를 수행하도록 구성했습니다. GitHub 원격 실행은 저장소에 업로드한 뒤 확인해야 합니다.

브라우저·실기기·성능·사용성 검사는 이 기본 CI에 포함하지 않았습니다. [checkout](https://github.com/actions/checkout)과 [setup-node](https://github.com/actions/setup-node)의 공식 사용법을 기준으로 구성했습니다.

## 미검증 범위

실제 macOS/iOS Safari·Android 기기, OS 한국어 IME 후보 입력, 외부 AI 독립 재현, 신규 사용자의 사용성 관찰과 장기간 운영 복구는 미검증입니다. axe의 0건 결과는 완전한 접근성 인증이 아닙니다.
