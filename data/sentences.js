// data/sentences.js - Personalized Senior Full-Stack / Tech Lead IT Interview & Workplace Dataset
// Tailored for Django/DRF, PostgreSQL, Redis, Next.js/TypeScript, Wagtail Headless CMS, Flutter, Cloudflare R2 & Multi-Agent AI Workflows

export const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: '📚' },
  { id: 'interview', label: 'Phỏng vấn IT', icon: '💼' },
  { id: 'standup', label: 'Daily Standup', icon: '☀️' },
  { id: 'codereview', label: 'Code Review & PR', icon: '🔍' },
  { id: 'architecture', label: 'System Design', icon: '📐' },
  { id: 'incident', label: 'Incident & Debug', icon: '🚨' }
];

export const IT_SENTENCES = [
  // ---------------------------------------------------------------------------
  // 1. INTERVIEW (Personalized Senior Full-Stack / Tech Lead Technical Interview)
  // ---------------------------------------------------------------------------
  {
    id: 'interview-01',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    scenePhoto: '../assets/photo-interview.jpg',
    sentence: "In our PropTech platform, I eliminated N+1 query bottlenecks in Django REST Framework using select_related, prefetch_related, and Redis caching, cutting p99 API latency by sixty-five percent.",
    english: "In our PropTech platform, I eliminated N+1 query bottlenecks in Django REST Framework using select_related, prefetch_related, and Redis caching, cutting p99 API latency by sixty-five percent.",
    ipa: "/ɪn ˈaʊər ˈprɒptɛk ˈplætfɔːrm, aɪ ɪˈlɪmɪneɪtɪd ɛn plʌs wʌn ˈkwɪəri ˈbɒtəlnɛks ɪn ˈdʒæŋɡoʊ rɛst ˈfreɪmwɜːrk ˈjuːzɪŋ sɪˈlɛkt rɪˈleɪtɪd, priːˈfɛtʃ rɪˈleɪtɪd, ænd ˈrɛdɪs ˈkæʃɪŋ, ˈkʌtɪŋ piː ˈnaɪnti naɪn ˌeɪpiːˈaɪ ˈleɪtənsi baɪ ˈsɪksti faɪv pərˈsɛnt/",
    stressGuide: "Nhấn mạnh: PROPTECH PLATFORM, ELIMINATED N+1 BOTTLENECKS, SELECT_RELATED, PREFETCH_RELATED, REDIS CACHING, SIXTY-FIVE PERCENT.",
    meaningVi: "Trong nền tảng PropTech của chúng tôi, tôi đã triệt tiêu nút thắt N+1 query trên Django REST Framework bằng select_related, prefetch_related và Redis cache, giúp giảm 65% độ trễ API p99.",
    vietnamese: "Trong nền tảng PropTech của chúng tôi, tôi đã triệt tiêu nút thắt N+1 query trên Django REST Framework bằng select_related, prefetch_related và Redis cache, giúp giảm 65% độ trễ API p99.",
    nuanceVi: "Câu trả lời STAR đắt giá đúng stack thực tế (Django/DRF + PostgreSQL + Redis): nêu rõ bài toán cụ thể, công cụ ORM chuẩn xác và kết quả định lượng (-65% p99 latency).",
    insteadOf: "I made our Django API faster by fixing N+1 queries and adding Redis cache.",
    contextTitle: "Phỏng vấn Backend / Full-Stack: Thành tựu tối ưu hiệu năng API & Database",
    context: "Phỏng vấn Backend / Full-Stack: Thành tựu tối ưu hiệu năng API & Database",
    dialogue: "Interviewer: 'Can you walk me through a high-impact backend optimization you led recently?' - Candidate: 'In our PropTech platform, I eliminated N+1 query bottlenecks in Django REST Framework using select_related, prefetch_related, and Redis caching, cutting p99 API latency by sixty-five percent.'",
    exampleResponse: "That's a huge win. How did you handle cache invalidation when property listings were updated?",
    presets: {
      backend: "In our PropTech platform, I eliminated N+1 query bottlenecks in Django REST Framework using select_related, prefetch_related, and composite PostgreSQL indexes, cutting p99 API latency by 65%.",
      frontend: "In our Next.js Host-App, I implemented dynamic code-splitting, React memoization, and WebGL instanced rendering for our 3D masterplan, improving Core Web Vitals INP and LCP by 55%.",
      mobile: "In our Flutter sales super-app, I decoupled ERP, AppSale, and real-time Chat services using GetIt dependency injection and strict null-safe models, reducing screen load times by 50%.",
      fullstack: "I architected an end-to-end optimization across Django DRF, Redis caching, and Next.js SSR, cutting p99 response time by 65% during peak campaign traffic."
    },
    keyChunks: [
      { chunk: "eliminated N+1 query bottlenecks", meaning: "triệt tiêu các nút thắt truy vấn N+1" },
      { chunk: "select_related and prefetch_related", meaning: "tối ưu eager-loading bảng quan hệ trong Django ORM" },
      { chunk: "cutting p99 API latency by 65%", meaning: "giảm 65% độ trễ API ở phân vị thứ 99" }
    ],
    intonation: "In our PropTech platform ↗, I eliminated N+1 query bottlenecks in Django REST Framework ↗ using select_related, prefetch_related, and Redis caching ↗, cutting p99 API latency by sixty-five percent ↘.",
    keyPhrases: ["eliminated N+1 query bottlenecks", "select_related and prefetch_related", "cutting p99 API latency"],
    alternatives: [
      "I audited our slow DRF serializers with Silk and pg_stat_statements, replacing nested N+1 lookups with Prefetch objects and Redis caching.",
      "By combining PostgreSQL partial indexes with Django prefetch_related, we dropped listing endpoint latency from 850ms down to under 280ms."
    ],
    interviewTip: "Nhắc trực tiếp tới `select_related` (JOIN cho ForeignKey/OneToOne) và `prefetch_related` (in-Python join cho ManyToMany/Reverse FK) giúp interviewer biết ngay bạn là chuyên gia Django thực chiến.",
    difficulty: "B2"
  },
  {
    id: 'interview-02',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    scenePhoto: '../assets/photo-architecture.jpg',
    sentence: "We enforce a single source of truth by generating TypeScript types directly from our Django OpenAPI schema, catching contract breaking changes in CI before merge.",
    english: "We enforce a single source of truth by generating TypeScript types directly from our Django OpenAPI schema, catching contract breaking changes in CI before merge.",
    ipa: "/wiː ɪnˈfɔːrs ə ˈsɪŋɡəl sɔːrs ʌv truːθ baɪ ˈdʒɛnəreɪtɪŋ ˈtaɪpskrɪpt taɪps dɪˈrɛktli frɒm ˈaʊər ˈdʒæŋɡoʊ ˌoʊpənˌeɪpiːˈaɪ ˈskiːmə, ˈkætʃɪŋ ˈkɒntrækt ˈbreɪkɪŋ ˈtʃeɪndʒɪz ɪn ˌsiːˈaɪ bɪˈfɔːr mɜːrdʒ/",
    stressGuide: "Nhấn mạnh: SINGLE SOURCE OF TRUTH, GENERATING TYPESCRIPT TYPES, OPENAPI SCHEMA, BREAKING CHANGES IN CI.",
    meaningVi: "Chúng tôi áp dụng một nguồn chân lý duy nhất bằng cách sinh tự động kiểu TypeScript trực tiếp từ OpenAPI schema của Django, giúp bắt ngay các thay đổi làm vỡ hợp đồng API trên CI trước khi merge.",
    vietnamese: "Chúng tôi áp dụng một nguồn chân lý duy nhất bằng cách sinh tự động kiểu TypeScript trực tiếp từ OpenAPI schema của Django, giúp bắt ngay các thay đổi làm vỡ hợp đồng API trên CI trước khi merge.",
    nuanceVi: "Thể hiện tư duy Solution Architect chuẩn mực: không bao giờ định nghĩa lại kiểu dữ liệu thủ công ở Frontend mà dùng Contract-First / Schema-Driven Development.",
    insteadOf: "We generate TypeScript types from backend Swagger so frontend does not have type bugs.",
    contextTitle: "Phỏng vấn Kiến trúc Full-Stack: Đồng bộ OpenAPI Contract giữa Backend & Frontend",
    context: "Phỏng vấn Kiến trúc Full-Stack: Đồng bộ OpenAPI Contract giữa Backend & Frontend",
    dialogue: "Interviewer: 'How do you prevent API contract drift across your Django backend, Next.js frontend, and mobile apps?' - Candidate: 'We enforce a single source of truth by generating TypeScript types directly from our Django OpenAPI schema, catching contract breaking changes in CI before merge.'",
    exampleResponse: "That eliminates a whole class of runtime bugs. Do you use drf-spectacular on the Django side?",
    presets: {
      backend: "On the Django side, we use drf-spectacular with strict serializer validation to export a deterministic OpenAPI 3.0 schema as our API contract.",
      frontend: "On our Next.js frontend, we strictly ban hardcoded local interfaces and import generated types directly from components['schemas'] in our API schema module.",
      mobile: "In our Flutter app, we isolate ERP, Sales, and Chat API clients behind typed repositories with defensive nullable parsing so backend changes never crash the UI.",
      fullstack: "We enforce a single source of truth by generating TypeScript types directly from our Django OpenAPI schema, catching contract breaking changes in CI before merge."
    },
    keyChunks: [
      { chunk: "enforce a single source of truth", meaning: "áp dụng một nguồn chuẩn duy nhất (SSOT)" },
      { chunk: "generating TypeScript types from OpenAPI schema", meaning: "sinh tự động kiểu TypeScript từ OpenAPI schema" },
      { chunk: "catching contract breaking changes in CI", meaning: "bắt các thay đổi làm vỡ hợp đồng API ngay trên CI" }
    ],
    intonation: "We enforce a single source of truth ↗ by generating TypeScript types directly from our Django OpenAPI schema ↗, catching contract breaking changes in CI before merge ↘.",
    keyPhrases: ["single source of truth", "OpenAPI schema", "contract breaking changes"],
    alternatives: [
      "Our frontend consumes generated `components['schemas']` types directly from the DRF OpenAPI spec, so any schema mismatch fails `tsc --noEmit` in CI.",
      "By treating the OpenAPI specification as an executable contract between Backend and Frontend, we eliminated manual DTO duplication across repositories."
    ],
    interviewTip: "Nêu rõ quy tắc 'Zero self-defined local API types — always import from generated OpenAPI `components[schemas]`' sẽ gây ấn tượng cực mạnh về kỷ luật kỹ thuật.",
    difficulty: "C1"
  },
  {
    id: 'interview-03',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    scenePhoto: '../assets/photo-interview.jpg',
    sentence: "I built an autonomous multi-agent workflow with strict TDD gates and automated browser E2E video verification on Cloudflare R2, doubling release velocity with zero regressions.",
    english: "I built an autonomous multi-agent workflow with strict TDD gates and automated browser E2E video verification on Cloudflare R2, doubling release velocity with zero regressions.",
    ipa: "/aɪ bɪlt ən ɔːˈtɒnəməs ˈmʌlti ˈeɪdʒənt ˈwɜːrkfloʊ wɪð strɪkt ˌtiːdiːˈdiː ɡeɪts ænd ˈɔːtəmeɪtɪd ˈbraʊzər ˌiːtuːˈiː ˈvɪdioʊ ˌvɛrɪfɪˈkeɪʃən ɒn ˈklaʊdflɛər ɑːr tuː, ˈdʌblɪŋ rɪˈliːs vəˈlɒsəti wɪð ˈzɪəroʊ rɪˈɡrɛʃənz/",
    stressGuide: "Nhấn mạnh: AUTONOMOUS MULTI-AGENT WORKFLOW, STRICT TDD GATES, E2E VIDEO VERIFICATION, CLOUDFLARE R2, DOUBLING RELEASE VELOCITY.",
    meaningVi: "Tôi đã xây dựng quy trình đa tác tử AI tự hành với các cổng kiểm duyệt TDD nghiêm ngặt và tự động quay video kiểm thử E2E trên trình duyệt đẩy lên Cloudflare R2, giúp tăng gấp đôi tốc độ phát hành mà không phát sinh lỗi hồi quy.",
    vietnamese: "Tôi đã xây dựng quy trình đa tác tử AI tự hành với các cổng kiểm duyệt TDD nghiêm ngặt và tự động quay video kiểm thử E2E trên trình duyệt đẩy lên Cloudflare R2, giúp tăng gấp đôi tốc độ phát hành mà không phát sinh lỗi hồi quy.",
    nuanceVi: "Điểm khác biệt độc nhất của bạn (Unique Selling Point) ở vị trí Tech Lead / AI-Native Senior Engineer: kết hợp Multi-Agent Orchestration với kỷ luật TDD và bằng chứng video E2E thực tế.",
    insteadOf: "I use AI agents to write code and test automatically so my team works faster.",
    contextTitle: "Phỏng vấn Tech Lead / AI Engineering: Ứng dụng Multi-Agent & Tự động hóa QA",
    context: "Phỏng vấn Tech Lead / AI Engineering: Ứng dụng Multi-Agent & Tự động hóa QA",
    dialogue: "Interviewer: 'How have you leveraged AI workflows to improve engineering productivity without sacrificing code quality?' - Candidate: 'I built an autonomous multi-agent workflow with strict TDD gates and automated browser E2E video verification on Cloudflare R2, doubling release velocity with zero regressions.'",
    exampleResponse: "Recording automated E2E proof videos to Cloudflare R2 before review is brilliant. How do your agents coordinate across roles?",
    presets: {
      backend: "Our backend agent runs in an isolated git worktree following strict two-phase TDD—writing failing RED tests first, then GREEN implementation, followed by an automated OWASP and N+1 audit.",
      frontend: "Our frontend and UX agents verify every screen against our design system tokens and record a real 1440x900 headless browser video uploaded to Cloudflare R2 before requesting review.",
      mobile: "We enforce automated `flutter analyze`, null-safe model validation, and widget test gates so AI-assisted mobile PRs meet 100% of our production architecture standards.",
      fullstack: "I built an autonomous multi-agent workflow with strict TDD gates and automated browser E2E video verification on Cloudflare R2, doubling release velocity with zero regressions."
    },
    keyChunks: [
      { chunk: "autonomous multi-agent workflow", meaning: "quy trình đa tác tử (multi-agent) tự vận hành" },
      { chunk: "strict TDD gates", meaning: "các cổng kiểm duyệt Test-Driven Development nghiêm ngặt" },
      { chunk: "automated browser E2E video verification", meaning: "tự động xác thực E2E trên trình duyệt kèm quay video bằng chứng" },
      { chunk: "doubling release velocity with zero regressions", meaning: "tăng gấp đôi tốc độ phát hành với 0 lỗi hồi quy" }
    ],
    intonation: "I built an autonomous multi-agent workflow with strict TDD gates ↗ and automated browser E2E video verification on Cloudflare R2 ↗, doubling release velocity with zero regressions ↘.",
    keyPhrases: ["autonomous multi-agent workflow", "strict TDD gates", "E2E video verification", "zero regressions"],
    alternatives: [
      "Instead of letting AI write unverified code, I orchestrated role-based agents—Architect, Backend, Frontend, and Red-Team QA—gated by live browser video evidence.",
      "Every pull request in our pipeline requires automated unit tests plus a Cloudflare R2 video recording of the live feature on our dev environment before supporter review."
    ],
    interviewTip: "Các công ty công nghệ năm 2026 rất săn đón kỹ sư không chỉ biết dùng AI gõ code mà biết thiết kế hệ thống kiểm soát chất lượng AI (Quality Gates, TDD, Video Evidence).",
    difficulty: "C1"
  },
  {
    id: 'interview-04',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    scenePhoto: '../assets/photo-architecture.jpg',
    sentence: "Before writing any code, I paraphrase the business goal, build an interactive HTML prototype to lock requirements with stakeholders, and ship in small verifiable pull requests.",
    english: "Before writing any code, I paraphrase the business goal, build an interactive HTML prototype to lock requirements with stakeholders, and ship in small verifiable pull requests.",
    ipa: "/bɪˈfɔːr ˈraɪtɪŋ ˈɛni koʊd, aɪ ˈpærəfreɪz ðə ˈbɪznəs ɡoʊl, bɪld ən ˌɪntərˈæktɪv ˌeɪtʃtiːɛmˈɛl ˈproʊtətaɪp tuː lɒk rɪˈkwaɪərmənts wɪð ˈsteɪkˌhoʊldərz, ænd ʃɪp ɪn smɔːl ˈvɛrɪfaɪəbəl pʊl rɪˈkwɛsts/",
    stressGuide: "Nhấn mạnh: BEFORE WRITING ANY CODE, PARAPHRASE THE BUSINESS GOAL, INTERACTIVE HTML PROTOTYPE, LOCK REQUIREMENTS, SMALL VERIFIABLE PRS.",
    meaningVi: "Trước khi viết bất kỳ dòng code nào, tôi luôn diễn giải lại mục tiêu nghiệp vụ, dựng bản mẫu HTML tương tác được để chốt luồng với các bên liên quan, rồi mới phát hành qua từng PR nhỏ dễ kiểm chứng.",
    vietnamese: "Trước khi viết bất kỳ dòng code nào, tôi luôn diễn giải lại mục tiêu nghiệp vụ, dựng bản mẫu HTML tương tác được để chốt luồng với các bên liên quan, rồi mới phát hành qua từng PR nhỏ dễ kiểm chứng.",
    nuanceVi: "Phản ánh chính xác phong cách làm việc Plan-First + Interactive Prototype (Gate 3.0) của bạn: triệt tiêu rủi ro hiểu sai yêu cầu trước khi tốn công code.",
    insteadOf: "I always check requirements carefully and make a demo before coding.",
    contextTitle: "Phỏng vấn Hành vi & Quy trình: Làm rõ yêu cầu & Chốt Prototype trước khi code",
    context: "Phỏng vấn Hành vi & Quy trình: Làm rõ yêu cầu & Chốt Prototype trước khi code",
    dialogue: "Interviewer: 'How do you handle ambiguous product requirements or prevent costly rework?' - Candidate: 'Before writing any code, I paraphrase the business goal, build an interactive HTML prototype to lock requirements with stakeholders, and ship in small verifiable pull requests.'",
    exampleResponse: "That saves so much engineering time. Stakeholders always understand a clickable prototype better than a static spec.",
    presets: {
      backend: "Before touching database migrations, I clarify edge cases, write an OpenAPI contract and implementation plan, and get architecture sign-off.",
      frontend: "When product specs are ambiguous, I spin up a self-contained clickable HTML prototype so BA, UX, and users can test the flow before we build React components.",
      mobile: "Before implementing complex mobile flows, I align on offline states, API payload contracts, and screen transitions using an interactive prototype.",
      fullstack: "Before writing any code, I paraphrase the business goal, build an interactive HTML prototype to lock requirements with stakeholders, and ship in small verifiable pull requests."
    },
    keyChunks: [
      { chunk: "paraphrase the business goal", meaning: "diễn giải lại mục tiêu nghiệp vụ theo ý hiểu" },
      { chunk: "interactive HTML prototype", meaning: "bản mẫu HTML bấm tương tác được" },
      { chunk: "lock requirements with stakeholders", meaning: "khóa/chốt yêu cầu với các bên liên quan" },
      { chunk: "small verifiable pull requests", meaning: "các pull request nhỏ, dễ kiểm chứng" }
    ],
    intonation: "Before writing any code ↗, I paraphrase the business goal ↗, build an interactive HTML prototype to lock requirements with stakeholders ↗, and ship in small verifiable pull requests ↘.",
    keyPhrases: ["paraphrase the business goal", "interactive HTML prototype", "lock requirements", "small verifiable pull requests"],
    alternatives: [
      "I follow a strict Plan-First discipline: restate the problem in plain terms, validate the UX with a clickable mockup, and only then start TDD implementation.",
      "To avoid building the wrong thing, I bridge BA and Engineering with a live HTML demo that captures feedback inline before we commit to production code."
    ],
    interviewTip: "Nêu quy trình 'Paraphrase -> Interactive HTML Prototype -> Plan -> TDD -> Video Verification' cho thấy bạn có tư duy Product-Minded Tech Lead cực kỳ chín chắn.",
    difficulty: "B2"
  },

  // ---------------------------------------------------------------------------
  // 2. STANDUP (Personalized Daily Standup for Full-Stack / Squad Workflow)
  // ---------------------------------------------------------------------------
  {
    id: 'standup-01',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "I'm currently blocked by the upstream ERP authentication API downtime, so I shifted focus to writing unit tests for our Django permission serializers.",
    english: "I'm currently blocked by the upstream ERP authentication API downtime, so I shifted focus to writing unit tests for our Django permission serializers.",
    ipa: "/aɪm ˈkɜːrəntli blɒkt baɪ ði ˈʌpstriːm ˌiːɑːrˈpiː ɔːˌθɛntɪˈkeɪʃən ˌeɪpiːˈaɪ ˈdaʊntaɪm, soʊ aɪ ˈʃɪftɪd ˈfoʊkəs tuː ˈraɪtɪŋ ˈjuːnɪt tɛsts fɔːr ˈaʊər ˈdʒæŋɡoʊ pərˈmɪʃən ˈsɪəriəlaɪzərz/",
    stressGuide: "Nhấn mạnh: BLOCKED, UPSTREAM ERP API, DOWNTIME, SHIFTED FOCUS, UNIT TESTS, DJANGO SERIALIZERS.",
    meaningVi: "Hiện tại mình đang bị kẹt do API xác thực phía ERP upstream bị gián đoạn, nên mình đã chủ động chuyển sang viết unit test cho các serializer phân quyền trên Django.",
    vietnamese: "Hiện tại mình đang bị kẹt do API xác thực phía ERP upstream bị gián đoạn, nên mình đã chủ động chuyển sang viết unit test cho các serializer phân quyền trên Django.",
    nuanceVi: "Cách báo cáo chuyên nghiệp: vừa nêu rõ nguyên nhân tắc nghẽn khách quan (upstream ERP downtime), vừa thể hiện sự chủ động không ngồi chờ (shifted focus).",
    insteadOf: "I cannot do anything because the ERP auth API is down.",
    contextTitle: "Báo cáo trở ngại (Blocker) và sự chủ động xoay việc trong Daily Standup",
    context: "Báo cáo trở ngại (Blocker) và sự chủ động xoay việc trong Daily Standup",
    dialogue: "Scrum Master: 'Any blockers on the ERP integration today?' - You: 'I'm currently blocked by the upstream ERP authentication API downtime, so I shifted focus to writing unit tests for our Django permission serializers.'",
    exampleResponse: "Thanks for the heads-up, I will ping the ERP platform team right now.",
    keyChunks: [
      { chunk: "blocked by", meaning: "bị kẹt / bị chặn bởi" },
      { chunk: "upstream ERP API downtime", meaning: "gián đoạn API hệ thống ERP phía upstream" },
      { chunk: "shifted focus to", meaning: "chủ động chuyển trọng tâm sang" },
      { chunk: "Django permission serializers", meaning: "bộ serializer phân quyền trong Django DRF" }
    ],
    intonation: "I'm currently blocked ↗ by the upstream ERP authentication API downtime ↗, so I shifted focus ↗ to writing unit tests for our Django permission serializers ↘.",
    keyPhrases: ["blocked by", "upstream ERP API downtime", "shifted focus to", "Django permission serializers"],
    alternatives: [
      "Since the staging ERP endpoint is unreachable, I pivoted to finishing our Next.js OpenAPI type generation and component tests.",
      "I'm blocked on the external auth service outage, so in the meantime I'm increasing test coverage on our RBAC permission module."
    ],
    interviewTip: "Khi phỏng vấn hoặc họp standup, dùng cụm 'shifted focus to' để chứng minh tính tự chủ (ownership) khi một dịch vụ phụ thuộc bị lỗi.",
    difficulty: "B2"
  },
  {
    id: 'standup-02',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "Yesterday I finalized the Wagtail StreamField migration for dynamic landing pages, and today I'm syncing with the frontend team to wire up the Next.js headless preview.",
    english: "Yesterday I finalized the Wagtail StreamField migration for dynamic landing pages, and today I'm syncing with the frontend team to wire up the Next.js headless preview.",
    ipa: "/ˈjɛstərdeɪ aɪ ˈfaɪnəlaɪzd ðə ˈwæɡteɪl ˈstriːmfiːld maɪˈɡreɪʃən fɔːr daɪˈnæmɪk ˈlændɪŋ ˈpeɪdʒɪz, ænd təˈdeɪ aɪm ˈsɪŋkɪŋ wɪð ðə ˈfrʌntɛnd tiːm tuː ˈwaɪər ʌp ðə ˈnɛkst dʒeɪ ɛs ˈhɛdləs ˈpriːvjuː/",
    stressGuide: "Nhấn mạnh: FINALIZED, WAGTAIL STREAMFIELD MIGRATION, SYNCING WITH, WIRE UP, NEXT.JS HEADLESS PREVIEW.",
    meaningVi: "Hôm qua mình đã hoàn tất migration Wagtail StreamField cho các trang landing page động, và hôm nay mình sẽ phối hợp với team Frontend để kết nối luồng xem trước (preview) trên Next.js Headless.",
    vietnamese: "Hôm qua mình đã hoàn tất migration Wagtail StreamField cho các trang landing page động, và hôm nay mình sẽ phối hợp với team Frontend để kết nối luồng xem trước (preview) trên Next.js Headless.",
    nuanceVi: "Báo cáo tiến độ chuẩn Full-Stack (Wagtail Headless CMS + Next.js): rõ việc đã đóng gói hôm qua và điểm chạm phối hợp hôm nay.",
    insteadOf: "Yesterday I did Wagtail migration. Today I will connect Next.js preview.",
    contextTitle: "Cập nhật tiến độ tích hợp Wagtail Headless CMS & Next.js",
    context: "Cập nhật tiến độ tích hợp Wagtail Headless CMS & Next.js",
    dialogue: "Tech Lead: 'Where are we with the headless CMS landing page builder?' - You: 'Yesterday I finalized the Wagtail StreamField migration for dynamic landing pages, and today I'm syncing with the frontend team to wire up the Next.js headless preview.'",
    exampleResponse: "Awesome! Make sure the draft token preview works across both desktop and mobile viewports.",
    keyChunks: [
      { chunk: "finalized the StreamField migration", meaning: "hoàn tất migration cho khối nội dung động StreamField" },
      { chunk: "syncing with the frontend team", meaning: "đồng bộ/phối hợp với nhóm Frontend" },
      { chunk: "wire up the headless preview", meaning: "đấu nối tính năng xem trước (preview) cho Headless CMS" }
    ],
    intonation: "Yesterday I finalized the Wagtail StreamField migration for dynamic landing pages ↗, and today I'm syncing with the frontend team ↗ to wire up the Next.js headless preview ↘.",
    keyPhrases: ["finalized the migration", "syncing with", "wire up", "headless preview"],
    alternatives: [
      "I wrapped up the Wagtail headless API blocks yesterday, and today I'll pair with FE to verify the Next.js ISR revalidation webhook.",
      "The CMS schema migration is merged; today I'm hooking up the Next.js block renderer and running E2E browser checks."
    ],
    interviewTip: "Cụm 'wire up' (đấu nối end-to-end giữa API và UI) rất tự nhiên và được kỹ sư bản xứ dùng hàng ngày.",
    difficulty: "B2"
  },
  {
    id: 'standup-03',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "My PR is merged to dev and verified on Dev Online with a Cloudflare R2 test video, so I've moved the Plane ticket to in-review for supporter sign-off.",
    english: "My PR is merged to dev and verified on Dev Online with a Cloudflare R2 test video, so I've moved the Plane ticket to in-review for supporter sign-off.",
    ipa: "/maɪ ˌpiːˈɑːr ɪz mɜːrdʒd tuː dɛv ænd ˈvɛrɪfaɪd ɒn dɛv ˈɒnlaɪn wɪð ə ˈklaʊdflɛər ɑːr tuː tɛst ˈvɪdioʊ, soʊ aɪv muːvd ðə pleɪn ˈtɪkɪt tuː ɪn rɪˈvjuː fɔːr səˈpɔːrtər saɪn ɒf/",
    stressGuide: "Nhấn mạnh: MERGED TO DEV, VERIFIED ON DEV ONLINE, CLOUDFLARE R2 VIDEO, IN-REVIEW, SUPPORTER SIGN-OFF.",
    meaningVi: "PR của mình đã merge vào nhánh dev và kiểm thử thực tế trên Dev Online kèm video Cloudflare R2, nên mình đã chuyển task trên Plane sang trạng thái in-review để người kiểm tra nghiệm thu.",
    vietnamese: "PR của mình đã merge vào nhánh dev và kiểm thử thực tế trên Dev Online kèm video Cloudflare R2, nên mình đã chuyển task trên Plane sang trạng thái in-review để người kiểm tra nghiệm thu.",
    nuanceVi: "Khớp 100% với quy trình Plane.so & Dev Online của bạn: Merge dev -> Verify trên Dev Online + Quay video R2 -> Chuyển in-review mời Supporter nghiệm thu.",
    insteadOf: "I merged my code and uploaded the video, please review the Plane task.",
    contextTitle: "Báo cáo hoàn tất Dev Online & mời Supporter nghiệm thu trên Plane",
    context: "Báo cáo hoàn tất Dev Online & mời Supporter nghiệm thu trên Plane",
    dialogue: "Project Manager: 'Is the media folder search feature ready for QA?' - You: 'My PR is merged to dev and verified on Dev Online with a Cloudflare R2 test video, so I've moved the Plane ticket to in-review for supporter sign-off.'",
    exampleResponse: "Great discipline! Having the R2 video linked right on the Plane ticket makes review super fast.",
    keyChunks: [
      { chunk: "verified on Dev Online", meaning: "đã kiểm thử thực tế trên môi trường Dev Online" },
      { chunk: "Cloudflare R2 test video", meaning: "video bằng chứng kiểm thử lưu trên Cloudflare R2" },
      { chunk: "moved the ticket to in-review", meaning: "chuyển trạng thái ticket sang chờ review" },
      { chunk: "supporter sign-off", meaning: "xác nhận nghiệm thu từ người kiểm tra (Supporter)" }
    ],
    intonation: "My PR is merged to dev and verified on Dev Online with a Cloudflare R2 test video ↗, so I've moved the Plane ticket to in-review ↗ for supporter sign-off ↘.",
    keyPhrases: ["verified on Dev Online", "Cloudflare R2 test video", "in-review", "supporter sign-off"],
    alternatives: [
      "Once the ticket reaches dev-passed, I'll cherry-pick the commits into a clean release branch off main and tag the next patch version for production.",
      "I've attached the live E2E video link to both the GitHub PR and the Plane issue so the supporter can verify the fix immediately."
    ],
    interviewTip: "Cụm 'for supporter sign-off' (để người phụ trách kiểm tra xác nhận nghiệm thu) rất chuẩn mực trong quy trình Release & QA.",
    difficulty: "B1"
  },
  {
    id: 'standup-04',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "I ran into a race condition during concurrent property booking updates, so I'm adding PostgreSQL row-level locking with select_for_update today.",
    english: "I ran into a race condition during concurrent property booking updates, so I'm adding PostgreSQL row-level locking with select_for_update today.",
    ipa: "/aɪ ræn ˈɪntuː ə reɪs kənˈdɪʃən ˈdjʊərɪŋ kənˈkɜːrənt ˈprɒpərti ˈbʊkɪŋ ˈʌpdeɪts, soʊ aɪm ˈædɪŋ ˈpoʊstɡrɛs roʊ ˈlɛvəl ˈlɒkɪŋ wɪð sɪˈlɛkt fɔːr ʌpˈdeɪt təˈdeɪ/",
    stressGuide: "Nhấn mạnh: RACE CONDITION, CONCURRENT BOOKING UPDATES, ROW-LEVEL LOCKING, SELECT_FOR_UPDATE.",
    meaningVi: "Mình phát hiện lỗi tranh chấp dữ liệu (race condition) khi cập nhật đặt chỗ bất động sản đồng thời, nên hôm nay mình sẽ bổ sung cơ chế khóa dòng trên PostgreSQL bằng select_for_update.",
    vietnamese: "Mình phát hiện lỗi tranh chấp dữ liệu (race condition) khi cập nhật đặt chỗ bất động sản đồng thời, nên hôm nay mình sẽ bổ sung cơ chế khóa dòng trên PostgreSQL bằng select_for_update.",
    nuanceVi: "Nêu đúng bài toán nghiệp vụ Bất động sản (concurrent property booking) và đúng giải pháp kỹ thuật trên Django/PostgreSQL (`select_for_update` trong `transaction.atomic`).",
    insteadOf: "Two users booked the same apartment at the same time, so I will lock the database.",
    contextTitle: "Xử lý xung đột giao dịch đồng thời (Concurrency Control) trong PropTech",
    context: "Xử lý xung đột giao dịch đồng thời (Concurrency Control) trong PropTech",
    dialogue: "Tech Lead: 'How are we preventing double bookings when two sales agents lock the same unit?' - You: 'I ran into a race condition during concurrent property booking updates, so I'm adding PostgreSQL row-level locking with select_for_update today.'",
    exampleResponse: "Good catch. Wrap that inside transaction.atomic and add a concurrent test case to verify.",
    keyChunks: [
      { chunk: "ran into a race condition", meaning: "gặp phải lỗi tranh chấp đồng thời (race condition)" },
      { chunk: "concurrent property booking updates", meaning: "cập nhật giữ căn/đặt chỗ bất động sản cùng lúc" },
      { chunk: "row-level locking with select_for_update", meaning: "khóa mức dòng trong DB bằng select_for_update" }
    ],
    intonation: "I ran into a race condition during concurrent property booking updates ↗, so I'm adding PostgreSQL row-level locking ↗ with select_for_update today ↘.",
    keyPhrases: ["race condition", "concurrent updates", "row-level locking", "select_for_update"],
    alternatives: [
      "To prevent two sales agents from reserving the same unit simultaneously, I wrapped the booking mutation in an atomic transaction with `select_for_update(nowait=True)`.",
      "I'm adding optimistic concurrency control and database row locks so concurrent reservation requests stay 100% consistent."
    ],
    interviewTip: "Trong phỏng vấn hệ thống Booking / E-commerce / PropTech, nhắc tới `transaction.atomic()` kết hợp `select_for_update()` là điểm cộng tuyệt đối.",
    difficulty: "B2"
  },

  // ---------------------------------------------------------------------------
  // 3. CODEREVIEW (Code Review & PR Standards: Django, Next.js, Flutter)
  // ---------------------------------------------------------------------------
  {
    id: 'codereview-01',
    category: 'codereview',
    categoryLabel: 'Code Review & PR',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "Instead of hardcoding local TypeScript interfaces for this table response, let's import the generated OpenAPI schema type from our API schema module.",
    english: "Instead of hardcoding local TypeScript interfaces for this table response, let's import the generated OpenAPI schema type from our API schema module.",
    ipa: "/ɪnˈstɛd ʌv ˈhɑːrdˌkoʊdɪŋ ˈloʊkəl ˈtaɪpskrɪpt ˈɪntərfeɪsɪz fɔːr ðɪs ˈteɪbəl rɪˈspɒns, lɛts ˈɪmpɔːrt ðə ˈdʒɛnəreɪtɪd ˌoʊpənˌeɪpiːˈaɪ ˈskiːmə taɪp frɒm ˈaʊər ˌeɪpiːˈaɪ ˈskiːmə ˈmɒdjuːl/",
    stressGuide: "Nhấn mạnh: INSTEAD OF HARDCODING, LOCAL INTERFACES, IMPORT GENERATED OPENAPI SCHEMA, API SCHEMA MODULE.",
    meaningVi: "Thay vì tự định nghĩa cứng interface TypeScript cục bộ cho dữ liệu bảng này, hãy import trực tiếp kiểu OpenAPI schema đã được sinh tự động từ module API schema của dự án.",
    vietnamese: "Thay vì tự định nghĩa cứng interface TypeScript cục bộ cho dữ liệu bảng này, hãy import trực tiếp kiểu OpenAPI schema đã được sinh tự động từ module API schema của dự án.",
    nuanceVi: "Đúng quy tắc vàng trong Code Review Frontend của bạn (Rule 3: Không tự định nghĩa lại kiểu dữ liệu khi đã có sẵn `components['schemas']`).",
    insteadOf: "Do not write your own TypeScript type here, use the schema file.",
    contextTitle: "Review PR Frontend: Yêu cầu tái sử dụng kiểu từ OpenAPI Schema",
    context: "Review PR Frontend: Yêu cầu tái sử dụng kiểu từ OpenAPI Schema",
    dialogue: "Reviewer: 'Instead of hardcoding local TypeScript interfaces for this table response, let's import the generated OpenAPI schema type from our API schema module.' - Author: 'Good catch! Switched to components[\"schemas\"][\"PropertyItem\"] and removed the duplicate interface.'",
    exampleResponse: "Good catch! Switched to components['schemas']['PropertyItem'] and removed the duplicate interface.",
    keyChunks: [
      { chunk: "instead of hardcoding local interfaces", meaning: "thay vì tự khai báo cứng các interface cục bộ" },
      { chunk: "import the generated OpenAPI schema type", meaning: "import kiểu dữ liệu được sinh từ OpenAPI schema" },
      { chunk: "maintain type safety with backend", meaning: "đảm bảo an toàn kiểu đồng bộ với backend" }
    ],
    intonation: "Instead of hardcoding local TypeScript interfaces for this table response ↗, let's import the generated OpenAPI schema type ↗ from our API schema module ↘.",
    keyPhrases: ["hardcoding local interfaces", "generated OpenAPI schema type", "API schema module"],
    alternatives: [
      "Could we replace this manual DTO type with `components['schemas']['CustomerRecord']` from `@/api/schema` so it stays in sync with backend?",
      "To avoid type drift when backend updates the serializer, let's reuse the generated schema type directly here."
    ],
    interviewTip: "Khi được hỏi bạn thường soi gì khi review code Frontend, trả lời về 'Type contract alignment with OpenAPI schema' thể hiện tầm nhìn kiến trúc tổng thể.",
    difficulty: "B2"
  },
  {
    id: 'codereview-02',
    category: 'codereview',
    categoryLabel: 'Code Review & PR',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "I noticed this DRF SerializerMethodField queries a related table inside a loop; let's prefetch the relation in the ViewSet queryset to avoid an N+1 bottleneck.",
    english: "I noticed this DRF SerializerMethodField queries a related table inside a loop; let's prefetch the relation in the ViewSet queryset to avoid an N+1 bottleneck.",
    ipa: "/aɪ ˈnoʊtɪst ðɪs ˌdiːɑːrˈɛf ˈsɪəriəlaɪzər ˈmɛθəd fiːld ˈkwɪəriz ə rɪˈleɪtɪd ˈteɪbəl ɪnˈsaɪd ə luːp; lɛts priːˈfɛtʃ ðə rɪˈleɪʃən ɪn ðə ˈvjuːsɛt ˈkwɪərisɛt tuː əˈvɔɪd ən ɛn plʌs wʌn ˈbɒtəlnɛk/",
    stressGuide: "Nhấn mạnh: SERIALIZERMETHODFIELD, QUERIES INSIDE A LOOP, PREFETCH IN VIEWSET QUERYSET, AVOID N+1 BOTTLENECK.",
    meaningVi: "Mình nhận thấy SerializerMethodField này đang truy vấn bảng liên kết bên trong vòng lặp; hãy prefetch quan hệ đó ngay ở queryset của ViewSet để tránh nút thắt cổ chai N+1.",
    vietnamese: "Mình nhận thấy SerializerMethodField này đang truy vấn bảng liên kết bên trong vòng lặp; hãy prefetch quan hệ đó ngay ở queryset của ViewSet để tránh nút thắt cổ chai N+1.",
    nuanceVi: "Cực kỳ thực tế khi review code Django REST Framework: lỗi N+1 hay ẩn nấp nhất bên trong `SerializerMethodField` khi serialize danh sách nhiều bản ghi.",
    insteadOf: "Your SerializerMethodField causes an N+1 bug. Fix it in the ViewSet.",
    contextTitle: "Review PR Backend (Django DRF): Bắt lỗi N+1 trong SerializerMethodField",
    context: "Review PR Backend (Django DRF): Bắt lỗi N+1 trong SerializerMethodField",
    dialogue: "Reviewer: 'I noticed this DRF SerializerMethodField queries a related table inside a loop; let's prefetch the relation in the ViewSet queryset to avoid an N+1 bottleneck.' - Author: 'Spot on! I added prefetch_related with a custom Prefetch queryset and verified with assertNumQueries.'",
    exampleResponse: "Spot on! I added prefetch_related and verified with assertNumQueries in our test suite.",
    keyChunks: [
      { chunk: "SerializerMethodField queries a related table", meaning: "hàm tính toán trong serializer gọi truy vấn bảng liên kết" },
      { chunk: "prefetch the relation in the ViewSet queryset", meaning: "tải trước bảng quan hệ ngay tại queryset của ViewSet" },
      { chunk: "avoid an N+1 bottleneck", meaning: "tránh nút thắt hiệu năng N+1 query" }
    ],
    intonation: "I noticed this DRF SerializerMethodField queries a related table inside a loop ↗; let's prefetch the relation in the ViewSet queryset ↗ to avoid an N+1 bottleneck ↘.",
    keyPhrases: ["SerializerMethodField", "prefetch the relation", "ViewSet queryset", "N+1 bottleneck"],
    alternatives: [
      "Calling `.count()` inside `get_items_count` triggers an extra SQL query per row; let's annotate it on the queryset using `Count()` instead.",
      "Let's add a `self.assertNumQueries()` test around this list endpoint so future changes can't accidentally reintroduce N+1 queries."
    ],
    interviewTip: "Nhắc đến `SerializerMethodField` + `annotate(Count(...))` + `assertNumQueries()` trong phỏng vấn Django khẳng định đẳng cấp Senior Backend Reviewer.",
    difficulty: "B2"
  },
  {
    id: 'codereview-03',
    category: 'codereview',
    categoryLabel: 'Code Review & PR',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "Let's keep this fix minimal and focused on the root cause rather than refactoring unrelated modules in the same pull request.",
    english: "Let's keep this fix minimal and focused on the root cause rather than refactoring unrelated modules in the same pull request.",
    ipa: "/lɛts kiːp ðɪs fɪks ˈmɪnɪməl ænd ˈfoʊkəst ɒn ðə ruːt kɔːz ˈræðər ðæn ˌriːˈfæktərɪŋ ˌʌnrɪˈleɪtɪd ˈmɒdjuːlz ɪn ðə seɪm pʊl rɪˈkwɛst/",
    stressGuide: "Nhấn mạnh: KEEP THIS FIX MINIMAL, FOCUSED ON ROOT CAUSE, RATHER THAN REFACTORING, UNRELATED MODULES.",
    meaningVi: "Hãy giữ bản sửa lỗi này thật gọn và tập trung đúng vào nguyên nhân gốc rễ, thay vì refactor cả những module không liên quan trong cùng một Pull Request.",
    vietnamese: "Hãy giữ bản sửa lỗi này thật gọn và tập trung đúng vào nguyên nhân gốc rễ, thay vì refactor cả những module không liên quan trong cùng một Pull Request.",
    nuanceVi: "Thể hiện triết lý Ponytail / YAGNI của bạn: ưu tiên giải pháp ngắn gọn, tối giản, không làm phình diff gây rủi ro ảnh hưởng chéo (side-effects).",
    insteadOf: "Your PR changes too many files. Only change what is needed for the bug.",
    contextTitle: "Review PR: Giữ PR tinh gọn (Minimal Fix / YAGNI) & tránh side-effects",
    context: "Review PR: Giữ PR tinh gọn (Minimal Fix / YAGNI) & tránh side-effects",
    dialogue: "Reviewer: 'Let's keep this fix minimal and focused on the root cause rather than refactoring unrelated modules in the same pull request.' - Author: 'Makes sense, I reverted the cosmetic edits in shared utils so this PR is a clean 10-line fix.'",
    exampleResponse: "Makes sense, I reverted the unrelated edits so this PR is a clean 10-line fix.",
    keyChunks: [
      { chunk: "keep this fix minimal", meaning: "giữ bản sửa lỗi tối giản nhất có thể" },
      { chunk: "focused on the root cause", meaning: "tập trung giải quyết đúng nguyên nhân gốc" },
      { chunk: "refactoring unrelated modules", meaning: "tái cấu trúc các module không liên quan" }
    ],
    intonation: "Let's keep this fix minimal and focused on the root cause ↗ rather than refactoring unrelated modules ↗ in the same pull request ↘.",
    keyPhrases: ["keep this fix minimal", "focused on the root cause", "unrelated modules"],
    alternatives: [
      "To make cherry-picking this hotfix into `main` safe and conflict-free, let's split the unrelated cleanup into a separate PR.",
      "Preferring the simplest standard-library solution here keeps the diff small and eliminates regression risk across shared packages."
    ],
    interviewTip: "Các Engineering Manager rất thích ứng viên giữ PR nhỏ, dễ review và dễ cherry-pick khi cần phát hành lên Production.",
    difficulty: "B1"
  },

  // ---------------------------------------------------------------------------
  // 4. ARCHITECTURE (System Design: Multi-App Ecosystem, Headless CMS, 3D WebGL)
  // ---------------------------------------------------------------------------
  {
    id: 'architecture-01',
    category: 'architecture',
    categoryLabel: 'System & Architecture',
    scenePhoto: '../assets/photo-architecture.jpg',
    sentence: "To support our multi-tenant PropTech ecosystem, we separated the ERP core, Sales Portal, and Real-time Chat into modular services with strict RBAC permission boundaries.",
    english: "To support our multi-tenant PropTech ecosystem, we separated the ERP core, Sales Portal, and Real-time Chat into modular services with strict RBAC permission boundaries.",
    ipa: "/tuː səˈpɔːrt ˈaʊər ˈmʌlti ˈtɛnənt ˈprɒptɛk ˈiːkoʊˌsɪstəm, wiː ˈsɛpəreɪtɪd ði ˌiːɑːrˈpiː kɔːr, seɪlz ˈpɔːrtəl, ænd ˈriːəl taɪm tʃæt ˈɪntuː ˈmɒdjʊlər ˈsɜːrvɪsɪz wɪð strɪkt ˌɑːrbiːeɪˈsiː pərˈmɪʃən ˈbaʊndəriz/",
    stressGuide: "Nhấn mạnh: MULTI-TENANT PROPTECH ECOSYSTEM, SEPARATED ERP CORE, SALES PORTAL, REAL-TIME CHAT, STRICT RBAC BOUNDARIES.",
    meaningVi: "Để phục vụ hệ sinh thái PropTech đa tổ chức, chúng tôi tách lõi ERP, Cổng bán hàng (AppSale) và Chat thời gian thực thành các dịch vụ phân tách rõ ranh giới phân quyền RBAC.",
    vietnamese: "Để phục vụ hệ sinh thái PropTech đa tổ chức, chúng tôi tách lõi ERP, Cổng bán hàng (AppSale) và Chat thời gian thực thành các dịch vụ phân tách rõ ranh giới phân quyền RBAC.",
    nuanceVi: "Mô tả chính xác kiến trúc đa phân hệ (ERP / AppSale / Chat + Host-App / Open-CMS) mà bạn đang xây dựng và vận hành thực tế.",
    insteadOf: "We split our system into ERP, Sales, and Chat services with different permissions.",
    contextTitle: "Thuyết trình Kiến trúc Hệ sinh thái PropTech (ERP / Sales / Chat / CMS)",
    context: "Thuyết trình Kiến trúc Hệ sinh thái PropTech (ERP / Sales / Chat / CMS)",
    dialogue: "Principal Architect: 'How is your platform structured across internal staff and external sales collaborators?' - You: 'To support our multi-tenant PropTech ecosystem, we separated the ERP core, Sales Portal, and Real-time Chat into modular services with strict RBAC permission boundaries.'",
    exampleResponse: "Clean separation of concerns. How do you handle real-time notifications across Web and Flutter?",
    keyChunks: [
      { chunk: "multi-tenant PropTech ecosystem", meaning: "hệ sinh thái công nghệ bất động sản đa khách hàng/tổ chức" },
      { chunk: "separated into modular services", meaning: "tách thành các dịch vụ theo mô-đun độc lập" },
      { chunk: "strict RBAC permission boundaries", meaning: "ranh giới phân quyền theo vai trò (RBAC) chặt chẽ" }
    ],
    intonation: "To support our multi-tenant PropTech ecosystem ↗, we separated the ERP core, Sales Portal, and Real-time Chat into modular services ↗ with strict RBAC permission boundaries ↘.",
    keyPhrases: ["multi-tenant PropTech ecosystem", "modular services", "RBAC permission boundaries"],
    alternatives: [
      "On mobile and web, each domain—ERP, AppSale, and Chat—uses its own dedicated API client and token scope so failures remain isolated.",
      "We combined Django Channels for real-time WebSocket chat with a stateless DRF API tier backed by Redis and PostgreSQL."
    ],
    interviewTip: "Khi trình bày kiến trúc dự án thực tế của bạn, mở đầu bằng bài toán nghiệp vụ ('To support our multi-tenant PropTech ecosystem...') giúp người nghe nắm ngay bức tranh lớn.",
    difficulty: "C1"
  },
  {
    id: 'architecture-02',
    category: 'architecture',
    categoryLabel: 'System & Architecture',
    scenePhoto: '../assets/photo-architecture.jpg',
    sentence: "For our interactive 3D masterplan viewer, we use Three.js InstancedMesh and multi-level LODs to render thousands of buildings and trees at a smooth sixty frames per second.",
    english: "For our interactive 3D masterplan viewer, we use Three.js InstancedMesh and multi-level LODs to render thousands of buildings and trees at a smooth sixty frames per second.",
    ipa: "/fɔːr ˈaʊər ˌɪntərˈæktɪv θriː diː ˈmæstərplæn ˈvjuːər, wiː juːz θriː dʒeɪ ɛs ˈɪnstənst mɛʃ ænd ˈmʌlti ˈlɛvəl ˌɛloʊˈdiːz tuː ˈrɛndər ˈθaʊzəndz ʌv ˈbɪldɪŋz ænd triːz æt ə smuːð ˈsɪksti freɪmz pər ˈsɛkənd/",
    stressGuide: "Nhấn mạnh: INTERACTIVE 3D MASTERPLAN, THREE.JS INSTANCEDMESH, MULTI-LEVEL LODS, SIXTY FRAMES PER SECOND.",
    meaningVi: "Đối với sa bàn ảo 3D quy hoạch tổng thể, chúng tôi sử dụng InstancedMesh của Three.js kết hợp đa tầng mức chi tiết (Multi-LOD) để vẽ hàng nghìn tòa nhà và cây cối mượt mà ở tốc độ 60 FPS.",
    vietnamese: "Đối với sa bàn ảo 3D quy hoạch tổng thể, chúng tôi sử dụng InstancedMesh của Three.js kết hợp đa tầng mức chi tiết (Multi-LOD) để vẽ hàng nghìn tòa nhà và cây cối mượt mà ở tốc độ 60 FPS.",
    nuanceVi: "Điểm nhấn kỹ thuật cực kỳ ấn tượng cho mảng WebGL2 / Three.js PropTech 3D Masterplan của bạn: giảm số lượng draw calls bằng `InstancedMesh` và `Multi-LOD`.",
    insteadOf: "We use Three.js instancing so the 3D real estate map runs fast at 60 FPS.",
    contextTitle: "Thiết kế đồ họa 3D trên trình duyệt: Tối ưu GPU cho Sa bàn bất động sản",
    context: "Thiết kế đồ họa 3D trên trình duyệt: Tối ưu GPU cho Sa bàn bất động sản",
    dialogue: "Engineering Director: 'How do you render an entire real-estate masterplan in the browser without crashing mobile GPUs?' - You: 'For our interactive 3D masterplan viewer, we use Three.js InstancedMesh and multi-level LODs to render thousands of buildings and trees at a smooth sixty frames per second.'",
    exampleResponse: "Impressive GPU budget discipline! Do you also offload wind animations to custom GLSL vertex shaders?",
    keyChunks: [
      { chunk: "interactive 3D masterplan viewer", meaning: "trình xem sa bàn quy hoạch tổng thể 3D tương tác" },
      { chunk: "Three.js InstancedMesh", meaning: "kỹ thuật gom nhiều vật thể cùng lưới vào 1 lệnh vẽ GPU (draw call)" },
      { chunk: "multi-level LODs (Level of Detail)", meaning: "đa cấp độ chi tiết theo khoảng cách camera" },
      { chunk: "sixty frames per second", meaning: "60 khung hình/giây mượt mà" }
    ],
    intonation: "For our interactive 3D masterplan viewer ↗, we use Three.js InstancedMesh and multi-level LODs ↗ to render thousands of buildings and trees at a smooth sixty frames per second ↘.",
    keyPhrases: ["3D masterplan viewer", "Three.js InstancedMesh", "multi-level LODs", "sixty frames per second"],
    alternatives: [
      "We moved foliage wind sway and atmospheric sky transitions into GPU vertex shaders so the main JavaScript thread stays completely free for UI interactions.",
      "By batching trees, amenities, and spline vehicles into instanced draw calls and disposing GPU geometries on unmount, we prevent WebGL context loss."
    ],
    interviewTip: "Rất ít kỹ sư Full-Stack vừa giỏi Backend Django vừa làm chủ được Three.js / WebGL2 `InstancedMesh` — đây là vũ khí tạo ấn tượng mạnh nhất khi phỏng vấn.",
    difficulty: "C1"
  },
  {
    id: 'architecture-03',
    category: 'architecture',
    categoryLabel: 'System & Architecture',
    scenePhoto: '../assets/photo-architecture.jpg',
    sentence: "By decoupling our Wagtail Headless CMS from the Next.js frontend and caching media assets on Cloudflare R2 CDN, we achieved sub-second page loads globally.",
    english: "By decoupling our Wagtail Headless CMS from the Next.js frontend and caching media assets on Cloudflare R2 CDN, we achieved sub-second page loads globally.",
    ipa: "/baɪ diːˈkʌplɪŋ ˈaʊər ˈwæɡteɪl ˈhɛdləs ˌsiːɛmˈɛs frɒm ðə ˈnɛkst dʒeɪ ɛs ˈfrʌntɛnd ænd ˈkæʃɪŋ ˈmiːdiə ˈæsɛts ɒn ˈklaʊdflɛər ɑːr tuː ˌsiːdiːˈɛn, wiː əˈtʃiːvd sʌb ˈsɛkənd peɪdʒ loʊdz ˈɡloʊbəli/",
    stressGuide: "Nhấn mạnh: DECOUPLING WAGTAIL HEADLESS CMS, NEXT.JS FRONTEND, CLOUDFLARE R2 CDN, SUB-SECOND PAGE LOADS.",
    meaningVi: "Bằng cách tách rời Wagtail Headless CMS khỏi tầng giao diện Next.js và phân phối tài nguyên đa phương tiện qua Cloudflare R2 CDN, chúng tôi đạt tốc độ tải trang dưới 1 giây.",
    vietnamese: "Bằng cách tách rời Wagtail Headless CMS khỏi tầng giao diện Next.js và phân phối tài nguyên đa phương tiện qua Cloudflare R2 CDN, chúng tôi đạt tốc độ tải trang dưới 1 giây.",
    nuanceVi: "Giải thích súc tích lý do chọn kiến trúc Headless CMS (Wagtail StreamField + Next.js + Cloudflare R2) vừa tối ưu SEO/GEO vừa chịu tải cao.",
    insteadOf: "We use Wagtail Headless with Next.js and Cloudflare R2 so the website loads under one second.",
    contextTitle: "Kiến trúc Headless CMS & Tối ưu CDN / SEO / Core Web Vitals",
    context: "Kiến trúc Headless CMS & Tối ưu CDN / SEO / Core Web Vitals",
    dialogue: "CTO: 'Why did we choose a Headless Wagtail setup instead of traditional server-rendered templates?' - You: 'By decoupling our Wagtail Headless CMS from the Next.js frontend and caching media assets on Cloudflare R2 CDN, we achieved sub-second page loads globally.'",
    exampleResponse: "And marketing still gets flexible StreamField blocks while engineering controls the React performance.",
    keyChunks: [
      { chunk: "decoupling Wagtail Headless CMS", meaning: "tách rời hệ quản trị nội dung Wagtail Headless khỏi giao diện" },
      { chunk: "caching media assets on Cloudflare R2 CDN", meaning: "lưu đệm ảnh/video trên mạng phân phối Cloudflare R2" },
      { chunk: "sub-second page loads", meaning: "tốc độ tải trang dưới 1 giây" }
    ],
    intonation: "By decoupling our Wagtail Headless CMS from the Next.js frontend ↗ and caching media assets on Cloudflare R2 CDN ↗, we achieved sub-second page loads globally ↘.",
    keyPhrases: ["Wagtail Headless CMS", "Cloudflare R2 CDN", "sub-second page loads"],
    alternatives: [
      "Editors compose dynamic landing pages using Wagtail StreamField blocks, while Next.js renders them with structured JSON-LD schema for maximum SEO and AI search visibility.",
      "Offloading heavy images and QA demo videos to Cloudflare R2 keeps our application containers lightweight and eliminates egress bottlenecks."
    ],
    interviewTip: "Kết hợp kiến thức Backend CMS (Wagtail StreamField), Cloud Storage (Cloudflare R2) và Frontend SEO/CWV (Next.js) cho thấy bạn làm chủ toàn bộ vòng đời sản phẩmWeb.",
    difficulty: "C1"
  },

  // ---------------------------------------------------------------------------
  // 5. INCIDENT (Incident Response, Sentry Debugging, Safe Release Cherry-Pick)
  // ---------------------------------------------------------------------------
  {
    id: 'incident-01',
    category: 'incident',
    categoryLabel: 'Incident & Debugging',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "We traced the 502 spike on Railway to PostgreSQL connection pool exhaustion caused by an unindexed filter, applied a composite index, and restored normal latency.",
    english: "We traced the 502 spike on Railway to PostgreSQL connection pool exhaustion caused by an unindexed filter, applied a composite index, and restored normal latency.",
    ipa: "/wiː treɪst ðə faɪv oʊ tuː spaɪk ɒn ˈreɪlweɪ tuː ˈpoʊstɡrɛs kəˈnɛkʃən puːl ɪɡˈzɔːstʃən kɔːzd baɪ ən ʌnˈɪndɛkst ˈfɪltər, əˈplaɪd ə kəmˈpɒzɪt ˈɪndɛks, ænd rɪˈstɔːrd ˈnɔːrməl ˈleɪtənsi/",
    stressGuide: "Nhấn mạnh: TRACED 502 SPIKE, CONNECTION POOL EXHAUSTION, UNINDEXED FILTER, COMPOSITE INDEX, RESTORED NORMAL LATENCY.",
    meaningVi: "Chúng tôi truy vết đợt tăng vọt lỗi 502 trên Railway là do cạn kiệt connection pool của PostgreSQL bởi một bộ lọc thiếu index, đã đánh bổ sung composite index và khôi phục độ trễ bình thường.",
    vietnamese: "Chúng tôi truy vết đợt tăng vọt lỗi 502 trên Railway là do cạn kiệt connection pool của PostgreSQL bởi một bộ lọc thiếu index, đã đánh bổ sung composite index và khôi phục độ trễ bình thường.",
    nuanceVi: "Đầy đủ chuỗi xử lý sự cố chuẩn Senior: Triệu chứng (502 spike) -> Nguyên nhân gốc (connection pool exhaustion do unindexed filter) -> Hành động khắc phục (composite index) -> Kết quả (restored normal latency).",
    insteadOf: "Railway had 502 errors because database had no index, so we added an index and fixed it.",
    contextTitle: "Báo cáo xử lý sự cố 502 & Cạn kiệt kết nối Database trên Cloud",
    context: "Báo cáo xử lý sự cố 502 & Cạn kiệt kết nối Database trên Cloud",
    dialogue: "Incident Commander: 'What caused the 502 alert on the host-app environment earlier?' - You: 'We traced the 502 spike on Railway to PostgreSQL connection pool exhaustion caused by an unindexed filter, applied a composite index, and restored normal latency.'",
    exampleResponse: "Great turnaround. Let's add an EXPLAIN ANALYZE check for new filter fields in our backend review checklist.",
    keyChunks: [
      { chunk: "traced the 502 spike to", meaning: "truy vết nguyên nhân đợt tăng đột biến lỗi 502 tới" },
      { chunk: "connection pool exhaustion", meaning: "tình trạng cạn kiệt vùng kết nối cơ sở dữ liệu" },
      { chunk: "applied a composite index", meaning: "đánh chỉ mục kép (composite index) cho các cột lọc" },
      { chunk: "restored normal latency", meaning: "khôi phục lại độ trễ ổn định bình thường" }
    ],
    intonation: "We traced the 502 spike on Railway to PostgreSQL connection pool exhaustion ↗ caused by an unindexed filter ↗, applied a composite index, and restored normal latency ↘.",
    keyPhrases: ["502 spike", "connection pool exhaustion", "composite index", "restored normal latency"],
    alternatives: [
      "Using Sentry breadcrumbs and PostgreSQL slow query logs, we pinpointed the full-table scan and created a concurrent index without locking production writes.",
      "We immediately scaled PgBouncer pool limits to stabilize traffic, then deployed a migration adding the missing B-tree composite index."
    ],
    interviewTip: "Nhắc đến `CREATE INDEX CONCURRENTLY` trong PostgreSQL khi phỏng vấn sự cố DB sẽ chứng minh bạn biết cách đánh index trên Production mà không gây khóa bảng (table lock).",
    difficulty: "C1"
  },
  {
    id: 'incident-02',
    category: 'incident',
    categoryLabel: 'Incident & Debugging',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "To prevent unverified commits on dev from leaking into production, I cherry-pick only the approved task commits onto a clean release branch off main before tagging.",
    english: "To prevent unverified commits on dev from leaking into production, I cherry-pick only the approved task commits onto a clean release branch off main before tagging.",
    ipa: "/tuː prɪˈvɛnt ˌʌnvɛrɪˈfaɪd kəˈmɪts ɒn dɛv frɒm ˈliːkɪŋ ˈɪntuː prəˈdʌkʃən, aɪ ˈtʃɛri pɪk ˈoʊnli ði əˈpruːvd tæsk kəˈmɪts ˈɒntuː ə kliːn rɪˈliːs bræntʃ ɒf meɪn bɪˈfɔːr ˈtæɡɪŋ/",
    stressGuide: "Nhấn mạnh: PREVENT UNVERIFIED COMMITS, LEAKING INTO PRODUCTION, CHERRY-PICK APPROVED COMMITS, CLEAN RELEASE BRANCH OFF MAIN.",
    meaningVi: "Để ngăn các commit chưa nghiệm thu trên nhánh dev lọt lên Production, tôi chỉ cherry-pick đúng các commit thuộc task đã duyệt sang một nhánh release sạch tách từ main trước khi đóng tag phát hành.",
    vietnamese: "Để ngăn các commit chưa nghiệm thu trên nhánh dev lọt lên Production, tôi chỉ cherry-pick đúng các commit thuộc task đã duyệt sang một nhánh release sạch tách từ main trước khi đóng tag phát hành.",
    nuanceVi: "Mô tả chính xác quy trình Release Production tự động (`dev passed` -> cherry-pick vào nhánh sạch từ `origin/main` -> tag `v*` -> GitHub Actions deploy PROD) của bạn.",
    insteadOf: "We do not merge all of dev into main; we cherry-pick only finished tasks to deploy production.",
    contextTitle: "Quy trình Phát hành Production An toàn (Clean Cherry-Pick & Semantic Tagging)",
    context: "Quy trình Phát hành Production An toàn (Clean Cherry-Pick & Semantic Tagging)",
    dialogue: "Release Manager: 'How do we ship this urgent feature to production when the dev branch still has unfinished tasks?' - You: 'To prevent unverified commits on dev from leaking into production, I cherry-pick only the approved task commits onto a clean release branch off main before tagging.'",
    exampleResponse: "That guarantees our main branch and production tags stay 100% clean and auditable.",
    keyChunks: [
      { chunk: "prevent unverified commits from leaking into production", meaning: "ngăn các commit chưa kiểm thử lọt lên môi trường thật" },
      { chunk: "cherry-pick only the approved task commits", meaning: "chỉ nhặt đúng các commit của task đã được nghiệm thu" },
      { chunk: "clean release branch off main", meaning: "nhánh phát hành sạch được tách trực tiếp từ nhánh main" }
    ],
    intonation: "To prevent unverified commits on dev from leaking into production ↗, I cherry-pick only the approved task commits ↗ onto a clean release branch off main before tagging ↘.",
    keyPhrases: ["unverified commits", "leaking into production", "cherry-pick", "clean release branch"],
    alternatives: [
      "Once a ticket reaches dev-passed, we open a dedicated release PR into main, bump the semantic patch tag, and trigger GitHub Actions for zero-downtime production deployment.",
      "Isolating production releases via cherry-picked branches off main lets multiple squads merge freely into dev without blocking hotfixes."
    ],
    interviewTip: "Kể rõ cách bạn tách luồng kiểm thử trên `dev` và phát hành chọn lọc lên `main` qua `cherry-pick` + `semver tag` là câu trả lời thực chiến tuyệt vời cho câu hỏi CI/CD.",
    difficulty: "B2"
  },
  {
    id: 'incident-03',
    category: 'incident',
    categoryLabel: 'Incident & Debugging',
    scenePhoto: '../assets/photo-teamwork.jpg',
    sentence: "We uploaded source maps and Dart symbol files to Sentry so minified production stack traces resolve directly to the exact file and line number.",
    english: "We uploaded source maps and Dart symbol files to Sentry so minified production stack traces resolve directly to the exact file and line number.",
    ipa: "/wiː ʌpˈloʊdɪd sɔːrs mæps ænd dɑːrt ˈsɪmbəl faɪlz tuː ˈsɛntri soʊ ˈmɪnɪfaɪd prəˈdʌkʃən stæk ˈtreɪsɪz rɪˈzɒlv dɪˈrɛktli tuː ði ɪɡˈzækt faɪl ænd laɪn ˈnʌmbər/",
    stressGuide: "Nhấn mạnh: UPLOADED SOURCE MAPS, DART SYMBOL FILES, SENTRY, MINIFIED STACK TRACES, EXACT FILE AND LINE NUMBER.",
    meaningVi: "Chúng tôi đã tải source maps và file biểu tượng Dart lên Sentry để các stack trace bị nén trên production hiển thị rõ chính xác tên file và dòng code gây lỗi.",
    vietnamese: "Chúng tôi đã tải source maps và file biểu tượng Dart lên Sentry để các stack trace bị nén trên production hiển thị rõ chính xác tên file và dòng code gây lỗi.",
    nuanceVi: "Kỹ năng Observability & Debugging thực tế cho cả Web (Next.js/TypeScript source maps) và Mobile (Flutter/Dart obfuscation symbols) trên Sentry.",
    insteadOf: "We added source maps to Sentry so we can read production errors easily.",
    contextTitle: "Giám sát lỗi Production (Sentry Observability cho Web & Flutter Mobile)",
    context: "Giám sát lỗi Production (Sentry Observability cho Web & Flutter Mobile)",
    dialogue: "Mobile Lead: 'The crash report from production shows obfuscated hex addresses—how can we debug it?' - You: 'We uploaded source maps and Dart symbol files to Sentry so minified production stack traces resolve directly to the exact file and line number.'",
    exampleResponse: "Huge time saver! Tying each Sentry release to suspect commits also tells us immediately who owns the fix.",
    keyChunks: [
      { chunk: "uploaded source maps and symbol files", meaning: "tải bản đồ mã nguồn và file giải mã ký hiệu lên hệ thống giám sát" },
      { chunk: "minified production stack traces", meaning: "vết ngăn xếp lỗi đã bị rút gọn/làm rối trên môi trường thật" },
      { chunk: "resolve directly to the exact file and line", meaning: "ánh xạ trực tiếp về đúng file và dòng code gốc" }
    ],
    intonation: "We uploaded source maps and Dart symbol files to Sentry ↗ so minified production stack traces ↗ resolve directly to the exact file and line number ↘.",
    keyPhrases: ["source maps", "Dart symbol files", "minified stack traces", "exact file and line number"],
    alternatives: [
      "In CI, every production tag automatically creates a Sentry release, uploads source maps, and links commits so we can spot regressions within minutes.",
      "Before closing any Sentry issue, we reproduce the stack trace in a unit test and link the `Fixes` commit directly in the pull request."
    ],
    interviewTip: "Nêu kinh nghiệm tích hợp Sentry Release + Source Maps / Dart Symbols vào CI/CD cho thấy bạn có kinh nghiệm vận hành sản phẩm thật ở quy mô lớn.",
    difficulty: "B2"
  }
];

export default IT_SENTENCES;
