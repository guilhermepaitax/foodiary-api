import { Account } from '@application/entities/account';
import { Goal } from '@application/entities/goal';
import { Profile } from '@application/entities/profile';
import { EmailAlreadyInUse } from '@application/errors/application/email-already-in-use';
import { AccountRepository } from '@infra/database/dynamo/repositories/account-repository';
import { SignUpUnitOfWork } from '@infra/database/dynamo/uow/sign-up-unit-of-work';
import { AuthGateway } from '@infra/gateways/auth-gateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signUpUOW: SignUpUnitOfWork,
  ) {}

  public async execute({
    account: { email, password },
    profile: profileInput,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const emailAlreadyExists = await this.accountRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new EmailAlreadyInUse();
    }
    const account = new Account({ email });

    const { externalId } = await this.authGateway.signUp({
      email: account.email,
      password,
      internalId: account.id,
    });

    account.externalId = externalId;

    const profile = new Profile({
      ...profileInput,
      accountId: account.id,
    });

    const goal = new Goal({
      accountId: account.id,
      carbohydrates: 500,
      calories: 2500,
      proteins: 180,
      fats: 80,
    });

    await this.signUpUOW.run({
      account,
      profile,
      goal,
    });

    await this.accountRepository.create(account);

    const { accessToken, refreshToken } = await this.authGateway.signIn({
      email,
      password,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    };
    profile: {
      name: string;
      birthDate: Date;
      gender: Profile.Gender;
      height: number;
      weight: number;
      activityLevel: Profile.ActivityLevel;
    }
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
