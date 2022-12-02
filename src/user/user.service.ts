import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private userSelect = {
    id: true,
    nickname: true,
    name: true,
    password: false,
    image: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ select: this.userSelect });
  }

  async findById(id: string): Promise<User> {
    const data = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
    if (!data) {
      throw new NotFoundException(
        `não foi encontrado nenhum registro com o ID: ${id}`,
      );
    }
    return data;
  }

  async findOne(id: string) {
    return await this.findById(id);
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (dto.password != dto.confirmPassword) {
      throw new BadRequestException('As senhas informadas não são iguais');
    }

    delete dto.confirmPassword;

    const data: User = {
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };
    return this.prisma.user
      .create({ data, select: this.userSelect })
      .catch(this.handleError);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id);

    if (dto.password) {
      if (dto.password != dto.confirmPassword) {
        throw new BadRequestException('As senhas informadas não são iguais');
      }
    }

    delete dto.confirmPassword;

    const data: Partial<User> = { ...dto }; // pnumberartial faz a mesma coisa q o partialTypes

    if (dto.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user
      .update({ where: { id }, data, select: this.userSelect })
      .catch(this.handleError);
  }

  async delete(id: string): Promise<User> {
    await this.findById(id);
    return this.prisma.user.delete({ where: { id } });
  }

  handleError(err: Error): undefined {
    const errorLines = err.message?.split('\n'); // combinação para melhorar a vizualização do erro
    const lastErrorLine = errorLines[errorLines.length - 1]?.trim(); // complemento com a linha de cima

    if (!lastErrorLine) {
      console.error(err);
    }

    throw new UnprocessableEntityException(
      lastErrorLine || 'Algum erro ocorreu ao executar a operação',
    ); // vai exibir o erro no swagger
  }
}
