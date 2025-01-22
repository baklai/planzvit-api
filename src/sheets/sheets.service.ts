import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Sheet } from 'src/sheets/schemas/sheet.schema';

@Injectable()
export class SheetsService {
  constructor(
    @InjectModel(Sheet.name) private readonly sheetModel: Model<Sheet>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>
  ) {}

  async getAggregatedServices(): Promise<Record<string, any>> {
    return await this.serviceModel.aggregate([
      {
        $lookup: {
          from: 'reports',
          localField: '_id',
          foreignField: 'service',
          as: 'reports'
        }
      },
      {
        $unwind: {
          path: '$reports',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          code: { $first: '$code' },
          name: { $first: '$name' },
          price: { $first: '$price' },
          totalCount: { $sum: '$reports.currentJobCount' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          code: 1,
          name: 1,
          price: 1,
          totalCount: 1
        }
      }
    ]);
  }

  async getReportById(department: string): Promise<Record<string, any>[]> {
    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    return await this.reportModel
      .find({
        department,
        $or: [
          { previousJobCount: { $ne: 0 } },
          { changesJobCount: { $ne: 0 } },
          { currentJobCount: { $ne: 0 } }
        ]
      })
      .populate('department', { name: 1, description: 1, phone: 1, manager: 1 })
      .populate('service', { code: 1, name: 1, price: 1 })
      .populate('branch', { name: 1, description: 1 })
      .populate('subdivision', { name: 1, description: 1 })
      .exec();
  }

  async getReportByIds(): Promise<Record<string, any>[]> {
    const departments = await this.departmentModel.find({}, { id: 1 }).exec();

    return await this.reportModel.aggregate([
      {
        $match: {
          department: { $in: departments?.map(({ id }) => new Types.ObjectId(id)) || [] },
          $or: [
            { previousJobCount: { $ne: 0 } },
            { changesJobCount: { $ne: 0 } },
            { currentJobCount: { $ne: 0 } }
          ]
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'department'
        }
      },
      { $unwind: '$department' },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $lookup: {
          from: 'branches',
          localField: 'branch',
          foreignField: '_id',
          as: 'branch'
        }
      },
      { $unwind: '$branch' },
      {
        $lookup: {
          from: 'subdivisions',
          localField: 'subdivision',
          foreignField: '_id',
          as: 'subdivision'
        }
      },
      { $unwind: '$subdivision' },
      {
        $group: {
          _id: '$department._id',
          department: { $first: '$department' },
          records: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          department: {
            name: '$department.name',
            description: '$department.description',
            phone: '$department.phone',
            manager: '$department.manager'
          },
          records: 1
        }
      }
    ]);
  }

