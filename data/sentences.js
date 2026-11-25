// data/sentences.js - Curated IT English & Interview Sentences Dataset

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
  // 1. STANDUP (Daily Standup)
  // ---------------------------------------------------------------------------
  {
    id: 'standup-01',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    sentence: "I'm currently blocked by the upstream authentication API downtime, so I shifted focus to writing unit tests for the checkout flow.",
    english: "I'm currently blocked by the upstream authentication API downtime, so I shifted focus to writing unit tests for the checkout flow.",
    ipa: "/aɪm ˈkɜːrəntli blɒkt baɪ ði ˈʌpstriːm ɔːˌθɛntɪˈkeɪʃən ˌeɪpiːˈaɪ ˈdaʊntaɪm, soʊ aɪ ˈʃɪftɪd ˈfoʊkəs tuː ˈraɪtɪŋ ˈjuːnɪt tɛsts fɔːr ðə ˈtʃɛkaʊt floʊ/",
    stressGuide: "Nhấn mạnh các từ khóa: BLOCKED, UPSTREAM, AUTHENTICATION, DOWNTIME, SHIFTED FOCUS, UNIT TESTS, CHECKOUT FLOW.",
    meaningVi: "Hiện tại mình đang bị kẹt do API xác thực phía upstream bị sập, nên mình đã chủ động chuyển sang viết unit test cho luồng checkout.",
    vietnamese: "Hiện tại mình đang bị kẹt do API xác thực phía upstream bị sập, nên mình đã chủ động chuyển sang viết unit test cho luồng checkout.",
    nuanceVi: "Cách báo cáo chuyên nghiệp: vừa nêu rõ nguyên nhân tắc nghẽn khách quan (upstream downtime), vừa thể hiện sự chủ động không ngồi chờ (shifted focus).",
    insteadOf: "I cannot do anything because auth API is dead.",
    contextTitle: "Báo cáo trở ngại (Blocker) trong buổi Daily Scrum",
    context: "Báo cáo trở ngại (Blocker) trong buổi Daily Scrum",
    dialogue: "Scrum Master: 'Any blockers today?' - Dev: 'I'm currently blocked by the upstream authentication API downtime, so I shifted focus to writing unit tests for the checkout flow.' - Scrum Master: 'Thanks for the heads-up, I will ping the auth team right now.'",
    exampleResponse: "Thanks for the heads-up, I will ping the auth team right now.",
    keyChunks: [{ chunk: "blocked by", meaning: "bị kẹt bởi / bị chặn bởi" }, { chunk: "upstream API downtime", meaning: "downtime của API upstream" }, { chunk: "shifted focus to", meaning: "chuyển trọng tâm sang" }, { chunk: "checkout flow", meaning: "luồng thanh toán (checkout)" }],
    intonation: "I'm currently blocked ↗ by the upstream authentication API downtime ↗, so I shifted focus ↗ to writing unit tests for the checkout flow ↘.",
    keyPhrases: ["blocked by", "upstream API downtime", "shifted focus to", "checkout flow"],
    alternatives: [
      "I'm blocked on the auth service outage, so in the meantime I'm tackling unit test coverage.",
      "Since the upstream auth endpoint is unreachable, I pivoted to writing tests for the checkout logic."
    ],
    interviewTip: "Khi phỏng vấn, dùng cụm 'shifted focus to' để chứng minh tính tự chủ (ownership) và khả năng thích ứng linh hoạt khi gặp sự cố bất khả kháng.",
    difficulty: "B2"
  },
  {
    id: 'standup-02',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    sentence: "Yesterday I finalized the migration script for user permissions, and today I'm planning to pair with Alex on the Redis cache integration.",
    english: "Yesterday I finalized the migration script for user permissions, and today I'm planning to pair with Alex on the Redis cache integration.",
    ipa: "/ˈjɛstərdeɪ aɪ ˈfaɪnəlaɪzd ðə maɪˈɡreɪʃən skrɪpt fɔːr ˈjuːzər pərˈmɪʃənz, ænd təˈdeɪ aɪm ˈplænɪŋ tuː pɛər wɪð ˈælɪks ɒn ðə ˈrɛdɪs kæʃ ˌɪntɪˈɡreɪʃən/",
    stressGuide: "Nhấn mạnh: FINALIZED, MIGRATION SCRIPT, PAIR WITH, REDIS CACHE, INTEGRATION.",
    meaningVi: "Hôm qua mình đã hoàn tất script migration phân quyền người dùng, và hôm nay mình dự định sẽ pair-program cùng Alex phần tích hợp cache Redis.",
    vietnamese: "Hôm qua mình đã hoàn tất script migration phân quyền người dùng, và hôm nay mình dự định sẽ pair-program cùng Alex phần tích hợp cache Redis.",
    nuanceVi: "Cấu trúc kinh điển của Daily Standup: Hôm qua làm gì (finalized...), hôm nay làm gì (planning to pair with...).",
    insteadOf: "Yesterday I did migration. Today I will code Redis with Alex.",
    contextTitle: "Cập nhật tiến độ ngày & kế hoạch cộng tác",
    context: "Cập nhật tiến độ ngày & kế hoạch cộng tác",
    dialogue: "Alex: 'Hey, are you free this afternoon?' - Dev: 'Yes, yesterday I finalized the migration script for user permissions, and today I'm planning to pair with you on the Redis cache integration.'",
    exampleResponse: "Awesome! Let's jump on a quick huddle around 2 PM to walk through the cache keys.",
    keyChunks: [{ chunk: "finalized the migration script", meaning: "đã hoàn tất script migration" }, { chunk: "pair with", meaning: "làm việc cặp (pair) với" }, { chunk: "cache integration", meaning: "tích hợp cache" }, { chunk: "user permissions", meaning: "quyền của người dùng" }],
    intonation: "Yesterday I finalized the migration script for user permissions ↗, and today I'm planning to pair with Alex ↗ on the Redis cache integration ↘.",
    keyPhrases: ["finalized the migration script", "pair with", "cache integration", "user permissions"],
    alternatives: [
      "I wrapped up the permissions migration yesterday, and today I'll sync with Alex to hook up Redis.",
      "Yesterday's migration work is complete; today Alex and I will collaborate on caching."
    ],
    interviewTip: "Cụm 'pair with someone' thể hiện tinh thần teamwork và văn hóa chia sẻ kiến thức (knowledge sharing) được đánh giá rất cao.",
    difficulty: "B1"
  },
  {
    id: 'standup-03',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    sentence: "I'm on track with the payment webhook refactor and expect to open a draft pull request by end of day.",
    english: "I'm on track with the payment webhook refactor and expect to open a draft pull request by end of day.",
    ipa: "/aɪm ɒn træk wɪð ðə ˈpeɪmənt ˈwɛbhʊk ˌriːˈfæktər ænd ɪkˈspɛkt tuː ˈoʊpən ə dræft pʊl rɪˈkwɛst baɪ ɛnd ʌv deɪ/",
    stressGuide: "Nhấn mạnh: ON TRACK, PAYMENT WEBHOOK, REFACTOR, DRAFT PULL REQUEST, END OF DAY.",
    meaningVi: "Mình đang đúng tiến độ với phần refactor payment webhook và dự kiến sẽ mở một draft PR vào cuối ngày hôm nay.",
    vietnamese: "Mình đang đúng tiến độ với phần refactor payment webhook và dự kiến sẽ mở một draft PR vào cuối ngày hôm nay.",
    nuanceVi: "'On track' khẳng định không có độ trễ; 'draft pull request' thông báo sớm để đồng đội có thể xem trước kiến trúc mà chưa cần merge.",
    insteadOf: "My task is going well, maybe PR tonight.",
    contextTitle: "Thông báo tiến độ đúng hạn và lộ trình nộp PR",
    context: "Thông báo tiến độ đúng hạn và lộ trình nộp PR",
    dialogue: "Tech Lead: 'How is the webhook refactoring coming along?' - Dev: 'I'm on track with the payment webhook refactor and expect to open a draft pull request by end of day.'",
    exampleResponse: "Great, tag me as a reviewer once it's up so I can check the signature validation.",
    keyChunks: [{ chunk: "on track with", meaning: "đang đúng tiến độ với" }, { chunk: "payment webhook refactor", meaning: "refactor webhook thanh toán" }, { chunk: "open a draft pull request", meaning: "mở một pull request nháp" }, { chunk: "by end of day", meaning: "trước cuối ngày" }],
    intonation: "I'm on track with the payment webhook refactor ↗ and expect to open a draft pull request ↗ by end of day ↘.",
    keyPhrases: ["on track with", "payment webhook refactor", "open a draft pull request", "by end of day"],
    alternatives: [
      "Payment webhook refactoring is progressing smoothly; I should have a PR ready for review by 5 PM.",
      "Everything is on schedule for webhooks; look out for a draft PR later this afternoon."
    ],
    interviewTip: "'By end of day' (EOD) và 'on track' là những cụm chuẩn Agile quốc tế, giúp người nghe có kỳ vọng rõ ràng về thời điểm nhận bàn giao.",
    difficulty: "B1"
  },
  {
    id: 'standup-04',
    category: 'standup',
    categoryLabel: 'Daily Standup',
    sentence: "I ran into an unexpected edge case with concurrent database writes, so I'll need a quick five-minute sync with the database administrator.",
    english: "I ran into an unexpected edge case with concurrent database writes, so I'll need a quick five-minute sync with the database administrator.",
    ipa: "/aɪ ræn ˈɪntuː ən ˌʌnɪkˈspɛktɪd ɛdʒ keɪs wɪð kənˈkɜːrənt ˈdeɪtəbeɪs raɪts, soʊ aɪl niːd ə kwɪk faɪv ˈmɪnɪt sɪŋk wɪð ðə ˈdeɪtəbeɪs ədˈmɪnɪstreɪtər/",
    stressGuide: "Nhấn mạnh: RAN INTO, UNEXPECTED EDGE CASE, CONCURRENT WRITES, FIVE-MINUTE SYNC, DBA.",
    meaningVi: "Mình vừa gặp phải một edge case bất ngờ liên quan đến việc ghi đồng thời vào database, nên mình cần một cuộc trao đổi ngắn 5 phút với DBA.",
    vietnamese: "Mình vừa gặp phải một edge case bất ngờ liên quan đến việc ghi đồng thời vào database, nên mình cần một cuộc trao đổi ngắn 5 phút với DBA.",
    nuanceVi: "'Ran into an edge case' diễn tả sự cố kỹ thuật chuyên sâu thay vì nói chung chung là 'có lỗi'. 'Quick five-minute sync' tôn trọng thời gian của đồng nghiệp.",
    insteadOf: "I have a bug with database, I need to talk to DBA.",
    contextTitle: "Kêu gọi hỗ trợ kỹ thuật chuyên môn sau standup",
    context: "Kêu gọi hỗ trợ kỹ thuật chuyên môn sau standup",
    dialogue: "Dev: 'I ran into an unexpected edge case with concurrent database writes, so I'll need a quick five-minute sync with the database administrator.' - DBA: 'Sure thing, let's stay on this call right after standup concludes.'",
    exampleResponse: "Sure thing, let's stay on this call right after standup concludes.",
    keyChunks: [{ chunk: "ran into an unexpected edge case", meaning: "gặp một trường hợp biên bất ngờ" }, { chunk: "concurrent database writes", meaning: "ghi đồng thời vào cơ sở dữ liệu" }, { chunk: "quick five-minute sync", meaning: "buổi đồng bộ nhanh năm phút" }],
    intonation: "I ran into an unexpected edge case with concurrent database writes ↗, so I'll need a quick five-minute sync ↗ with the database administrator ↘.",
    keyPhrases: ["ran into an unexpected edge case", "concurrent database writes", "quick five-minute sync"],
    alternatives: [
      "I hit a race condition during concurrent writes, so I'd appreciate a quick huddle with our DBA.",
      "An unexpected edge case popped up around database locks; can we sync for 5 minutes offline?"
    ],
    interviewTip: "Nhấn mạnh 'edge case' và 'concurrent writes' chứng tỏ bạn có tư duy sâu về tính toàn vẹn dữ liệu (data consistency) và concurrency control.",
    difficulty: "B2"
  },

  // ---------------------------------------------------------------------------
  // 2. CODEREVIEW (Code Review & PR)
  // ---------------------------------------------------------------------------
  {
    id: 'codereview-01',
    category: 'codereview',
    categoryLabel: 'Code Review & PR',
    sentence: "Could we extract this repetitive validation logic into a reusable middleware to keep the controller thin and clean?",
    english: "Could we extract this repetitive validation logic into a reusable middleware to keep the controller thin and clean?",
    ipa: "/kʊd wiː ɪkˈstrækt ðɪs rɪˈpɛtətɪv ˌvælɪˈdeɪʃən ˈlɒdʒɪk ˈɪntuː ə riːˈjuːzəbəl ˈmɪdəlˌwɛər tuː kiːp ðə kənˈtroʊlər θɪn ænd kliːn/",
    stressGuide: "Nhấn mạnh: EXTRACT, REPETITIVE VALIDATION, REUSABLE MIDDLEWARE, CONTROLLER THIN AND CLEAN.",
    meaningVi: "Liệu chúng ta có thể tách đoạn logic kiểm tra hợp lệ bị lặp lại này thành một middleware tái sử dụng để giữ controller gọn gàng và tinh gọn không?",
    vietnamese: "Liệu chúng ta có thể tách đoạn logic kiểm tra hợp lệ bị lặp lại này thành một middleware tái sử dụng để giữ controller gọn gàng và tinh gọn không?",
    nuanceVi: "Dùng câu hỏi mở 'Could we...' thể hiện sự lịch thiệp, tôn trọng người viết PR thay vì ra lệnh áp đặt 'Extract this now'.",
    insteadOf: "This code is duplicated, change it to middleware immediately.",
    contextTitle: "Góp ý refactor cấu trúc mã nguồn trong PR",
    context: "Góp ý refactor cấu trúc mã nguồn trong PR",
    dialogue: "Reviewer: 'Could we extract this repetitive validation logic into a reusable middleware to keep the controller thin and clean?' - Author: 'Good catch! I was hesitating on that; I will refactor it into an auth middleware.'",
    exampleResponse: "Good catch! I will refactor it into an auth middleware right away.",
    keyChunks: [{ chunk: "extract into", meaning: "tách ra thành" }, { chunk: "reusable middleware", meaning: "middleware tái sử dụng được" }, { chunk: "keep the controller thin", meaning: "giữ controller mỏng" }, { chunk: "validation logic", meaning: "logic kiểm tra dữ liệu (validation)" }],
    intonation: "Could we extract this repetitive validation logic ↗ into a reusable middleware ↗ to keep the controller thin and clean ↗?",
    keyPhrases: ["extract into", "reusable middleware", "keep the controller thin", "validation logic"],
    alternatives: [
      "Would it make sense to move this validation check into a shared middleware for consistency?",
      "To avoid duplication across handlers, how about pulling this out into a dedicated middleware?"
    ],
    interviewTip: "Khái niệm 'Thin Controller, Fat Model/Service' là best practice thiết kế phần mềm kinh điển, giúp ghi điểm trong phỏng vấn system design.",
    difficulty: "B2"
  },
  {
    id: 'codereview-02',
    category: 'codereview',
    categoryLabel: 'Code Review & PR',
    sentence: "I noticed this database query executes inside a loop, which might introduce an N+1 performance bottleneck under production load.",
    english: "I noticed this database query executes inside a loop, which might introduce an N+1 performance bottleneck under production load.",
    ipa: "/aɪ ˈnoʊtɪst ðɪs ˈdeɪtəbeɪs ˈkwɪəri ˈɛksɪˌkjuːts ɪnˈsaɪd ə luːp, wɪtʃ maɪt ˌɪntrəˈdjuːs ən ɛn plʌs wʌn pərˈfɔːrməns ˈbɒtəlnɛk ˈʌndər prəˈdʌkʃən loʊd/",
    stressGuide: "Nhấn mạnh: NOTICED, EXECUTES INSIDE A LOOP, N+1 PERFORMANCE BOTTLENECK, PRODUCTION LOAD.",
    meaningVi: "Mình nhận thấy câu truy vấn database này đang chạy trong vòng lặp, điều này có thể gây ra hiện tượng nút thắt cổ chai N+1 query khi chịu tải trên production.",
    vietnamese: "Mình nhận thấy câu truy vấn database này đang chạy trong vòng lặp, điều này có thể gây ra hiện tượng nút thắt cổ chai N+1 query khi chịu tải trên production.",
    nuanceVi: "'I noticed...' tạo cảm giác khiêm tốn; chỉ ra chính xác vấn đề thuật toán / DB (N+1 query problem) và cảnh báo nguy cơ tải cao.",
    insteadOf: "You wrote an N+1 bug. This is very slow.",
    contextTitle: "Cảnh báo lỗi hiệu năng truy vấn cơ sở dữ liệu trong PR",
    context: "Cảnh báo lỗi hiệu năng truy vấn cơ sở dữ liệu trong PR",
    dialogue: "Reviewer: 'I noticed this database query executes inside a loop, which might introduce an N+1 performance bottleneck under production load.' - Author: 'Thanks for spotting that! I will batch the IDs and use a single WHERE IN query.'",
    exampleResponse: "Thanks for spotting that! I will batch the IDs and use a single WHERE IN query.",
    keyChunks: [{ chunk: "executes inside a loop", meaning: "chạy bên trong vòng lặp" }, { chunk: "N+1 performance bottleneck", meaning: "nút thắt hiệu năng N+1" }, { chunk: "under production load", meaning: "dưới tải production" }, { chunk: "batch query", meaning: "truy vấn theo lô (batch)" }],
    intonation: "I noticed this database query executes inside a loop ↗, which might introduce an N+1 performance bottleneck ↗ under production load ↘.",
    keyPhrases: ["executes inside a loop", "N+1 performance bottleneck", "under production load", "batch query"],
    alternatives: [
      "This looks like an N+1 query issue inside the loop; could we eagerly load the relationship instead?",
      "Querying the database on each iteration could degrade performance; let's batch this lookup."
    ],
    interviewTip: "Lỗi N+1 query là một trong những câu hỏi phỏng vấn backend kinh điển nhất (ORM, SQL optimization, eager loading vs lazy loading).",
    difficulty: "B2"
  },
  {
    id: 'codereview-03',
    category: 'codereview',
    categoryLabel: 'Code Review & PR',
    sentence: "Nit: let's rename this variable to something more descriptive so it clearly conveys that it holds an epoch timestamp in milliseconds.",
    english: "Nit: let's rename this variable to something more descriptive so it clearly conveys that it holds an epoch timestamp in milliseconds.",
    ipa: "/nɪt: lɛts ˌriːˈneɪm ðɪs ˈvɛəriəbəl tuː ˈsʌmθɪŋ mɔːr dɪˈskrɪptɪv soʊ ɪt ˈklɪərli kənˈveɪz ðæt ɪt hoʊldz ən ˈiːpɒk ˈtaɪmˌstæmp ɪn ˈmɪlɪˌsɛkəndz/",
    stressGuide: "Nhấn mạnh: NIT, RENAME, DESCRIPTIVE, CLEARLY CONVEYS, EPOCH TIMESTAMP, MILLISECONDS.",
    meaningVi: "Góp ý nhỏ (Nitpick): hãy đổi tên biến này thành một tên rõ nghĩa hơn để thể hiện rõ nó đang chứa timestamp epoch tính bằng mili-giây.",
    vietnamese: "Góp ý nhỏ (Nitpick): hãy đổi tên biến này thành một tên rõ nghĩa hơn để thể hiện rõ nó đang chứa timestamp epoch tính bằng mili-giây.",
    nuanceVi: "'Nit' là thuật ngữ tiêu chuẩn trong Code Review chỉ góp ý nhỏ, mang tính thẩm mỹ/clean code, không chặn PR được merge.",
    insteadOf: "Change the variable name. It is confusing.",
    contextTitle: "Góp ý nhỏ về tính tường minh và Clean Code",
    context: "Góp ý nhỏ về tính tường minh và Clean Code",
    dialogue: "Reviewer: 'Nit: let's rename this variable to something more descriptive so it clearly conveys that it holds an epoch timestamp in milliseconds.' - Author: 'Renamed from t to createdAtMs. Pushed!'",
    exampleResponse: "Renamed from t to createdAtMs. Pushed!",
    keyChunks: [{ chunk: "nit", meaning: "góp ý nhỏ (nit)" }, { chunk: "rename this variable", meaning: "đổi tên biến này" }, { chunk: "more descriptive", meaning: "mô tả rõ nghĩa hơn" }, { chunk: "epoch timestamp in milliseconds", meaning: "mốc thời gian epoch tính bằng mili giây" }],
    intonation: "Nit: let's rename this variable ↗ to something more descriptive ↗ so it clearly conveys that it holds an epoch timestamp in milliseconds ↘.",
    keyPhrases: ["nit", "rename this variable", "more descriptive", "epoch timestamp in milliseconds"],
    alternatives: [
      "Small nit: renaming this to `expiresAtMs` would make its unit and purpose crystal clear.",
      "Non-blocking nit: consider appending `Ms` to the name so callers know it's in milliseconds."
    ],
    interviewTip: "Biết sử dụng tiền tố 'Nit:' chứng tỏ bạn hiểu văn hóa review mã nguồn hiện đại tại các công ty công nghệ đa quốc gia.",
    difficulty: "B1"
  },

  // ---------------------------------------------------------------------------
  // 3. ARCHITECTURE (System & Architecture)
  // ---------------------------------------------------------------------------
  {
    id: 'architecture-01',
    category: 'architecture',
    categoryLabel: 'System & Architecture',
    sentence: "To ensure horizontal scalability and prevent memory leaks, we should decouple session state from the application server and store it in Redis.",
    english: "To ensure horizontal scalability and prevent memory leaks, we should decouple session state from the application server and store it in Redis.",
    ipa: "/tuː ɪnˈʃʊər ˌhɒrɪˈzɒntəl ˌskeɪləˈbɪləti ænd prɪˈvɛnt ˈmɛməri liːks, wiː ʃʊd diːˈkʌpəl ˈsɛʃən steɪt frɒm ði ˌæplɪˈkeɪʃən ˈsɜːrvər ænd stɔːr ɪt ɪn ˈrɛdɪs/",
    stressGuide: "Nhấn mạnh: HORIZONTAL SCALABILITY, PREVENT MEMORY LEAKS, DECOUPLE, SESSION STATE, REDIS.",
    meaningVi: "Để đảm bảo khả năng mở rộng quy mô theo chiều ngang và ngăn ngừa rò rỉ bộ nhớ, chúng ta nên tách rời trạng thái phiên làm việc khỏi app server và lưu vào Redis.",
    vietnamese: "Để đảm bảo khả năng mở rộng quy mô theo chiều ngang và ngăn ngừa rò rỉ bộ nhớ, chúng ta nên tách rời trạng thái phiên làm việc khỏi app server và lưu vào Redis.",
    nuanceVi: "Lối diễn đạt chuẩn Senior / Solution Architect: nêu lý do mục đích trước ('To ensure...'), sau đó đề xuất giải pháp kỹ thuật cụ thể.",
    insteadOf: "We must use Redis for session because servers cannot scale.",
    contextTitle: "Thuyết trình phương án thiết kế hệ thống Stateless",
    context: "Thuyết trình phương án thiết kế hệ thống Stateless",
    dialogue: "Principal Engineer: 'How do we handle sessions when auto-scaling kicks in?' - Architect: 'To ensure horizontal scalability and prevent memory leaks, we should decouple session state from the application server and store it in Redis.'",
    exampleResponse: "Agreed. Keeping the app servers stateless will make rolling deployments much safer.",
    keyChunks: [{ chunk: "horizontal scalability", meaning: "khả năng mở rộng theo chiều ngang" }, { chunk: "prevent memory leaks", meaning: "ngăn rò rỉ bộ nhớ" }, { chunk: "decouple session state", meaning: "tách rời trạng thái phiên" }, { chunk: "stateless architecture", meaning: "kiến trúc stateless (phi trạng thái)" }],
    intonation: "To ensure horizontal scalability and prevent memory leaks ↗, we should decouple session state from the application server ↗ and store it in Redis ↘.",
    keyPhrases: ["horizontal scalability", "prevent memory leaks", "decouple session state", "stateless architecture"],
    alternatives: [
      "By externalizing session storage into Redis, our web nodes can remain truly stateless and scale on demand.",
      "Decoupling sessions from server memory enables seamless horizontal scaling across Kubernetes pods."
    ],
    interviewTip: "'Stateless architecture' và 'horizontal scaling' là tiêu chuẩn vàng trong mọi bài phỏng vấn System Design cấp bậc Senior/Staff.",
    difficulty: "C1"
  },
  {
    id: 'architecture-02',
    category: 'architecture',
    categoryLabel: 'System & Architecture',
    sentence: "Given the read-heavy nature of our catalog service, implementing an asynchronous cache-aside pattern with read replicas will significantly reduce database strain.",
    english: "Given the read-heavy nature of our catalog service, implementing an asynchronous cache-aside pattern with read replicas will significantly reduce database strain.",
    ipa: "/ˈɡɪvən ðə riːd ˈhɛvi ˈneɪtʃər ʌv ˈaʊər ˈkætəlɒɡ ˈsɜːrvɪs, ˌɪmplɪˈmɛntɪŋ ən eɪˈsɪŋkrənəs kæʃ əˈsaɪd ˈpætərn wɪð riːd ˈrɛplɪkəz wɪl sɪɡˈnɪfɪkəntli rɪˈdjuːs ˈdeɪtəbeɪs streɪn/",
    stressGuide: "Nhấn mạnh: READ-HEAVY NATURE, CACHE-ASIDE PATTERN, READ REPLICAS, REDUCE DATABASE STRAIN.",
    meaningVi: "Xét đến bản chất phần lớn là đọc của dịch vụ danh mục sản phẩm, việc triển khai mẫu cache-aside bất đồng bộ kèm read replicas sẽ giảm tải đáng kể cho database.",
    vietnamese: "Xét đến bản chất phần lớn là đọc của dịch vụ danh mục sản phẩm, việc triển khai mẫu cache-aside bất đồng bộ kèm read replicas sẽ giảm tải đáng kể cho database.",
    nuanceVi: "'Given...' là mệnh đề mở đầu chuyên nghiệp để xác định bối cảnh đặc thù của hệ thống trước khi đưa ra kiến trúc tối ưu.",
    insteadOf: "Our app reads a lot, so use cache and replicas to help database.",
    contextTitle: "Đề xuất chiến lược tối ưu tải đọc (Read-Heavy Strategy)",
    context: "Đề xuất chiến lược tối ưu tải đọc (Read-Heavy Strategy)",
    dialogue: "Interviewer: 'How would you scale a product catalog with 100k reads per second?' - Candidate: 'Given the read-heavy nature of our catalog service, implementing an asynchronous cache-aside pattern with read replicas will significantly reduce database strain.'",
    exampleResponse: "Excellent choice. How would you handle cache invalidation on price updates?",
    keyChunks: [{ chunk: "read-heavy nature", meaning: "đặc thù thiên về đọc" }, { chunk: "cache-aside pattern", meaning: "mẫu cache-aside" }, { chunk: "read replicas", meaning: "bản sao chỉ đọc (read replica)" }, { chunk: "reduce database strain", meaning: "giảm áp lực lên cơ sở dữ liệu" }],
    intonation: "Given the read-heavy nature of our catalog service ↗, implementing an asynchronous cache-aside pattern with read replicas ↗ will significantly reduce database strain ↘.",
    keyPhrases: ["read-heavy nature", "cache-aside pattern", "read replicas", "reduce database strain"],
    alternatives: [
      "Since our access pattern is predominantly reads, introducing a cache-aside layer with replicas is our best bet.",
      "Offloading reads to replicas and Redis using a cache-aside strategy will safeguard our primary database."
    ],
    interviewTip: "Luôn phân biệt 'read-heavy' vs 'write-heavy' ngay từ đầu khi trả lời các câu hỏi thiết kế hệ thống lớn.",
    difficulty: "C1"
  },
  {
    id: 'architecture-03',
    category: 'architecture',
    categoryLabel: 'System & Architecture',
    sentence: "We decided to adopt an event-driven architecture with Apache Kafka so microservices can communicate asynchronously without tight coupling.",
    english: "We decided to adopt an event-driven architecture with Apache Kafka so microservices can communicate asynchronously without tight coupling.",
    ipa: "/wiː dɪˈsaɪdɪd tuː əˈdɒpt ən ɪˈvɛnt ˈdrɪvən ˌɑːrkɪˈtɛktʃər wɪð əˈpætʃi ˈkɑːfkə soʊ ˈmaɪkroʊˌsɜːrvɪsɪz kæn kəˈmjuːnɪˌkeɪt eɪˈsɪŋkrənəsli wɪðˈaʊt taɪt ˈkʌplɪŋ/",
    stressGuide: "Nhấn mạnh: EVENT-DRIVEN ARCHITECTURE, KAFKA, ASYNCHRONOUSLY, WITHOUT TIGHT COUPLING.",
    meaningVi: "Chúng tôi đã quyết định áp dụng kiến trúc hướng sự kiện với Apache Kafka để các microservice có thể giao tiếp bất đồng bộ mà không bị phụ thuộc ràng buộc lẫn nhau.",
    vietnamese: "Chúng tôi đã quyết định áp dụng kiến trúc hướng sự kiện với Apache Kafka để các microservice có thể giao tiếp bất đồng bộ mà không bị phụ thuộc ràng buộc lẫn nhau.",
    nuanceVi: "'Without tight coupling' là giá trị cốt lõi giải thích vì sao chọn Event-driven thay vì REST API đồng bộ thông thường.",
    insteadOf: "We use Kafka because microservices should not call each other directly.",
    contextTitle: "Bảo vệ quyết định kiến trúc Event-Driven",
    context: "Bảo vệ quyết định kiến trúc Event-Driven",
    dialogue: "Product Lead: 'Why can't the order service just call the email service via HTTP?' - Architect: 'We decided to adopt an event-driven architecture with Apache Kafka so microservices can communicate asynchronously without tight coupling.'",
    exampleResponse: "That makes sense; if the email service goes down, orders will still process smoothly.",
    keyChunks: [{ chunk: "event-driven architecture", meaning: "kiến trúc hướng sự kiện" }, { chunk: "communicate asynchronously", meaning: "giao tiếp bất đồng bộ" }, { chunk: "without tight coupling", meaning: "không bị ràng buộc chặt" }, { chunk: "message broker", meaning: "bộ trung chuyển thông điệp (message broker)" }],
    intonation: "We decided to adopt an event-driven architecture with Apache Kafka ↗ so microservices can communicate asynchronously ↗ without tight coupling ↘.",
    keyPhrases: ["event-driven architecture", "communicate asynchronously", "without tight coupling", "message broker"],
    alternatives: [
      "Transitioning to an event-driven model decouples our microservices and provides backpressure resilience.",
      "By publishing events to Kafka asynchronously, downstream failures will never block our critical checkout path."
    ],
    interviewTip: "Nhấn mạnh lợi ích cô lập lỗi (fault isolation) và khả năng đệm hàng đợi (backpressure handling) khi bàn về Kafka.",
    difficulty: "B2"
  },

  // ---------------------------------------------------------------------------
  // 4. INCIDENT (Incident & Debugging)
  // ---------------------------------------------------------------------------
  {
    id: 'incident-01',
    category: 'incident',
    categoryLabel: 'Incident & Debugging',
    sentence: "We've detected a sudden spike in 502 bad gateway errors on the production cluster and are currently rolling back the latest deployment.",
    english: "We've detected a sudden spike in 502 bad gateway errors on the production cluster and are currently rolling back the latest deployment.",
    ipa: "/wiːv dɪˈtɛktɪd ə ˈsʌdən spaɪk ɪn faɪv oʊ tuː bæd ˈɡeɪtweɪ ˈɛrərz ɒn ðə prəˈdʌkʃən ˈklʌstər ænd ɑːr ˈkɜːrəntli ˈroʊlɪŋ bæk ðə ˈleɪtɪst dɪˈplɔɪmənt/",
    stressGuide: "Nhấn mạnh: DETECTED, SUDDEN SPIKE, 502 BAD GATEWAY, ROLLING BACK, LATEST DEPLOYMENT.",
    meaningVi: "Chúng tôi phát hiện lượng lỗi 502 Bad Gateway tăng đột biến trên production cluster và hiện đang tiến hành rollback bản deploy gần nhất.",
    vietnamese: "Chúng tôi phát hiện lượng lỗi 502 Bad Gateway tăng đột biến trên production cluster và hiện đang tiến hành rollback bản deploy gần nhất.",
    nuanceVi: "Báo cáo sự cố khẩn cấp: ngắn gọn, chỉ rõ triệu chứng (spike in 502) và biện pháp giảm thiểu tức thì đang thực hiện (rolling back).",
    insteadOf: "Production is broken with 502 errors, we are undoing deploy.",
    contextTitle: "Thông báo phản ứng sự cố sản xuất (War Room / Alert)",
    context: "Thông báo phản ứng sự cố sản xuất (War Room / Alert)",
    dialogue: "Incident Commander: 'Status check on prod alert?' - On-Call: 'We've detected a sudden spike in 502 bad gateway errors on the production cluster and are currently rolling back the latest deployment.'",
    exampleResponse: "Understood. Keep the incident channel posted as soon as the rollback finishes.",
    keyChunks: [{ chunk: "sudden spike in 502 errors", meaning: "tăng đột biến lỗi 502" }, { chunk: "production cluster", meaning: "cụm production" }, { chunk: "rolling back the latest deployment", meaning: "đang rollback bản triển khai mới nhất" }],
    intonation: "We've detected a sudden spike in 502 bad gateway errors ↗ on the production cluster ↗ and are currently rolling back the latest deployment ↘.",
    keyPhrases: ["sudden spike in 502 errors", "production cluster", "rolling back the latest deployment"],
    alternatives: [
      "Alerts fired for 502 errors post-release; we are initiating an immediate rollback to the previous stable build.",
      "We observed an elevated rate of bad gateways; rolling back the release while investigating logs."
    ],
    interviewTip: "Trong quản lý sự cố, nguyên tắc số 1 là khôi phục dịch vụ cho khách hàng trước (mitigate first), điều tra nguyên nhân sâu xa sau (root cause later).",
    difficulty: "B2"
  },
  {
    id: 'incident-02',
    category: 'incident',
    categoryLabel: 'Incident & Debugging',
    sentence: "The root cause was connection pool exhaustion caused by an unindexed query during peak traffic; we've increased pool capacity as an immediate mitigation.",
    english: "The root cause was connection pool exhaustion caused by an unindexed query during peak traffic; we've increased pool capacity as an immediate mitigation.",
    ipa: "/ðə ruːt kɔːz wɒz kəˈnɛkʃən puːl ɪɡˈzɔːstʃən kɔːzd baɪ ən ʌnˈɪndɛkst ˈkwɪəri ˈdjʊərɪŋ piːk ˈtræfɪk; wiːv ɪnˈkriːst puːl kəˈpæsəti æz ən ɪˈmiːdiət ˌmɪtɪˈɡeɪʃən/",
    stressGuide: "Nhấn mạnh: ROOT CAUSE, CONNECTION POOL EXHAUSTION, UNINDEXED QUERY, PEAK TRAFFIC, IMMEDIATE MITIGATION.",
    meaningVi: "Nguyên nhân gốc rễ là cạn kiệt connection pool do một câu truy vấn thiếu index chạy vào giờ cao điểm; chúng tôi đã nâng dung lượng pool làm giải pháp xử lý tạm thời.",
    vietnamese: "Nguyên nhân gốc rễ là cạn kiệt connection pool do một câu truy vấn thiếu index chạy vào giờ cao điểm; chúng tôi đã nâng dung lượng pool làm giải pháp xử lý tạm thời.",
    nuanceVi: "Phân biệt rõ ràng giữa 'root cause' (bản chất thật) và 'immediate mitigation' (giải pháp dập lửa trước mắt).",
    insteadOf: "The error happened because db connections died. We made more connections.",
    contextTitle: "Trình bày phân tích nguyên nhân gốc rễ (Post-Mortem)",
    context: "Trình bày phân tích nguyên nhân gốc rễ (Post-Mortem)",
    dialogue: "CTO: 'What took the API down during flash sale?' - Lead: 'The root cause was connection pool exhaustion caused by an unindexed query during peak traffic; we've increased pool capacity as an immediate mitigation.'",
    exampleResponse: "Good analysis. Let's make sure the database index is applied and tested by tomorrow morning.",
    keyChunks: [{ chunk: "root cause", meaning: "nguyên nhân gốc" }, { chunk: "connection pool exhaustion", meaning: "cạn kiệt connection pool" }, { chunk: "unindexed query", meaning: "truy vấn thiếu index" }, { chunk: "immediate mitigation", meaning: "biện pháp giảm thiểu tức thời" }],
    intonation: "The root cause was connection pool exhaustion ↗ caused by an unindexed query during peak traffic ↗; we've increased pool capacity as an immediate mitigation ↘.",
    keyPhrases: ["root cause", "connection pool exhaustion", "unindexed query", "immediate mitigation"],
    alternatives: [
      "A missing index exhausted our database pool under load; we patched pool limits and are indexing the table.",
      "The outage stemmed from pool saturation triggered by a slow table scan; pool resize provided temporary relief."
    ],
    interviewTip: "Phỏng vấn cấp cao luôn hỏi: 'Tell me about a difficult bug or outage you resolved'. Cấu trúc: Trigger -> Root Cause -> Immediate Mitigation -> Permanent Fix.",
    difficulty: "C1"
  },
  {
    id: 'incident-03',
    category: 'incident',
    categoryLabel: 'Incident & Debugging',
    sentence: "I'm initiating the incident response bridge, and I'll post status updates in the incident Slack channel every fifteen minutes until the service is fully restored.",
    english: "I'm initiating the incident response bridge, and I'll post status updates in the incident Slack channel every fifteen minutes until the service is fully restored.",
    ipa: "/aɪm ɪˈnɪʃiˌeɪtɪŋ ði ˈɪnsɪdənt rɪˈspɒns brɪdʒ, ænd aɪl poʊst ˈsteɪtəs ˈʌpdeɪts ɪn ði ˈɪnsɪdənt slæk ˈtʃænəl ˈɛvri ˌfɪfˈtiːn ˈmɪnɪts ənˈtɪl ðə ˈsɜːrvɪs ɪz ˈfʊli rɪˈstɔːrd/",
    stressGuide: "Nhấn mạnh: INITIATING, INCIDENT RESPONSE BRIDGE, STATUS UPDATES, EVERY FIFTEEN MINUTES, FULLY RESTORED.",
    meaningVi: "Tôi đang mở phòng họp khẩn cấp xử lý sự cố (incident bridge), và tôi sẽ cập nhật tình hình trong kênh Slack sự cố mỗi 15 phút cho đến khi dịch vụ được phục hồi hoàn toàn.",
    vietnamese: "Tôi đang mở phòng họp khẩn cấp xử lý sự cố (incident bridge), và tôi sẽ cập nhật tình hình trong kênh Slack sự cố mỗi 15 phút cho đến khi dịch vụ được phục hồi hoàn toàn.",
    nuanceVi: "Cam kết tần suất cập nhật rõ ràng ('every fifteen minutes') giúp ban lãnh đạo và các bên liên quan yên tâm, tránh bị hỏi dồn dập trong lúc tập trung fix lỗi.",
    insteadOf: "I open a call now and will chat in Slack later.",
    contextTitle: "Điều phối thông tin liên lạc trong sự cố nghiêm trọng",
    context: "Điều phối thông tin liên lạc trong sự cố nghiêm trọng",
    dialogue: "Operations Manager: 'Who is leading communication for P1?' - Dev: 'I'm initiating the incident response bridge, and I'll post status updates in the incident Slack channel every fifteen minutes until the service is fully restored.'",
    exampleResponse: "Thank you. I will notify customer support to hold off on public announcements for now.",
    keyChunks: [{ chunk: "incident response bridge", meaning: "phòng họp xử lý sự cố" }, { chunk: "status updates", meaning: "cập nhật trạng thái" }, { chunk: "every fifteen minutes", meaning: "mỗi mười lăm phút" }, { chunk: "fully restored", meaning: "được khôi phục hoàn toàn" }],
    intonation: "I'm initiating the incident response bridge ↗, and I'll post status updates in the incident Slack channel every fifteen minutes ↗ until the service is fully restored ↘.",
    keyPhrases: ["incident response bridge", "status updates", "every fifteen minutes", "fully restored"],
    alternatives: [
      "I've spun up an incident bridge call; regular cadence updates will follow in #incident-prod every 15 mins.",
      "Taking ownership of communications: updates will drop in Slack twice an hour until resolution."
    ],
    interviewTip: "Nhà tuyển dụng rất thích ứng viên có tư duy 'Incident Commander' - kiểm soát tốt cả kỹ thuật lẫn luồng thông tin liên lạc với stakeholder.",
    difficulty: "B2"
  },

  // ---------------------------------------------------------------------------
  // 5. INTERVIEW (Technical Interview & Behavioral)
  // ---------------------------------------------------------------------------
  {
    id: 'interview-01',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    sentence: "In my previous role, I led the database sharding initiative which reduced p99 query latency by forty percent during our Black Friday surge.",
    english: "In my previous role, I led the database sharding initiative which reduced p99 query latency by forty percent during our Black Friday surge.",
    ipa: "/ɪn maɪ ˈpriːviəs roʊl, aɪ lɛd ðə ˈdeɪtəbeɪs ˈʃɑːrdɪŋ ɪˈnɪʃətɪv wɪtʃ rɪˈdjuːst piː ˈnaɪnti naɪn ˈkwɪəri ˈleɪtənsi baɪ ˈfɔːrti pərˈsɛnt ˈdjʊərɪŋ ˈaʊər blæk ˈfraɪdeɪ sɜːrdʒ/",
    stressGuide: "Nhấn mạnh: PREVIOUS ROLE, LED, DATABASE SHARDING, REDUCED P99 LATENCY, FORTY PERCENT, SURGE.",
    meaningVi: "Ở vị trí trước đây, tôi đã dẫn dắt sáng kiến sharding cơ sở dữ liệu, giúp giảm 40% độ trễ truy vấn p99 trong đợt cao điểm mua sắm Black Friday.",
    vietnamese: "Ở vị trí trước đây, tôi đã dẫn dắt sáng kiến sharding cơ sở dữ liệu, giúp giảm 40% độ trễ truy vấn p99 trong đợt cao điểm mua sắm Black Friday.",
    nuanceVi: "Áp dụng phương pháp STAR kinh điển: Có Action ('led database sharding') và Result có số liệu định lượng ấn tượng ('reduced p99 latency by 40%').",
    insteadOf: "I worked on database sharding and made the system faster.",
    contextTitle: "Trả lời câu hỏi phỏng vấn hành vi về thành tựu nổi bật (Behavioral STAR)",
    context: "Trả lời câu hỏi phỏng vấn hành vi về thành tựu nổi bật (Behavioral STAR)",
    dialogue: "Interviewer: 'Can you share your proudest technical achievement?' - Candidate: 'In my previous role, I led the database sharding initiative which reduced p99 query latency by forty percent during our Black Friday surge.'",
    exampleResponse: "That is impressive. How did you choose your partition key to prevent hotspotting?",
    keyChunks: [{ chunk: "led the database sharding initiative", meaning: "dẫn dắt dự án sharding cơ sở dữ liệu" }, { chunk: "reduced p99 query latency", meaning: "giảm độ trễ truy vấn p99" }, { chunk: "by forty percent", meaning: "giảm bốn mươi phần trăm" }, { chunk: "traffic surge", meaning: "đợt tăng đột biến lưu lượng" }],
    intonation: "In my previous role, I led the database sharding initiative ↗ which reduced p99 query latency by forty percent ↗ during our Black Friday surge ↘.",
    keyPhrases: ["led the database sharding initiative", "reduced p99 query latency", "by forty percent", "traffic surge"],
    alternatives: [
      "I spearheaded our database partitioning effort, cutting tail latency by 40% under peak holiday load.",
      "One notable milestone was architecting our sharded database layer, which dropped p99 times by 40%."
    ],
    interviewTip: "Luôn dùng số liệu cụ thể (40%, p99 latency) thay vì tính từ cảm tính (rất nhanh, tốt hơn). Số liệu tạo ra sự tin cậy tuyệt đối.",
    difficulty: "B2"
  },
  {
    id: 'interview-02',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    sentence: "When designing for high availability, I always evaluate single points of failure and ensure automatic failover with circuit breakers.",
    english: "When designing for high availability, I always evaluate single points of failure and ensure automatic failover with circuit breakers.",
    ipa: "/wɛn dɪˈzaɪnɪŋ fɔːr haɪ əˌveɪləˈbɪləti, aɪ ˈɔːlweɪz ɪˈvæljuˌeɪt ˈsɪŋɡəl pɔɪnts ʌv ˈfeɪljər ænd ɪnˈʃʊər ˌɔːtəˈmætɪk ˈfeɪlˌoʊvər wɪð ˈsɜːrkɪt ˈbreɪkərz/",
    stressGuide: "Nhấn mạnh: HIGH AVAILABILITY, SINGLE POINTS OF FAILURE, AUTOMATIC FAILOVER, CIRCUIT BREAKERS.",
    meaningVi: "Khi thiết kế cho độ sẵn sàng cao (HA), tôi luôn đánh giá các điểm chết duy nhất (SPOF) và đảm bảo cơ chế tự động chuyển vùng kèm circuit breaker.",
    vietnamese: "Khi thiết kế cho độ sẵn sàng cao (HA), tôi luôn đánh giá các điểm chết duy nhất (SPOF) và đảm bảo cơ chế tự động chuyển vùng kèm circuit breaker.",
    nuanceVi: "Sử dụng các thuật ngữ kiến trúc cốt lõi: SPOF (Single Point of Failure), Failover, Circuit Breaker Pattern thể hiện tư duy thiết kế hệ thống vững chắc.",
    insteadOf: "I make sure the system does not die by using backup servers.",
    contextTitle: "Nguyên lý thiết kế hệ thống sẵn sàng cao (System Design Philosophy)",
    context: "Nguyên lý thiết kế hệ thống sẵn sàng cao (System Design Philosophy)",
    dialogue: "Interviewer: 'How do you prevent cascading failures across services?' - Candidate: 'When designing for high availability, I always evaluate single points of failure and ensure automatic failover with circuit breakers.'",
    exampleResponse: "Great mindset. Which circuit breaker library or service mesh have you worked with?",
    keyChunks: [{ chunk: "high availability", meaning: "tính sẵn sàng cao" }, { chunk: "single points of failure", meaning: "điểm lỗi đơn (single point of failure)" }, { chunk: "automatic failover", meaning: "tự động chuyển đổi dự phòng (failover)" }, { chunk: "circuit breakers", meaning: "bộ ngắt mạch (circuit breaker)" }],
    intonation: "When designing for high availability ↗, I always evaluate single points of failure ↗ and ensure automatic failover with circuit breakers ↘.",
    keyPhrases: ["high availability", "single points of failure", "automatic failover", "circuit breakers"],
    alternatives: [
      "My approach to fault-tolerant design centers on eliminating SPOFs and isolating dependencies via circuit breakers.",
      "To safeguard uptime, I prioritize redundant paths, automated failover routines, and graceful degradation."
    ],
    interviewTip: "Nhắc đến 'circuit breaker' chứng tỏ bạn hiểu về phòng chống lỗi dây chuyền (cascading failure prevention) trong môi trường microservices.",
    difficulty: "B2"
  },
  {
    id: 'interview-03',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    sentence: "Whenever I encounter conflicting technical opinions within the team, I facilitate an objective proof-of-concept benchmark to let empirical data guide our decision.",
    english: "Whenever I encounter conflicting technical opinions within the team, I facilitate an objective proof-of-concept benchmark to let empirical data guide our decision.",
    ipa: "/wɛnˈɛvər aɪ ɪnˈkaʊntər kənˈflɪktɪŋ ˈtɛknɪkəl əˈpɪnjənz wɪðˈɪn ðə tiːm, aɪ fəˈsɪlɪteɪt ən əbˈdʒɛktɪv pruːf ʌv ˈkɒnsɛpt ˈbɛntʃmɑːrk tuː lɛt ɪmˈpɪrɪkəl ˈdeɪtə ɡaɪd ˈaʊər dɪˈsɪʒən/",
    stressGuide: "Nhấn mạnh: CONFLICTING OPINIONS, FACILITATE, PROOF-OF-CONCEPT, BENCHMARK, EMPIRICAL DATA.",
    meaningVi: "Bất cứ khi nào gặp bất đồng quan điểm kỹ thuật trong team, tôi sẽ chủ trì một bản benchmark thử nghiệm khách quan (PoC) để dữ liệu thực nghiệm định hướng quyết định.",
    vietnamese: "Bất cứ khi nào gặp bất đồng quan điểm kỹ thuật trong team, tôi sẽ chủ trì một bản benchmark thử nghiệm khách quan (PoC) để dữ liệu thực nghiệm định hướng quyết định.",
    nuanceVi: "Câu trả lời mẫu mực cho câu hỏi xử lý xung đột: không dùng cảm xúc hay chức vụ áp đặt mà dựa vào dữ liệu thực chứng (empirical data) và PoC.",
    insteadOf: "When we fight about technology, I test both to see which is better.",
    contextTitle: "Kỹ năng giải quyết xung đột kỹ thuật trong nhóm (Conflict Resolution)",
    context: "Kỹ năng giải quyết xung đột kỹ thuật trong nhóm (Conflict Resolution)",
    dialogue: "Interviewer: 'How do you handle disagreements on technical stack choices?' - Candidate: 'Whenever I encounter conflicting technical opinions within the team, I facilitate an objective proof-of-concept benchmark to let empirical data guide our decision.'",
    exampleResponse: "I love that data-driven approach. Can you walk me through a specific example?",
    keyChunks: [{ chunk: "conflicting technical opinions", meaning: "các quan điểm kỹ thuật mâu thuẫn" }, { chunk: "proof-of-concept benchmark", meaning: "benchmark thử nghiệm khả thi (PoC)" }, { chunk: "empirical data", meaning: "dữ liệu thực nghiệm" }, { chunk: "guide our decision", meaning: "định hướng quyết định của chúng ta" }],
    intonation: "Whenever I encounter conflicting technical opinions within the team ↗, I facilitate an objective proof-of-concept benchmark ↗ to let empirical data guide our decision ↘.",
    keyPhrases: ["conflicting technical opinions", "proof-of-concept benchmark", "empirical data", "guide our decision"],
    alternatives: [
      "In situations with divided technical views, I build small PoC prototypes so measurable metrics resolve the debate.",
      "I align teammates around facts by running standardized load tests on competing implementation options."
    ],
    interviewTip: "Cụm 'empirical data' (dữ liệu thực nghiệm) và 'facilitate' thể hiện tố chất lãnh đạo công nghệ (Tech Lead / Staff Engineer).",
    difficulty: "C1"
  },
  {
    id: 'interview-04',
    category: 'interview',
    categoryLabel: 'IT Technical Interview',
    sentence: "Could you elaborate on the expected read-to-write ratio and latency SLA so I can tailor the storage engine recommendation accordingly?",
    english: "Could you elaborate on the expected read-to-write ratio and latency SLA so I can tailor the storage engine recommendation accordingly?",
    ipa: "/kʊd juː ɪˈlæbəreɪt ɒn ði ɪkˈspɛktɪd riːd tuː raɪt ˈreɪʃioʊ ænd ˈleɪtənsi ɛs-ɛl-eɪ soʊ aɪ kæn ˈteɪlər ðə ˈstɔːrɪdʒ ˈɛndʒɪn ˌrɛkəmɛnˈdeɪʃən əˈkɔːrdɪŋli/",
    stressGuide: "Nhấn mạnh: ELABORATE, READ-TO-WRITE RATIO, LATENCY SLA, TAILOR, STORAGE ENGINE.",
    meaningVi: "Anh/chị có thể nói rõ hơn về tỉ lệ đọc-ghi dự kiến và cam kết SLA độ trễ để tôi có thể đề xuất giải pháp cơ sở dữ liệu phù hợp nhất không?",
    vietnamese: "Anh/chị có thể nói rõ hơn về tỉ lệ đọc-ghi dự kiến và cam kết SLA độ trễ để tôi có thể đề xuất giải pháp cơ sở dữ liệu phù hợp nhất không?",
    nuanceVi: "Kỹ năng đặt câu hỏi làm rõ đề bài (Clarifying Questions) trong phỏng vấn System Design - không vội lao vào giải ngay mà đào sâu yêu cầu phi chức năng.",
    insteadOf: "Tell me how many reads and writes before I choose DB.",
    contextTitle: "Đặt câu hỏi làm rõ yêu cầu phi chức năng (System Design Clarification)",
    context: "Đặt câu hỏi làm rõ yêu cầu phi chức năng (System Design Clarification)",
    dialogue: "Interviewer: 'Design a URL shortener like bit.ly.' - Candidate: 'Could you elaborate on the expected read-to-write ratio and latency SLA so I can tailor the storage engine recommendation accordingly?'",
    exampleResponse: "Sure, let's assume a 100 to 1 read-to-write ratio with a strict p99 read latency under 10ms.",
    keyChunks: [{ chunk: "elaborate on", meaning: "nói rõ thêm về" }, { chunk: "read-to-write ratio", meaning: "tỷ lệ đọc/ghi" }, { chunk: "latency SLA", meaning: "SLA về độ trễ" }, { chunk: "storage engine recommendation", meaning: "đề xuất công cụ lưu trữ (storage engine)" }],
    intonation: "Could you elaborate on the expected read-to-write ratio ↗ and latency SLA ↗ so I can tailor the storage engine recommendation accordingly ↘?",
    keyPhrases: ["elaborate on", "read-to-write ratio", "latency SLA", "storage engine recommendation"],
    alternatives: [
      "Before diving into schema design, what are our peak QPS targets and acceptable p99 latency boundaries?",
      "To pick between relational and NoSQL options, could you share the projected read versus write volume?"
    ],
    interviewTip: "Ứng viên biết hỏi về SLA, QPS và read/write ratio ngay những phút đầu tiên luôn lọt vào top 5% ứng viên xuất sắc nhất.",
    difficulty: "B2"
  }
];

export default IT_SENTENCES;
