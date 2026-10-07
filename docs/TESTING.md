# 테스트와 검증

## 기본 검사

```sh
npm ci
npm test
npm run lint:studio
npm run build
npm run typecheck
```

깨끗한 설치에서는 빌드 후 타입을 검사합니다. 전체 `lint`는 기존 데모까지 포함합니다. 현재 CI는 위 기본 검사와 GitHub 패키지 생성을 실행하며 브라우저 전체 회귀와 성능 측정은 별도 실행합니다.

## 브라우저 검사

기능 검사 설정은 `playwright.config.ts`에 있습니다. Chromium 프로젝트는 `channel: msedge`로 설치된 Microsoft Edge를 사용합니다. Firefox·WebKit 엔진을 준비하세요.

```sh
npx playwright install firefox webkit
```

Edge가 없다면 `npx playwright install msedge`로 설치하거나 검사 설정의 channel과 엔진을 실행 환경에 맞춰 조정합니다. Linux에서 엔진에 필요한 시스템 패키지는 Playwright의 `--with-deps` 옵션으로 설치할 수 있습니다.

개발 서버 검사:

```sh
npm run test:e2e
```

정적 산출물 검사, Windows PowerShell:

```powershell
npm run build
$env:STUDIO_TEST_STATIC = '1'
npm run test:e2e
Remove-Item Env:STUDIO_TEST_STATIC
```

macOS/Linux:

```sh
npm run build
STUDIO_TEST_STATIC=1 npm run test:e2e
```

서버 주소는 기본 `127.0.0.1:3200`이며 필요하면 `PORT`를 지정합니다. 기존 서버를 재사용하므로 해당 포트가 검사할 빌드를 서비스하는지 확인합니다.

## 검사 범위

| 영역        | 대표 확인 항목                                           |
| ----------- | -------------------------------------------------------- |
| 문서        | 트리 검증, 잘못된 입력, v2/v3/v4 변환, 복제와 참조 유지  |
| 편집        | 드래그, 내부 부분, 한글 입력, 반응형, Undo/Redo          |
| 저장        | 새로고침, 두 탭 충돌, 탭별 복구, 손상 기록 격리          |
| 자산        | 파일 시그니처, 교체, 원본 해시, 임시 URL 해제, ZIP 복원  |
| 콘텐츠      | 단계 폼, 챕터 포커스, 서식 본문, 항목 순서와 외형 유지   |
| 미디어·모션 | 컨트롤, 정지 상태 캡처, 재생 조건, 움직임 감소, 포커스   |
| 전달·공유   | ZIP 내부 자료, 캡처 폭, 원본 없는 브라우저에서 공유 복제 |
| 접근성      | 키보드·포커스와 axe 자동 검사                            |

`tests/e2e/`에 기능별 검사가 있고 `tests/fixtures/`는 실제 import·호환성 검사용 자료입니다. 테스트 결과 폴더와 개인 복구 파일은 업로드 패키지에 넣지 않습니다.

## 성능 검사

```powershell
$env:STUDIO_TEST_STATIC = '1'
npm run test:performance
Remove-Item Env:STUDIO_TEST_STATIC
```

성능 설정은 작업자 1개와 trace 비활성화를 사용합니다. 다른 브라우저 검사와 동시에 실행하지 않습니다. 입력 지연과 모션 프레임 간격은 서로 다른 지표입니다. 모션 측정 스크립트는 `PORT` 기본값이 3201이므로 해당 포트의 정적 서버를 준비한 후 `npx tsx scripts/measure-motion.ts`를 실행합니다.

## 기록을 읽는 기준

이 문서 정리 작업에서 직접 실행한 검사는 [검증 결과](VALIDATION.md)에 기록합니다. 기존 작업의 검사·성능·배포 기록은 [확장 실행 기록](EXPANSION_EXECUTION.md)과 [구현 상태](IMPLEMENTATION_STATUS.md)에 있습니다. 과거 검사 결과를 이번 패키지의 재검사 결과로 표시하지 않습니다.

이전 최신 기록의 단위 51개와 브라우저 261개는 전체 실행 후 영향 범위 재검사를 합친 확인 범위입니다. 단일 최종 261/261 실행 기록은 아닙니다. Windows Playwright WebKit의 WAV/WebM 코덱 대체 검사도 실제 Safari 재생 성공과 구분합니다. 실기기·외부 AI의 독립 재현은 별도 검증 항목입니다.
