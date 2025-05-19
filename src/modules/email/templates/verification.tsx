import { Body, Button, Heading, Html, Text } from '@react-email/components';
import * as React from 'react';

export default function VerificationTemplate({ token }: { token: string }) {
  return (
    <Html>
      <Body>
        <Heading>Verify your email</Heading>
        <Text>This is a verification token: {token}</Text>
      </Body>
    </Html>
  );
}
