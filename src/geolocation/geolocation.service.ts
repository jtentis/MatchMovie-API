import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeolocationService {
    private readonly OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
    constructor(private readonly httpService:HttpService, private readonly prisma: PrismaService){}

    async getCoordinatesByCEP(cep: string): Promise<{ lat: number; lng: number } | null> {
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${cep},Brazil&key=${this.OPENCAGE_API_KEY}`;
    
        try {
          const response = await firstValueFrom(this.httpService.get(apiUrl));
          const data = response.data;
    
          if (data.results.length > 0) {
            const location = data.results[0].geometry;
    
            // Check for invalid fallback coordinates
            if (location.lat === -10 && location.lng === -55) {
              console.warn(`Fallback coordinates returned for CEP ${cep}.`);
              return null;
            }
    
            return { lat: location.lat, lng: location.lng };
          } else {
            console.error(`No results found for the CEP: ${cep}`);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching coordinates for CEP ${cep}:`, error.message);
          return null;
        }
      }
    
      // rsrs
      async calculateMidpoint(groupId: number): Promise<{ lat: number; lng: number } | null> {
        const group = await this.prisma.group.findUnique({
          where: { id: groupId },
          include: {
            users: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    location: true, // Fetch the CEP
                  },
                },
              },
            },
          },
        });
    
        if (!group || group.users.length === 0) {
          throw new NotFoundException('Group not found or has no users.');
        }
    
        const userPool = [...group.users];
    
        while (userPool.length > 0) {
          // Select a random user
          const randomIndex = Math.floor(Math.random() * userPool.length);
          const randomUser = userPool.splice(randomIndex, 1)[0].user;
    
          if (!randomUser.location) {
            console.warn(`User with ID ${randomUser.id} does not have a valid CEP.`);
            continue;
          }
    
          const coordinates = await this.getCoordinatesByCEP(randomUser.location);
    
          if (coordinates) {
            return coordinates;
          }
    
          console.warn(`Invalid coordinates returned for user ID ${randomUser.id} with CEP ${randomUser.location}.`);
        }
    
        throw new Error('No valid coordinates could be resolved for the group.');
      }
}
