// 댓글 목업. articleId로 글 연결, parentId로 대댓글 연결(null=최상위). TO-DO-NEXT: BE 연동 시 삭제 요망.
export const COMMENTS = [
  { id: 1, articleId: 1, parentId: null, author: "서연", time: "8분 전", content: "왼쪽이요! 오버핏 코트가 요즘 더 트렌디해요.", likes: 5 },
  { id: 2, articleId: 1, parentId: 1, author: "민준", time: "6분 전", content: "오 그런가요? 오버핏 고민해볼게요!", likes: 1 },
  { id: 3, articleId: 1, parentId: null, author: "도윤", time: "5분 전", content: "저는 오른쪽. 클래식한 핏이 오래 입기 좋아요.", likes: 3 },
  { id: 4, articleId: 1, parentId: 3, author: "지우", time: "3분 전", content: "맞아요 무난한 게 활용도 높죠.", likes: 0 },
  { id: 5, articleId: 1, parentId: null, author: "하린", time: "2분 전", content: "둘 다 좋은데 소재가 궁금하네요 ㅎㅎ", likes: 2 },
  // 깊은 답글 체인 (계속 보기 테스트용): 1 → 2 → 13 → 14 → 15
  { id: 13, articleId: 1, parentId: 2, author: "서연", time: "5분 전", content: "저도 오버핏 입다가 클래식으로 갈아탔어요 ㅋㅋ", likes: 0 },
  { id: 14, articleId: 1, parentId: 13, author: "민준", time: "4분 전", content: "오 왜 갈아타셨어요?", likes: 0 },
  { id: 15, articleId: 1, parentId: 14, author: "서연", time: "3분 전", content: "오버핏은 격식 자리에 좀 부담스럽더라고요", likes: 0 },

  { id: 6, articleId: 2, parentId: null, author: "민준", time: "15분 전", content: "가죽자켓 추천이요!", likes: 4 },
  { id: 7, articleId: 2, parentId: null, author: "하린", time: "10분 전", content: "쌀쌀하면 코트가 나을 것 같아요.", likes: 2 },

  { id: 8, articleId: 3, parentId: null, author: "서연", time: "30분 전", content: "연청 데님이랑 잘 어울릴 것 같아요.", likes: 6 },
  { id: 9, articleId: 3, parentId: 8, author: "도윤", time: "25분 전", content: "오 연청 좋네요 감사합니다!", likes: 1 },

  { id: 10, articleId: 4, parentId: null, author: "도윤", time: "50분 전", content: "니트 색 예쁘네요. 어디 제품이에요?", likes: 3 },

  { id: 11, articleId: 5, parentId: null, author: "민준", time: "1시간 전", content: "지우개랑 전용 클리너 쓰면 꽤 지워져요.", likes: 8 },
  { id: 12, articleId: 5, parentId: null, author: "서연", time: "40분 전", content: "방수 스프레이 미리 뿌려두면 덜 더러워져요!", likes: 5 },
];
