<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 페르소나 본문 작성 규칙 (항상 적용 — 사용자 지시)

**모든 Threads 본문 생성(픽·뉴스·콘텐츠 포맷)은 두 가지를 동시에 지킨다:**

1. **벤치마킹 페르소나의 톤·틀 유지** — 각 계정의 성격·시그니처·구조를 절대 바꾸지 않는다.
   - 단타시그널(s_trader91): 대시(-) 불릿·짧고 건조·"본인 기준에 맞다면 관심"
   - 단타이스트(insights_trader86): 사실→격언/관찰→의문형
   - 단타데일리: `[MM/DD]`·1·2·3·"결정은 본인의 몫"
   - 단타Lab(badakstock): 통념 반박·"진짜 이유는 따로"·"차트 뒤 진짜 판"
   - 스캘퍼: `🔻이슈 📍자리` 단발·"시초가 어디냐?"
2. **사람이 직접 손으로 쓴 것처럼 항상 변주** — 그 톤·틀 **안에서** 매번 첫 줄·마무리·길이(짧게/길게)·개인 코멘트가 달라진다. 같은 골격을 기계적으로 반복하지 않는다(봇 티 금지).

→ 구현: `lib/pick-caption.ts`·`lib/threads-formats.ts`의 변형 풀 + 길이 모드 + variant 회전. 새 생성 포맷을 만들 때도 이 두 원칙(성격 고정 + 풀 기반 변주)을 반드시 따른다. 시그니처 문구는 회전(3회차당 1회 이하)으로 봇 티 방지.
