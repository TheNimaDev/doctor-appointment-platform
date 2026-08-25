import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserRoleDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
