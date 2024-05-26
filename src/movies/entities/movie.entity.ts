// src/users/entities/user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '@prisma/client';

export class MovieEntity implements Movie {
    constructor(partial: Partial<MovieEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    genero: string;

    @ApiProperty()
    releaseDate: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    favoritedBy: any[];

    @ApiProperty()
    watchedBy: any[]; 
}
