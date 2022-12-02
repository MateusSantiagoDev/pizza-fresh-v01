import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl, Matches, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: "Nome do usuário. UTILIZADO no login. Deve ser único",
    example: "mateussantiago"
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: "Nome do usuário. Apenas para exibição",
    example: "Mateus Santiago"
  })
  name: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  @ApiProperty({
    description: "Senha do usuario para login",
    example: "Abcd@1234"
  })
  password: string;

  @ApiProperty({
    description: "A confirmação da senha deve ser igual a senha",
    example: "Abcd@1234"
  })
  confirmPassword: string;

  @IsUrl()
  @ApiProperty({
    description: "Imagem de perfil do usuário",
    example: "https://avatars.githubusercontent.com/u/106131007?v=4"
  })
  image: string;
}
