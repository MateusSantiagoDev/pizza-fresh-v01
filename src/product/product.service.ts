import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductService {

    constructor(private readonly prisma: PrismaService) {}

    findAll(): Promise<Product[]> {
        return this.prisma.product.findMany()
    }

    async findById(id: string): Promise<Product> {
      const data = await this.prisma.product.findUnique({ where: { id } });
      if(!data) {
        throw new NotFoundException(`não foi encontrado nenhum registro com o ID: ${id}`)
      }
      return data;

    }

    async findOne(id: string) {
      return await this.findById(id)
    }

    create(dto: CreateProductDto): Promise<Product> {
       const data: Product = { ...dto };
       return this.prisma.product.create({ data }).catch(this.handleError);
    }

    async update(id: string, dto: UpdateProductDto): Promise<Product> {
      await this.findById(id)
      const data: Partial<Product> = { ...dto }; // pnumberartial faz a mesma coisa q o partialTypes
      return this.prisma.product.update({ where: { id }, data }).catch(this.handleError);
    }

    async delete(id: string): Promise<Product> {
      await this.findById(id)
      return this.prisma.product.delete({ where: { id } })
    }

    handleError(err: Error): undefined {
      const errorLines = err.message?.split("\n"); // combinação para melhorar a vizualização do erro
      const lastErrorLine = errorLines[errorLines.length -1]?.trim(); // complemento com a linha de cima
      throw new UnprocessableEntityException(lastErrorLine || "Algum erro ocorreu ao executar a operação") // vai exibir o erro no swagger
    }

}
