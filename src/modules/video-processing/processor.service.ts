import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class VideoProcessingService implements OnModuleInit {
  private clientProxy: ClientProxy;

  onModuleInit() {
    this.clientProxy = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 5400, host: 'video-processor' },
    });
  }

  async processVideo(path: string, videoId: string) {
    console.log('Processing video: ', path);
    return this.clientProxy.send({ cmd: 'download' }, { path, videoId });
  }
}
