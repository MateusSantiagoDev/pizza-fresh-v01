import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { Table } from "./entities/table.entity";

@Injectable()
export class TableService {

    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.table.findMany()
    }

    async findById(id: string): Promise<Table> {
      const data = await this.prisma.table.findUnique({ where: { id } });
      if(!data) {
        throw new NotFoundException(`não foi encontrado nenhum registro com o ID: ${id}`)
      }
      return data;

    }

    async findOne(id: string) {
      return await this.findById(id)
    }

    create(dto: CreateTableDto): Promise<Table> {
       const data: Table = { ...dto };
       return this.prisma.table.create({ data }).catch(this.handleError);
    }

    async update(id: string, dto: UpdateTableDto): Promise<Table> {
      await this.findById(id)
      const data: Partial<Table> = { ...dto }; // partial faz a mesma coisa q o partialTypes
      return this.prisma.table.update({ where: { id }, data }).catch(this.handleError);
    }

    async delete(id: string): Promise<Table> {
      await this.findById(id)
      return this.prisma.table.delete({ where: { id } })
    }

    handleError(err: Error): undefined {
      const errorLines = err.message?.split("\n"); // combinação para melhorar a vizualização do erro
      const lastErrorLine = errorLines[errorLines.length -1]?.trim(); // complemento com a linha de cima
      throw new UnprocessableEntityException(lastErrorLine || "Algum erro ocorreu ao executar a operação") // vai exibir o erro no swagger
    }

}
