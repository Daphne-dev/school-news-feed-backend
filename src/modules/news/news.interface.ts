export interface CreateNewsParam {
  /** 제목 */
  title: string;

  /** 내용 */
  content: string;

  /** 학교 ID */
  schoolId: number;

  /** 학교 관리자 ID */
  userId: number;
}

export interface UpdateNewsParam {
  /** 학교 소식 ID */
  newsId: number;

  /** 제목 */
  title?: string;

  /** 내용 */
  content?: string;

  /** 학교 ID */
  schoolId: number;

  /** 학교 관리자 ID */
  userId: number;
}

export interface DeleteNewsParam {
  /** 학교 소식 ID */
  newsId: number;

  /** 학교 ID */
  schoolId: number;

  /** 학교 관리자 ID */
  userId: number;
}

export interface FindSubscribedNewsParam {
  /** 회원 ID */
  userId: number;

  /** 학교 ID */
  schoolId: number;

  /** 페이지 번호 */
  page: number;

  /** 페이지 개수 */
  pageSize: number;
}
