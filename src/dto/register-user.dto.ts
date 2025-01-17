import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, Length, IsNotEmpty } from "class-validator";

export class RegisterUserDto{

    @ApiProperty({
        description: "Username",
        type: String,
        example: "fikrah"
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\S *$/i)
    @Length(1, 30)
    username: string;



    @ApiProperty({
        description: "Password",
        type: String,
        example: "Password"
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\S *$/i)
    @Length(1, 30)
    password: string;
    
}



