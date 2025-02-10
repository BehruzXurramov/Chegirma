import { Injectable } from "@nestjs/common";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Region } from "./model/region.model";

@Injectable()
export class RegionService {
  constructor(@InjectModel(Region) private regionModel: typeof Region) {}

  async create(createRegionDto: CreateRegionDto) {
    return this.regionModel.create({ ...createRegionDto });
  }

  findAll() {
    return this.regionModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.regionModel.findByPk(id, { include: { all: true } });
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    return this.regionModel.update(updateRegionDto, { where: { id } });
  }

  async remove(id: number) {
    return this.regionModel.destroy({ where: { id } });
  }
}
