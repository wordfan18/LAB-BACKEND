import { BadRequestException, Controller, Get, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserDecorator } from 'src/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { response } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(`upload`)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile()file :Express.Multer.File,@UserDecorator()user : User) {
    if (file ==null) throw new BadRequestException("File Tidak Ditemukan");

    return this.profileService.uploadFile(file, user.id);

  }

  @Get("search")
  async getName(
    @Query("search")search : string,
  ){
    return search;
    

  }
    @Get("/:id")
    async getProFile(@Param("id")id : number, @Res()Response){

      const fileName = await this.profileService.sendMyFotoProfile(id);

      return response.sendFile(`../../uploads/`+fileName)

  }

  
}



 



