import { Controller } from '@application/contracts/Controller';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { UpdateProfileBody, updateProfileSchema } from '@application/controllers/profiles/schemas/update-profile-schema';
import { UpdateProfileUsecase } from '@application/usecases/profiles/update-profile-usecase';

@Injectable()
@Schema(updateProfileSchema)
export class UpdateProfileController extends Controller<'private', UpdateProfileController.Response> {
  constructor(private readonly updateProfileUseCase: UpdateProfileUsecase) {
    super();
  }

  protected override async handle(
    { body, accountId }: Controller.Request<'private', UpdateProfileBody>,
  ): Promise<Controller.Response<UpdateProfileController.Response>> {
    const { birthDate, gender, height, weight, name } = body;

    await this.updateProfileUseCase.execute({
      accountId,
      birthDate,
      gender,
      height,
      weight,
      name,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace UpdateProfileController {
  export type Response = void;
}
