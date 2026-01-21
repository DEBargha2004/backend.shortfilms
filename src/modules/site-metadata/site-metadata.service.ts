import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class SiteMetadataService {
  constructor(private readonly httpService: HttpService) {}

  async getMetadata(url?: string) {
    if (!url) return null;
    try {
      const res = await firstValueFrom(this.httpService.get(url));
      const $ = cheerio.load(res.data);

      const title = $('title').text().trim();
      const description = $('meta[name="description"]').attr('content')?.trim();
      const ogImage = $('meta[property="og:image"]').attr('content')?.trim();
      const ogUrl = $('meta[property="og:url"]').attr('content')?.trim();

      return { title, description, image: ogImage, url: ogUrl };
    } catch (error) {
      return {};
    }
  }
}
