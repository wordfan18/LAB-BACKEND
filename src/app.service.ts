import {  BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import prisma from './prisma';
import { RegisterUserDto } from './dto/register-user.dto';
import { hashSync } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {

  constructor(private readonly jwtService : JwtService) {}


async login (data : LoginUserDto){
    try {
      const user = await prisma.user.findFirst({
        where : {
          username : data.username
        }
      });

      if(!user){
        throw new NotFoundException("Username Tidak Ada")
      }

      const isPasswordValid = compareSync(data.password, user.password);

      if(!compareSync(data.password, user.password))throw new BadRequestException("Password Salah");

        const payload = {
          id : user.id,
          username : user.username,
          role : user.role,
        }

        const token = await this.jwtService.signAsync(payload);

        return {
          token: token,
          user : payload
      
        }

      }catch(err) {
        throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")
      }
    }

     
    




   async register (data : 
    RegisterUserDto){
      const user = await prisma.user.findFirst({
        where : {
          username : data.username
        }
      })

      if(user != null){
        throw new BadRequestException("Username Sudah Ada")
      }

      const hash = hashSync(data.password, 10)

      const newUser = await prisma.user.create({
        data : {
          username : data.username,
          password : hash,
          role : "USER"
        }
      })
      
      const payload = {
        id : newUser.id,
        username : newUser.username,
        role : newUser.role
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        token : token,
        user : payload,
      
    
  };
}



  async auth(user_id : number) {
  try {
       const user = await prisma.user.findFirst({
    where : {
     id : user_id
    }
   })
      if(user == null) throw new NotFoundException("User Tidak Ditemukan")
       return user
    }catch(err) {
   if(err instanceof HttpException) throw err
   throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")
  }
 }
  
  

  async getMahasiswa() {
    return await prisma.mahasiswa.findMany();
  }

  async getMahasiswaByNIM(nim : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim
      }
    })

    if(mahasiswa == null) 
      throw new NotFoundException("Tidak Menemukan NIM")

    return mahasiswa

  }

  async addMahasiswa(data : CreateMahasiswaDto) {
    await prisma.mahasiswa.create({
      data
    })

    return await prisma.mahasiswa.findMany()
  }

  async deleteMahasiswa(nim : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim 
      }
    })



    if(mahasiswa == null) {
      throw new NotFoundException("Tidak Menemukan NIM")
    }

    await prisma.mahasiswa.delete({
      where : {
        nim 
      }
    })

    return await prisma.mahasiswa.findMany()
  }

  async updateMahasiswa(nim : string, nama : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim
      }
    })

    if(mahasiswa == null) {
      throw new NotFoundException("Tidak Menemukan NIM")
    }

    await prisma.mahasiswa.update({
      where : {
        nim
      },
      data : {
        nama
      }
    })

    return await prisma.mahasiswa.findMany()

  
  }

}
