import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import {UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { UserDecorator } from './user.decorator';
import { User } from './entity/user.entity';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("login")
  @ApiBody({type : LoginUserDto})
  login (@Body() data : LoginUserDto){
    return this.appService.login(data);
  }

  @Get("mahasiswa")
  getMahasiswa(){
    return this.appService.getMahasiswa();
  }
  @Post("register")
  @ApiBody({
    type : RegisterUserDto
  })

  register(@Body() data : RegisterUserDto){
    return this.appService.register(data);
  }

  @Get("/auth")
 @UseGuards(AuthGuard)
 @ApiBearerAuth()
 auth(@UserDecorator() user : User) {
  return user
 }

 @Post('mahasiswa/:nim/upload-gambar')
 @UseInterceptors(FileInterceptor('file'))
 @ApiConsumes('multipart/form-data')
 @ApiBody({ type: FileUploadDto })
 uploadMahasiswaGambar(@Param('nim') nim: string, @UploadedFile() file: Express.Multer.File) {
   return this.appService.uploadMahasiswaGambar(nim, file);
 }

 @Get('mahasiswa/:nim/gambar')
 async getMahasiswaGambar(@Param('nim') nim: string, @Res() res : Response) {
   const name = await this.appService.getMahasiswaFoto(nim);
   res.sendFile(name, { root: 'uploads' });

 }
 @Get('mahasiswa/search')
  async searchMahasiswa(
    // @Query('nama')nama?:string,
    @Query('nim')nim? : string
  ){   
    return this.appService.searchMahasiswa(nim)
  }



  @Get("mahasiswa/:nim")
  getMahasiswaByNim(@Param("nim") nim : string ) {
    return this.appService.getMahasiswaByNIM(nim)
  }

  @Post("mahasiswa")
  @ApiBody({type : CreateMahasiswaDto})
  createmahasiswa(@Body() data : CreateMahasiswaDto){
    return this.appService.addMahasiswa(data);

  }
  
  //DELETE locallhost:3000/mahasiswa/105841105322
  @Delete("Mahasiswa/:nim")
  DeleteMahasiswa(@Param("nim")nim : string){
    return this.appService.deleteMahasiswa(nim);
  }

  @Put("mahasiswa/:nim")
  @ApiBody({type: UpdateMahasiswaDto})
  editMahasiswa(
    @Param("nim") nim: string,
    @Body() nama : UpdateMahasiswaDto 
  ){
    return this.appService.updateMahasiswa(nim,nama);
  }

 

}
