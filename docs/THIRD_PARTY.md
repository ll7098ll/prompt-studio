> 이전 업로드의 참고 문서입니다. 현재 기능·설치·출처 안내는 [문서 목차](README.md)를 기준으로 확인하세요.

# 외부 의존성과 자산

## 패키지

정확한 설치 버전과 의존성 트리는 `package-lock.json`에 기록되어 있습니다. 직접 의존성은 `package.json`을 기준으로 합니다. 각 패키지의 라이선스·NOTICE 원문은 설치된 패키지와 해당 공식 저장소에서 확인해야 합니다. 이 문서는 모든 전이 의존성의 라이선스 전문을 모은 파일이 아닙니다.

주요 구성은 Next.js, React, TypeScript, Tailwind CSS, Zod, Lucide React, html-to-image, JSZip, Playwright, axe-core입니다. 원본 앱의 패키지 목록은 업로드 패키지에서도 유지했습니다.

## 폰트와 이미지

- 현재 레이아웃은 `next/font/google`을 통해 Geist·Geist Mono를 빌드 시 가져옵니다.
- 기존 `/legacy/`는 Pretendard CDN, Google Fonts, Unsplash 이미지 URL을 사용합니다.
- 사용자가 추가하는 외부 이미지의 사용 권한은 해당 자산에 따라 달라집니다.
- `public/template-previews/`의 15개 이미지는 현재 프리셋을 공통 렌더러로 캡처한 예시입니다.
- 현재 프리셋의 장식은 자체 CSS/SVG 예시이며 외부 Figma 디자인 파일을 포함하지 않습니다.

## 참고 자료

[Figma 웹 디자인 트렌드](https://www.figma.com/ko-kr/resource-library/web-design-trends/)는 선명한 컬러·큰 타이포·다크·네오브루탈리즘·레트로·콜라주 방향의 참고 자료입니다. 해당 회사와의 제휴나 공식 제품임을 의미하지 않습니다.

디자인 토큰 내보내기는 [DTCG 2025.10 형식](https://www.designtokens.org/tr/2025.10/format/)을 참고합니다.

프로젝트 자체의 라이선스 지정 상태는 [별도 문서](LICENSE_STATUS.md)에 있습니다.
