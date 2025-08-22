import { IFileEventHandler } from '@application/contracts/IFileEventHandler';
import { MealUploadedUsecase } from '@application/usecases/meals/meal-uploaded-usecase';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
  constructor(private readonly mealUploadedUsecase: MealUploadedUsecase) {}

  async handle({ fileKey }: IFileEventHandler.Input): Promise<void> {
    await this.mealUploadedUsecase.execute({ fileKey });
  }
}
