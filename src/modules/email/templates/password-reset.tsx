import { Body, Heading, Html, Text } from '@react-email/components';
import * as React from 'react';

export default function PasswordResetTemplate({ token }: { token: string }) {
  return (
    <Html>
      <Body>
        <Heading>Reset your password</Heading>
        <Text>This is a password reset token: {token}</Text>
      </Body>
    </Html>
  );
}
