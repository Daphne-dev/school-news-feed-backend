import { UserRole } from './user.enum';

export interface CreateUserParam {
  /** 이메일 */
  email: string;

  /** 이름 */
  name: string;

  /** 비밀번호 */
  password: string;

  /** 역할 */
  role: UserRole;
}

export interface FindOneByEmailAndPasswordParam {
  /** 이메일 */
  email: string;

  /** 비밀번호 */
  password: string;
}

export interface FindOneUserByIdParam {
  /** 회원 ID */
  userId: number;
}
