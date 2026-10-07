# 문서 안내

현재 사용법과 구현 구조를 찾는 출발점입니다. 현재 기능 설명은 소스의 **schemaVersion 5**를 기준으로 하며, 기존 계획과 검사 기록은 아래에 연결합니다.

## 목적별 문서

| 문서                                        | 내용                                        |
| ------------------------------------------- | ------------------------------------------- |
| [프로젝트 README](../README.md)             | 소개, 화면, 기능, 빠른 실행                 |
| [사용 가이드](USER_GUIDE.md)                | 조립, 내부 편집, 테마, 미디어, 단축키, 복구 |
| [아키텍처](ARCHITECTURE.md)                 | 모듈 구성, 문서 관계, 렌더링, 저장 도식     |
| [설치와 개발](DEVELOPMENT.md)               | 환경, 명령, 경로, 변경 지점                 |
| [테스트](TESTING.md)                        | 단위·브라우저·성능 검사와 확인 결과         |
| [이번 검증 결과](VALIDATION.md)             | 업로드본의 소스 기준과 직접 실행한 검사     |
| [배포](DEPLOYMENT.md)                       | 정적 빌드, 호스팅 설정, 복구                |
| [AI 전달](AI_HANDOFF.md)                    | ZIP 파일 목록, 읽는 순서, 명세 우선순위     |
| [데이터와 개인정보](DATA_AND_PRIVACY.md)    | 저장, 파일 제한, 공유, 백업                 |
| [GitHub 업로드](GITHUB_UPLOAD.md)           | 생성 폴더, ZIP, 업로드 절차, 제외 항목      |
| [진행 계획](ROADMAP.md)                     | 완료 범위와 후속 목표                       |
| [화면과 이미지](images/README.md)           | 실제 화면, 개요 이미지, 제작 방법           |
| [기여 안내](../CONTRIBUTING.md)             | 변경·검증·PR 기준                           |
| [변경 기록](../CHANGELOG.md)                | 현재 소스 스냅샷의 주요 변경                |
| [보안 안내](../SECURITY.md)                 | 문제 제보와 진단 자료 취급                  |
| [외부 소스 안내](../THIRD_PARTY_NOTICES.md) | UI 소스·모션·샘플 미디어 출처               |

## 도식 위치

| 도식                         | 문서                                          |
| ---------------------------- | --------------------------------------------- |
| 조립에서 AI 전달까지         | [README](../README.md#사용-흐름)              |
| 편집기·저장·렌더러·전달 연결 | [아키텍처](ARCHITECTURE.md#전체-구조)         |
| Project·Page·Node·Asset 관계 | [아키텍처](ARCHITECTURE.md#문서-관계)         |
| 저장 성공·충돌·복구 과정     | [아키텍처](ARCHITECTURE.md#저장-흐름)         |
| 같은 revision의 AI 자료 생성 | [AI 전달](AI_HANDOFF.md#생성-흐름)            |
| 소스에서 정적 배포까지       | [배포](DEPLOYMENT.md#배포-흐름)               |
| GitHub 패키지 생성           | [GitHub 업로드](GITHUB_UPLOAD.md#패키지-구조) |

Mermaid 도식은 GitHub에서 렌더링됩니다. 별도 이미지가 필요한 곳에는 README의 SVG 개요와 PNG 화면을 사용합니다.

## 기존 설계와 실행 기록

아래 자료는 설계 당시 목표, 중간 기능 수, 이전 검사 결과를 포함합니다. 현재 사용법은 위 문서를 먼저 읽고 상세 변경 근거는 최신 실행 기록을 확인하세요.

| 문서                                                                           | 성격                                |
| ------------------------------------------------------------------------------ | ----------------------------------- |
| [PRODUCT_PLAN.md](PRODUCT_PLAN.md)                                             | 초기 제품 방향과 단계별 완료 조건   |
| [FREEFORM_EDITOR_PLAN.md](FREEFORM_EDITOR_PLAN.md)                             | 자유 편집기의 설계 및 확장 기록     |
| [DESIGN_MEDIA_EDITOR_EXPANSION_PLAN.md](DESIGN_MEDIA_EDITOR_EXPANSION_PLAN.md) | 디자인·미디어 확장의 전체 목표      |
| [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)                           | 차수별 구현·검사 기록               |
| [EXPANSION_EXECUTION.md](EXPANSION_EXECUTION.md)                               | 2026-10-07 확장의 상세 실행 기록    |
| [MOTION_RUNTIME.md](MOTION_RUNTIME.md)                                         | 모션 기술·지원 범위·측정 한계       |
| [기존 레이아웃 설계안](../layout_architecture_plan.md)                         | 기존 데모 개선을 위한 초기 아이디어 |
| [SCENE_IMAGE_PROMPTS.json](SCENE_IMAGE_PROMPTS.json)                           | 내장 이미지 제작 프롬프트           |

운영 식별자는 기존 실행 기록에 남아 있을 수 있으나, 업로드 패키지에는 `.openai/hosting.json`과 기존 Sites 게시 스크립트를 포함하지 않습니다.
