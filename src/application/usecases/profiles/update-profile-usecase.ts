import { Profile } from '@application/entities/profile';
import { ResourceNotFound } from '@application/errors/application/resource-not-found';
import { ProfileRepository } from '@infra/database/dynamo/repositories/profile-repository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class UpdateProfileUsecase implements UpdateProfileUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(
    {
      accountId,
      name,
      gender,
      height,
      weight,
      birthDate,
    }: UpdateProfileUsecase.Input,
  ): Promise<UpdateProfileUsecase.Output> {
    const profile = await this.profileRepository.findByAccountId(accountId);

    if (!profile) {
      throw new ResourceNotFound('Profile not found');
    }

    profile.name = name;
    profile.gender = gender;
    profile.height = height;
    profile.weight = weight;
    profile.birthDate = birthDate;

    await this.profileRepository.save(profile);
  }
}

export namespace UpdateProfileUsecase {
  export type Input = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
  };

  export type Output = void;
}
