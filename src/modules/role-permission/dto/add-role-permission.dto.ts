import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddRolePermissionDto {
  @IsNotEmpty()
  @IsUUID()
  permissionId: string;
}
