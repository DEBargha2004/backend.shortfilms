import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as React from 'react';
import { render } from '@react-email/components';
import { EnvService } from 'src/env.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly envService: EnvService) {
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
      from: this.envService.get('MAIL_APP_USER'),
      subject: 'Email verification',
      to,
      html: template,
    });
  }
}
