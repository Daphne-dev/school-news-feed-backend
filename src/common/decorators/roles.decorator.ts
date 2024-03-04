import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../../modules/user/user.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
