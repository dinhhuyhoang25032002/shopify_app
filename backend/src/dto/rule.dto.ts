import { IsInt, IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class RuleDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsString()
  @IsNotEmpty()
  status!: string

  @IsInt()
  @IsOptional()
  priority!: number

  @IsString()
  @IsNotEmpty()
  apply!: string

  @IsString()
  @IsNotEmpty()
  type!: string

  @IsJSON()
  @IsOptional()
  tags?: string[] | string

  @IsJSON()
  @IsNotEmpty()
  value!: number
}
