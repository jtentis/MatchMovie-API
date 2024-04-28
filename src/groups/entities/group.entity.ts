
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '@prisma/client';


export class GroupEntity implements Group {
    constructor(partial: Partial<GroupEntity>) {
      Object.assign(this, partial);
    }
  
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    image: string;
  
    @ApiProperty()
    users: any[]; // A relação com os usuários que fazem parte do grupo
  
    @ApiProperty()
    createdAt: Date;
  
    @ApiProperty()
    updatedAt: Date;
  }
  