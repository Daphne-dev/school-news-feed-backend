export interface SubscribeToSchoolParam {
  /** 회원 ID */
  userId: number;

  /** 학교 ID */
  schoolId: number;
}
export interface UnsubscribeToSchoolParam {
  /** 회원 ID */
  userId: number;

  /** 학교 ID */
  schoolId: number;
}

export interface FindSubscribedSchoolsParam {
  /** 회원 ID */
  userId: number;

  /** 페이지 번호 */
  page: number;

  /** 페이지 개수 */
  pageSize: number;
}

export interface FindSubscribedInfoParam {
  /** 회원 ID */
  userId: number;

  /** 학교 ID */
  schoolId: number;
}
