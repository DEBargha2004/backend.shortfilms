import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':videoId/manifest.mpd')
  async getMpd(@Param('videoId') videoId: string, @Res() res: Response) {
    const mpdUrl = await this.streamService.getMpd(videoId);

    res.redirect(HttpStatus.FOUND, mpdUrl);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':videoId/:rendition/:segment')
  async getStream(
    @Param('videoId') videoId: string,
    @Param('rendition') rendition: string,
    @Param('segment') segment: string,
    @Res() res: Response,
  ) {
    const segmentUrl = await this.streamService.getSegmentUrl(
      videoId,
      rendition,
      segment,
    );

    res.redirect(HttpStatus.FOUND, segmentUrl);
  }
}
