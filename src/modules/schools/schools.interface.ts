export interface CreateSchoolParam {
  /** 학교명 */
  name: string;

  /** 학교 지역 */
  region: string;

  /** 학교 관리자 ID */
  schoolAdminId: number;
}

export interface FindSchoolByIdParam {
  /** 학교 ID */
  schoolId: number;
}

export interface IsSchoolAdminParam {
  /** 학교 ID */
  schoolId: number;

  /** 회원 ID */
  userId: number;
}
