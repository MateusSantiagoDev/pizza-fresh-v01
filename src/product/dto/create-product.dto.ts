import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUrl } from "class-validator";

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    description: "Nome do produto",
    example: "Pizza de mussarela",
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: "Descrição do produto",
    example: "Queijo mussarela e borda recheda de catupiry",
  })
  description: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @ApiProperty({
    description: "Preço do produto",
    example: 22.35,
  })
  price: number;

  @IsUrl()
  @ApiProperty({
    description: "Imagem do produto",
    example: "https://fotodepizza.com",
  })
  image: string;
}
