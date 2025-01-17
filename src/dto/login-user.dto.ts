import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
@ApiProperty({
    description: "Username",
    type: String,
    example: "fikrah"
})
  @IsString()
  username: string;

@ApiProperty({
    description: "Password",
    type: String,
    example: "Password"

})

  @IsString()
  password: string;
}