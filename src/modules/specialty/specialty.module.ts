import { TypeOrmModule } from "@nestjs/typeorm";
import { Specialty } from "./entities";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([Specialty])],
})
export class SpecialtyModule {}
