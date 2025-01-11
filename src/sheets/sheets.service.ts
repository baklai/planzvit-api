import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Department } from 'src/departments/schemas/department.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { Branch } from 'src/branches/schemas/branch.schema';
import { Sheet } from 'src/sheets/schemas/sheet.schema';

import { SheetDto } from './dto/sheet.dto';

@Injectable()
export class SheetsService {
  constructor(
    @InjectModel(Sheet.name) private readonly sheetModel: Model<Sheet>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>
  ) {}

  async getBranchById(id: string, sheetDto: SheetDto): Promise<any> {
    const { monthOfReport, yearOfReport } = sheetDto;

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    return await this.reportModel.aggregate([
      {
        $match: {
          branch: new Types.ObjectId(id),
          monthOfReport,
          yearOfReport
        }
      },
      {
        $group: {
          _id: {
            service: '$service',
            branch: '$branch'
          },
          currentMonthJobCount: {
            $sum: { $ifNull: ['$currentMonthJobCount', 0] }
          }
        }
      },
      {
        $match: {
          currentMonthJobCount: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id.service',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: {
          path: '$service',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: '$service._id',
          code: '$service.code',
          name: '$service.name',
          price: '$service.price',
          branch: '$_id.branch',
          currentMonthJobCount: 1
        }
      }
    ]);
  }

  async getSubdivisionById(id: string, sheetDto: SheetDto): Promise<any> {
    const { monthOfReport, yearOfReport } = sheetDto;

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    return await this.reportModel.aggregate([
      {
        $match: {
          subdivision: new Types.ObjectId(id),
          monthOfReport,
          yearOfReport
        }
      },
      {
        $group: {
          _id: {
            service: '$service',
            subdivision: '$subdivision'
          },
          currentMonthJobCount: {
            $sum: { $ifNull: ['$currentMonthJobCount', 0] }
          }
        }
      },
      {
        $match: {
          currentMonthJobCount: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id.service',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: {
          path: '$service',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: '$service._id',
          code: '$service.code',
          name: '$service.name',
          price: '$service.price',
          subdivision: '$_id.subdivision',
          currentMonthJobCount: 1
        }
      }
    ]);
  }
}
