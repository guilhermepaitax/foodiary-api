import {
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GetTokensFromRefreshTokenCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHmac } from 'node:crypto';

import { InvalidRefreshToken } from '@application/errors/application/invalid-refresh-token';
import { cognitoClient } from '@infra/clients/cognito-client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/app-config';

@Injectable()
export class AuthGateway {
  constructor(private readonly config: AppConfig) {}

  async signIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.config.auth.cognito.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
      throw new Error(`Cannot authenticate user ${email}`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }

  async signUp({
    email,
    password,
    internalId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      Username: email,
      Password: password,
      ClientId: this.config.auth.cognito.clientId,
      SecretHash: this.getSecretHash(email),
      UserAttributes: [
        { Name: 'custom:internalId', Value: internalId },
      ],
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot sign up user ${email}`);
    }

    return {
      externalId,
    };
  }

  async refreshToken({ refreshToken }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {
      const command = new GetTokensFromRefreshTokenCommand({
        RefreshToken: refreshToken,
        ClientId: this.config.auth.cognito.clientId,
        ClientSecret: this.config.auth.cognito.clientSecret,
      });

      const { AuthenticationResult } = await cognitoClient.send(command);

      if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
        throw new Error('Cannot refresh token');
      }

      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      };
    } catch {
      throw new InvalidRefreshToken();
    }
  }

  async forgotPassword({ email }: AuthGateway.ForgotPasswordParams): Promise<void> {
    const command = new ForgotPasswordCommand({
      Username: email,
      ClientId: this.config.auth.cognito.clientId,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async confirmForgotPassword({
    email,
    password,
    confirmationCode,
  }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: password,
      ClientId: this.config.auth.cognito.clientId,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  private getSecretHash(email: string) {
    const { clientSecret, clientId } = this.config.auth.cognito;

    return createHmac('SHA256', clientSecret)
      .update(`${email}${clientId}`)
      .digest('base64');
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
    internalId: string;
  };

  export type SignUpResult = {
    externalId: string;
  };

  export type SignInParams = {
    email: string;
    password: string;
  };

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type RefreshTokenParams = {
    refreshToken: string;
  };

  export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type ForgotPasswordParams = {
    email: string;
  };

  export type ConfirmForgotPasswordParams = {
    email: string;
    password: string;
    confirmationCode: string;
  };
}
