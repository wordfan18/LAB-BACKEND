import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import prisma from './prisma';
import { RegisterUserDto } from './dto/register-user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  async register(data: RegisterUserDto) {
    try {
      const user = await prisma.user.findFirst({ where: { username: data.username } });
      if (user) throw new BadRequestException('Username sudah digunakan');
      
      const hashedPassword = hashSync(data.password, 10);
      const newUser = await prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: 'USER',
        },
      });
      return newUser;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Ada masalah pada server');
    }
  }

  

  async uploadMahasiswaGambar(nim: string, file: Express.Multer.File) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');

    const uploadDir = join(__dirname, '../uploads/');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });


    const fileExt = extname(file.originalname);
    const baseFilename = mahasiswa.nim;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
    const filePath = join(uploadDir, filename);

    writeFileSync(filePath, file.buffer);

    await prisma.mahasiswa.update({ where: { nim }, data: { foto_profil: filename } });
    return filename;
  }

  async searchMahasiswa( nim?: string) {
    try{
      const mahasiswa = await prisma.mahasiswa.findMany({
        where:{
          AND:[
            // nama?{nama:{contains:nama,mode:'insensitive'}}:{},
            nim?{nim:{equals:nim}}:{},
          ],
        },
      })
      return mahasiswa;
    }catch (error){
    throw new InternalServerErrorException('ada masalah pada server')
    }
  }
  

  async getMahasiswaFoto(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');
    return mahasiswa.foto_profil;
  }

  async auth(user_id: number) {
    try {
      const user = await prisma.user.findFirst({ where: { id: user_id } });
      if (!user) throw new NotFoundException('User Tidak Ditemukan');
      return user;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Terdapat Masalah Dari Server');
    }
  }

  async login(data: LoginUserDto) {
    try {
      const user = await prisma.user.findFirst({ where: { username: data.username } });
      if (!user) throw new NotFoundException('Username yang anda masukkan salah');

      if (!compareSync(data.password, user.password)) {
        throw new BadRequestException('Password salah');
      }

      const payload = { id: user.id, username: user.username, role: user.role };
      const token = await this.jwtService.signAsync(payload);
      return { token, user };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Ada masalah pada server');
    }
  }

  

  async getMahasiswa() {
    return await prisma.mahasiswa.findMany();
  }

  async getMahasiswaByNIM(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Tidak Menemukan NIM');
    return mahasiswa;
  }

  async addMahasiswa(data: CreateMahasiswaDto) {
    await prisma.mahasiswa.create({ data });
    return await prisma.mahasiswa.findMany();
  }

  async deleteMahasiswa(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Tidak Menemukan NIM');
    await prisma.mahasiswa.delete({ where: { nim } });
    return await prisma.mahasiswa.findMany();
  }

  async updateMahasiswa(nim: string, data: CreateMahasiswaDto) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa dengan NIM tersebut tidak ditemukan.');
    await prisma.mahasiswa.update({ where: { nim }, data });
    return await prisma.mahasiswa.findMany();
  }

  async getUsers() {
    return await prisma.user.findMany({
      select: { id: true, username: true, role: true },
    });
  }
}
