# 외부 소스와 자산 출처

프로젝트 자체의 배포 라이선스는 아직 선택되지 않았습니다. 이 문서는 포함된 외부 자료의 출처를 설명하며 프로젝트 전체에 새 라이선스를 부여하지 않습니다.

## 포함된 UI 소스

shadcn/ui의 공식 `new-york-v4` Radix registry 스냅샷을 2026-10-06에 가져왔습니다. registry URL·upstream 경로·로컬 수정은 다음 자료에 기록합니다.

- [출처 목록](src/builder/vendor/shadcn/sources.json)
- [원본 MIT 허가문](src/builder/vendor/shadcn/LICENSE.md)
- [로컬 수정 설명](src/builder/vendor/shadcn/README.md)
- [공개 제공용 허가문](public/shadcn-license.txt)

포털·반응형 조회·sidebar 단축키 등은 preview iframe 문서에 맞게 조정했습니다. 자체 chart·tree·swatch는 별도 Prompt Studio 구현입니다.

## 모션과 패키지

Motion 14.0.0 및 관련 motion-dom·motion-utils의 허가문은 [public/motion-license.txt](public/motion-license.txt)에 보존합니다. 다른 npm 의존성의 버전·출처는 `package-lock.json`, 각 패키지의 이용 조건은 설치된 패키지의 허가문을 확인합니다. 이 문서는 모든 전이 의존성의 라이선스 감사를 완료했다는 의미는 아닙니다.

## 샘플 미디어

| 파일                                      | 제작과 용도                            |
| ----------------------------------------- | -------------------------------------- |
| `public/studio-assets/room-afternoon.png` | AI 생성 가상 공간, 비교 전 사진        |
| `public/studio-assets/room-evening.png`   | 같은 공간의 AI 편집, 비교 후 사진      |
| `public/studio-assets/orange-speaker.png` | 브랜드 없는 가상 제품의 AI 생성 이미지 |
| `public/studio-assets/orbit-study.webm`   | 직접 생성한 6초 무음 추상 모션         |
| `public/studio-assets/slow-notes.wav`     | 직접 생성한 12초 전자음 스케치         |
| `public/studio-assets/orbit-study.vtt`    | 내장 영상 자막 샘플                    |

이미지 제작 프롬프트는 [SCENE_IMAGE_PROMPTS.json](docs/SCENE_IMAGE_PROMPTS.json)에 있으며 영상·음성 생성은 `scripts/create-scene-media.mjs`에 있습니다. 프리셋 이미지는 공통 렌더러의 실제 화면을 캡처합니다. 문서 개요 SVG는 저장소에서 직접 작성하고 PNG는 샘플 프로젝트를 실행해 캡처합니다.

사용자가 등록한 자산의 출처·사용 조건은 자산의 credit·description 필드에 기록할 수 있습니다. 외부 HTTPS URL을 입력한 사실만으로 해당 파일이 ZIP에 포함되거나 재배포 조건이 확인되는 것은 아닙니다.
