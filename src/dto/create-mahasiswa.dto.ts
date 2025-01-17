import { ApiProperty } from '@nestjs/swagger';
import { Jenis_kelamin } from '@prisma/client';
import { IsString, IsNotEmpty,Length, isEnum, IsEnum } from 'class-validator';

export class CreateMahasiswaDto {
    @ApiProperty({
        description:"NIM",
        type: String,
        example: "105841105322"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 12)
   nim: string;

   @ApiProperty({
    description:"Nama",
    type: String,
    example: "Fikrah Lejahtegis"
})

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
   nama: string;


   @ApiProperty({
    description:"kelas",
    type: String,
    example: "5B"
})

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
   kelas: string;



   @ApiProperty({
    description:"jurusan",
    type: String,
    example: "informatika"
})
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
   jurusan: string;

   @ApiProperty({
    description:"jenis kelamin",
    enum: Jenis_kelamin,
    example: "L"
})
    @IsEnum(Jenis_kelamin)
    jenis_kelamin: Jenis_kelamin;
   
}