export interface LoginParam {
  /** 이메일 아이디 */
  email: string;

  /** 비밀번호 */
  password: string;
}

export interface LogoutParam {
  /** 회원 ID */
  userId: number;
}

export interface RefreshParam {
  /** 회원 ID */
  userId: number;
}
