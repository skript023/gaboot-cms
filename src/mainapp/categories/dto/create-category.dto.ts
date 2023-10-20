import { Optional } from "@nestjs/common"
import { IsNotEmpty } from "class-validator"

export class CreateCategoryDto 
{
  @IsNotEmpty()
  readonly name: string
  @IsNotEmpty()
  readonly description: string
  @Optional()
  readonly imagePath: string
  @Optional()
  readonly thumbnailPath: string
}
