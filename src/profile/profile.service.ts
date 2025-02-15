import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { User } from 'src/entity/user.entity';
import path, { extname } from 'path';
import prisma from 'src/prisma';

@Injectable()
export class ProfileService {


    async uploadFile(file: Express.Multer.File, id: number) {
        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });
        if (user == null) throw new NotFoundException("User Tidak Ditemukan");

        if (user.foto_profil != null) {
            const filePath = `../../uploads/${user.foto_profil}`;
            if (existsSync(filePath)) {
                rmSync(filePath);
            }
        }
        const uploadPath = `../../uploads/`;
        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
        }

        const fileExt = extname(file.originalname);
        const baseFilename = user.username;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
        const filePath = `${uploadPath}/${filename}`;

        writeFileSync(filePath, file.buffer);

        await prisma.user.update({
            where: {
                id: id
            },
            data: {
                foto_profil: filename
            }
        });

        return { filename, path: filePath };
    }

    async sendMyFotoProfile(user_id: number) {
        const user = await prisma.user.findFirst({
            where: {
                id: user_id
            }
        });

        if (user == null) throw new NotFoundException("User Tidak Ditemukan");

        return user.foto_profil;
    }
}