  async getBranchById(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    return await this.reportModel.aggregate([
      {
        $match: {
          branch: new Types.ObjectId(id)
        }
      },
      {
        $group: {
          _id: {
            branch: '$branch',
            subdivision: '$subdivision',
            service: '$service'
          },
          currentJobCount: {
            $sum: { $ifNull: ['$currentJobCount', 0] }
          },
          department: { $first: '$department' }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id.service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: {
          path: '$serviceDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          currentPrice: {
            $multiply: ['$serviceDetails.price', '$currentJobCount']
          }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentDetails'
        }
      },
      {
        $unwind: {
          path: '$departmentDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            branch: '$_id.branch',
            subdivision: '$_id.subdivision'
          },
          services: {
            $push: {
              id: '$_id.service',
              totalJobCount: '$currentJobCount',
              totalPrice: '$currentPrice',
              code: '$serviceDetails.code',
              name: '$serviceDetails.name',
              price: '$serviceDetails.price',
              department: {
                id: '$departmentDetails._id',
                name: '$departmentDetails.name',
                phone: '$departmentDetails.phone',
                manager: '$departmentDetails.manager'
              }
            }
          },
          currentJobCount: { $sum: '$currentJobCount' },
          totalPrice: { $sum: '$currentPrice' }
        }
      },
      {
        $lookup: {
          from: 'subdivisions',
          localField: '_id.subdivision',
          foreignField: '_id',
          as: 'subdivisionDetails'
        }
      },
      {
        $unwind: {
          path: '$subdivisionDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id.branch',
          subdivisions: {
            $push: {
              subdivision: '$subdivisionDetails',
              currentJobCount: '$currentJobCount',
              totalPrice: '$totalPrice',
              services: '$services'
            }
          },
          totalJobCount: { $sum: '$currentJobCount' },
          totalPrice: { $sum: '$totalPrice' }
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id',
          foreignField: '_id',
          as: 'branchDetails'
        }
      },
      {
        $unwind: {
          path: '$branchDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: '$branchDetails._id',
          name: '$branchDetails.name',
          description: '$branchDetails.description',
          totalJobCount: '$totalJobCount',
          totalPrice: '$totalPrice',
          subdivisions: {
            $map: {
              input: '$subdivisions',
              as: 'subdivision',
              in: {
                id: '$$subdivision.subdivision._id',
                name: '$$subdivision.subdivision.name',
                description: '$$subdivision.subdivision.description',
                totalJobCount: '$$subdivision.currentJobCount',
                totalPrice: '$$subdivision.totalPrice',
                services: {
                  $filter: {
                    input: '$$subdivision.services',
                    as: 'service',
                    cond: { $gt: ['$$service.totalJobCount', 0] }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          id: 1,
          name: 1,
          description: 1,
          totalJobCount: 1,
          totalPrice: 1,
          subdivisions: {
            $filter: {
              input: '$subdivisions',
              as: 'subdivision',
              cond: { $gt: [{ $size: '$$subdivision.services' }, 0] }
            }
          }
        }
      }
    ]);
  }

  async getBranchByIds(): Promise<any> {
    return await this.reportModel.aggregate([
      {
        $group: {
          _id: {
            branch: '$branch',
            subdivision: '$subdivision',
            service: '$service'
          },
          currentJobCount: {
            $sum: { $ifNull: ['$currentJobCount', 0] }
          },
          department: { $first: '$department' }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id.service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: {
          path: '$serviceDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          currentPrice: {
            $multiply: ['$serviceDetails.price', '$currentJobCount']
          }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentDetails'
        }
      },
      {
        $unwind: {
          path: '$departmentDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            branch: '$_id.branch',
            subdivision: '$_id.subdivision'
          },
          services: {
            $push: {
              id: '$_id.service',
              totalJobCount: '$currentJobCount',
              totalPrice: '$currentPrice',
              code: '$serviceDetails.code',
              name: '$serviceDetails.name',
              price: '$serviceDetails.price',
              department: {
                id: '$departmentDetails._id',
                name: '$departmentDetails.name',
                phone: '$departmentDetails.phone',
                manager: '$departmentDetails.manager'
              }
            }
          },
          currentJobCount: { $sum: '$currentJobCount' },
          totalPrice: { $sum: '$currentPrice' }
        }
      },
      {
        $lookup: {
          from: 'subdivisions',
          localField: '_id.subdivision',
          foreignField: '_id',
          as: 'subdivisionDetails'
        }
      },
      {
        $unwind: {
          path: '$subdivisionDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id.branch',
          subdivisions: {
            $push: {
              subdivision: '$subdivisionDetails',
              currentJobCount: '$currentJobCount',
              totalPrice: '$totalPrice',
              services: '$services'
            }
          },
          totalJobCount: { $sum: '$currentJobCount' },
          totalPrice: { $sum: '$totalPrice' }
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id',
          foreignField: '_id',
          as: 'branchDetails'
        }
      },
      {
        $unwind: {
          path: '$branchDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: '$branchDetails._id',
          name: '$branchDetails.name',
          description: '$branchDetails.description',
          totalJobCount: '$totalJobCount',
          totalPrice: '$totalPrice',
          subdivisions: {
            $map: {
              input: '$subdivisions',
              as: 'subdivision',
              in: {
                id: '$$subdivision.subdivision._id',
                name: '$$subdivision.subdivision.name',
                description: '$$subdivision.subdivision.description',
                totalJobCount: '$$subdivision.currentJobCount',
                totalPrice: '$$subdivision.totalPrice',
                services: {
                  $filter: {
                    input: '$$subdivision.services',
                    as: 'service',
                    cond: { $gt: ['$$service.totalJobCount', 0] }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          id: 1,
          name: 1,
          description: 1,
          totalJobCount: 1,
          totalPrice: 1,
          subdivisions: {
            $filter: {
              input: '$subdivisions',
              as: 'subdivision',
              cond: { $gt: [{ $size: '$$subdivision.services' }, 0] }
            }
          }
        }
      }
    ]);
  }

  async getSubdivisionById(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    return await this.reportModel.aggregate([
      {
        $match: {
          subdivision: new Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'subdivisions',
          localField: 'subdivision',
          foreignField: '_id',
          as: 'subdivisionDetails'
        }
      },
      {
        $unwind: {
          path: '$subdivisionDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branch',
          foreignField: '_id',
          as: 'branchDetails'
        }
      },
      {
        $unwind: {
          path: '$branchDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: {
          path: '$serviceDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentDetails'
        }
      },
      {
        $unwind: {
          path: '$departmentDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          currentJobCount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$subdivision',
          id: { $first: '$subdivisionDetails._id' },
          name: { $first: '$subdivisionDetails.name' },
          description: { $first: '$subdivisionDetails.description' },
          branch: {
            $first: {
              id: '$branchDetails._id',
              name: '$branchDetails.name',
              description: '$branchDetails.description'
            }
          },
          services: {
            $push: {
              id: '$serviceDetails._id',
              code: '$serviceDetails.code',
              name: '$serviceDetails.name',
              price: '$serviceDetails.price',
              totalJobCount: '$currentJobCount',
              totalPrice: { $multiply: ['$currentJobCount', '$serviceDetails.price'] },
              department: {
                id: '$departmentDetails._id',
                name: '$departmentDetails.name',
                phone: '$departmentDetails.phone',
                manager: '$departmentDetails.manager'
              }
            }
          },
          totalJobCount: { $sum: '$currentJobCount' },
          totalPrice: {
            $sum: { $multiply: ['$currentJobCount', '$serviceDetails.price'] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          description: 1,
          services: 1,
          totalJobCount: 1,
          totalPrice: 1
        }
      }
    ]);
  }

  async getSubdivisionByIds(): Promise<any> {
    return await this.reportModel.aggregate([
      {
        $lookup: {
          from: 'subdivisions',
          localField: 'subdivision',
          foreignField: '_id',
          as: 'subdivisionDetails'
        }
      },
      {
        $unwind: {
          path: '$subdivisionDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branch',
          foreignField: '_id',
          as: 'branchDetails'
        }
      },
      {
        $unwind: {
          path: '$branchDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: {
          path: '$serviceDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentDetails'
        }
      },
      {
        $unwind: {
          path: '$departmentDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          currentJobCount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$subdivision',
          id: { $first: '$subdivisionDetails._id' },
          name: { $first: '$subdivisionDetails.name' },
          description: { $first: '$subdivisionDetails.description' },
          branch: {
            $first: {
              id: '$branchDetails._id',
              name: '$branchDetails.name',
              description: '$branchDetails.description'
            }
          },
          services: {
            $push: {
              id: '$serviceDetails._id',
              code: '$serviceDetails.code',
              name: '$serviceDetails.name',
              price: '$serviceDetails.price',
              totalJobCount: '$currentJobCount',
              totalPrice: { $multiply: ['$currentJobCount', '$serviceDetails.price'] },
              department: {
                id: '$departmentDetails._id',
                name: '$departmentDetails.name',
                phone: '$departmentDetails.phone',
                manager: '$departmentDetails.manager'
              }
            }
          },
          totalJobCount: { $sum: '$currentJobCount' },
          totalPrice: {
            $sum: { $multiply: ['$currentJobCount', '$serviceDetails.price'] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          description: 1,
          services: 1,
          totalJobCount: 1,
          totalPrice: 1
        }
      }
    ]);
  }
}
