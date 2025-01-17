import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import {UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { UserDecorator } from './user.decorator';
import { User } from './entity/user.entity';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

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
    @Body(){nama} : UpdateMahasiswaDto 
  ){
    return this.appService.updateMahasiswa(nim,nama);
  }
}
