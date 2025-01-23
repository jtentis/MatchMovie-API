import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IngressoService {

    constructor(private readonly httpService: HttpService) { }

    async getIngressoUrl(cityId: number): Promise<any> {
        const response$ = this.httpService.get(
            `https://api-content.ingresso.com/v0/templates/nowplaying/${cityId}/partnership/joaotentis?limit=150`
        );
        const response = await lastValueFrom(response$);
        return response.data;
    }

    async getIngressoLatLng(lat: any, lng: any): Promise<any> {
        const response$ = this.httpService.get(
            `https://api-content.ingresso.com/v0/states/city/latlong?lat=${lat}&lng=${lng}&radiusInKilometers=50&resultCount=1`
        );
        const response = await lastValueFrom(response$);
        return response.data;
    }
}
