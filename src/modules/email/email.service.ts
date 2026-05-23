import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as React from 'react';
import { render } from '@react-email/components';
import { ConfigService } from '@nestjs/config';
import { TConfig } from 'src/libs/env';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService<TConfig>) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_APP_USER,
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });
  }

  async generateTemplate<T extends React.JSXElementConstructor<any>>(
    element: T,
    params: React.ComponentProps<T>,
  ): Promise<string> {
    const Component = React.createElement(element, params);
    const html = await render(Component);
    return html;
  }

  async sendMail(template: string, to: string) {
    await this.transporter.sendMail({
      from: this.configService.get('MAIL_APP_USER', { infer: true }),
      subject: 'Email verification',
      to,
      html: template,
    });
  }
}
