// 댓글 목업. articleId로 어떤 글의 댓글인지 연결. TO-DO-NEXT: BE 연동 시 삭제 요망.
export const COMMENTS = [
  { id: 1, articleId: 1, author: "서연", time: "8분 전", content: "왼쪽이요! 오버핏 코트가 요즘 더 트렌디해요." },
  { id: 2, articleId: 1, author: "도윤", time: "5분 전", content: "저는 오른쪽. 클래식한 핏이 오래 입기 좋아요." },
  { id: 3, articleId: 1, author: "지우", time: "2분 전", content: "둘 다 좋은데 소재가 궁금하네요 ㅎㅎ" },

  { id: 4, articleId: 2, author: "민준", time: "15분 전", content: "가죽자켓 추천이요!" },
  { id: 5, articleId: 2, author: "하린", time: "10분 전", content: "쌀쌀하면 코트가 나을 것 같아요." },

  { id: 6, articleId: 3, author: "서연", time: "30분 전", content: "연청 데님이랑 잘 어울릴 것 같아요." },
  { id: 7, articleId: 3, author: "지우", time: "20분 전", content: "슬랙스 매치하면 깔끔할 듯!" },

  { id: 8, articleId: 4, author: "도윤", time: "50분 전", content: "니트 색 예쁘네요. 어디 제품이에요?" },

  { id: 9, articleId: 5, author: "민준", time: "1시간 전", content: "지우개랑 전용 클리너 쓰면 꽤 지워져요." },
  { id: 10, articleId: 5, author: "서연", time: "40분 전", content: "방수 스프레이 미리 뿌려두면 덜 더러워져요!" },
];
