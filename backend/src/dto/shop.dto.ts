import { STATUS_SHOP } from 'src/constants';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class ShopDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  shop: string;

  @IsString()
  @IsOptional()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  sender_email: string;

  @IsNotEmpty()
  @IsInt()
  @IsEnum(STATUS_SHOP, { message: 'status must be a valid enum 0 or 1' })
  status: number;
}
