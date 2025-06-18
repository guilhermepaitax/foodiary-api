import { Account } from '@application/entities/account';
import { Goal } from '@application/entities/goal';
import { Profile } from '@application/entities/profile';
import { AccountRepository } from '@infra/database/dynamo/repositories/account-repository';
import { GoalRepository } from '@infra/database/dynamo/repositories/goal-repository';
import { ProfileRepository } from '@infra/database/dynamo/repositories/profile-repository';
import { UnitOfWork } from '@infra/database/dynamo/uow/unit-of-work';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {

  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly accountRepository: AccountRepository,
    private readonly goalRepository: GoalRepository,
  ) {
    super();
  }

  async run({ account, profile, goal }: SignUpUnitOfWork.RunParams) {
    this.addPut(this.goalRepository.getPutCommandInput(goal));
    this.addPut(this.profileRepository.getPutCommandInput(profile));
    this.addPut(this.accountRepository.getPutCommandInput(account));

    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
  export type RunParams = {
    account: Account;
    profile: Profile;
    goal: Goal;
  };
}
