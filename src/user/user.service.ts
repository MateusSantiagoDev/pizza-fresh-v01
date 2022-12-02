import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    findAll(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async findById(id: string): Promise<User> {
      const data = await this.prisma.user.findUnique({ where: { id } });
      if(!data) {
        throw new NotFoundException(`não foi encontrado nenhum registro com o ID: ${id}`)
      }
      return data;

    }

    async findOne(id: string) {
      return await this.findById(id)
    }

    create(dto: CreateUserDto): Promise<User> {

       delete dto.confirmPassword;

       const data: User = { ...dto };
       return this.prisma.user.create({ data }).catch(this.handleError);
    }

    async update(id: string, dto: UpdateUserDto): Promise<User> {
      await this.findById(id)

       delete dto.confirmPassword;

      const data: Partial<User> = { ...dto }; // pnumberartial faz a mesma coisa q o partialTypes
      return this.prisma.user.update({ where: { id }, data }).catch(this.handleError);
    }

    async delete(id: string): Promise<User> {
      await this.findById(id)
      return this.prisma.user.delete({ where: { id } })
    }

    handleError(err: Error): undefined {
      const errorLines = err.message?.split("\n"); // combinação para melhorar a vizualização do erro
      const lastErrorLine = errorLines[errorLines.length -1]?.trim(); // complemento com a linha de cima

      if(!lastErrorLine) {
        console.error(err)
      }

      throw new UnprocessableEntityException(lastErrorLine || "Algum erro ocorreu ao executar a operação") // vai exibir o erro no swagger
    }

}
