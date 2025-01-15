import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { Service } from 'src/services/schemas/service.schema';
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
            branch: '$branch',
            subdivision: '$subdivision',
            service: '$service'
          },
          currentJobCount: {
            $sum: { $ifNull: ['$currentJobCount', 0] }
          }
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
        $group: {
          _id: {
            branch: '$_id.branch',
            subdivision: '$_id.subdivision'
          },
          services: {
            $push: {
              serviceId: '$_id.service',
              currentJobCount: '$currentJobCount',
              currentPrice: '$currentPrice',
              code: '$serviceDetails.code',
              name: '$serviceDetails.name',
              price: '$serviceDetails.price'
            }
          },
          currentJobCount: { $sum: '$currentJobCount' },
          totalPrice: { $sum: '$currentPrice' }
        }
      },
      {
        $group: {
          _id: '$_id.branch',
          subdivisions: {
            $push: {
              subdivisionId: '$_id.subdivision',
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
          as: 'branch'
        }
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          branch: '$_id',
          name: '$branch.name',
          totalJobCount: '$totalJobCount',
          totalPrice: '$totalPrice',
          subdivisions: {
            $map: {
              input: '$subdivisions',
              as: 'subdivision',
              in: {
                subdivision: '$$subdivision.subdivisionId',
                name: {
                  $let: {
                    vars: {
                      matchedSubdivision: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$branch.subdivisions',
                              as: 'sub',
                              cond: {
                                $eq: ['$$sub._id', '$$subdivision.subdivisionId']
                              }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: '$$matchedSubdivision.name'
                  }
                },
                totalJobCount: '$$subdivision.currentJobCount',
                totalPrice: '$$subdivision.totalPrice',
                services: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$$subdivision.services',
                        as: 'service',
                        cond: { $gt: ['$$service.currentJobCount', 0] }
                      }
                    },
                    as: 'service',
                    in: {
                      service: '$$service.serviceId',
                      code: '$$service.code',
                      name: '$$service.name',
                      price: '$$service.price',
                      totalJobCount: '$$service.currentJobCount',
                      totalPrice: '$$service.currentPrice'
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]);
  }

  async getBranchByIds(id: string, sheetDto: SheetDto): Promise<any> {
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
            branch: '$branch',
            subdivision: '$subdivision',
            service: '$service'
          },
          currentJobCount: {
            $sum: { $ifNull: ['$currentJobCount', 0] }
          }
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
        $group: {
          _id: {
            branch: '$_id.branch',
            subdivision: '$_id.subdivision'
          },
          services: {
            $push: {
              serviceId: '$_id.service',
              currentJobCount: '$currentJobCount',
              currentPrice: '$currentPrice',
              code: '$serviceDetails.code',
              name: '$serviceDetails.name',
              price: '$serviceDetails.price'
            }
          },
          currentJobCount: { $sum: '$currentJobCount' },
          totalPrice: { $sum: '$currentPrice' }
        }
      },
      {
        $group: {
          _id: '$_id.branch',
          subdivisions: {
            $push: {
              subdivisionId: '$_id.subdivision',
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
          as: 'branch'
        }
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          branch: '$_id',
          name: '$branch.name',
          totalJobCount: '$totalJobCount',
          totalPrice: '$totalPrice',
          subdivisions: {
            $map: {
              input: '$subdivisions',
              as: 'subdivision',
              in: {
                subdivision: '$$subdivision.subdivisionId',
                name: {
                  $let: {
                    vars: {
                      matchedSubdivision: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$branch.subdivisions',
                              as: 'sub',
                              cond: {
                                $eq: ['$$sub._id', '$$subdivision.subdivisionId']
                              }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: '$$matchedSubdivision.name'
                  }
                },
                totalJobCount: '$$subdivision.currentJobCount',
                totalPrice: '$$subdivision.totalPrice',
                services: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$$subdivision.services',
                        as: 'service',
                        cond: { $gt: ['$$service.currentJobCount', 0] }
                      }
                    },
                    as: 'service',
                    in: {
                      service: '$$service.serviceId',
                      code: '$$service.code',
                      name: '$$service.name',
                      price: '$$service.price',
                      totalJobCount: '$$service.currentJobCount',
                      totalPrice: '$$service.currentPrice'
                    }
                  }
                }
              }
            }
          }
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
            branch: '$branch',
            subdivision: '$subdivision',
            department: '$department'
          },
          currentJobCount: {
            $sum: { $ifNull: ['$currentJobCount', 0] }
          }
        }
      },
      {
        $match: {
          currentJobCount: { $gt: 0 }
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
        $lookup: {
          from: 'departments',
          localField: '_id.department',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id.branch',
          foreignField: '_id',
          as: 'branch'
        }
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$branch.subdivisions',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'branch.subdivisions._id': { $eq: new Types.ObjectId(id) }
        }
      },
      {
        $addFields: {
          totalPrice: {
            $multiply: ['$service.price', '$currentJobCount']
          },
          serviceData: {
            id: '$service._id',
            code: '$service.code',
            name: '$service.name',
            price: '$service.price',
            totalJobCount: '$currentJobCount',
            totalPrice: {
              $multiply: ['$service.price', '$currentJobCount']
            },
            department: {
              id: '$department._id',
              name: '$department.name',
              phone: '$department.phone',
              manager: '$department.manager'
            }
          },
          branch: {
            id: '$branch._id',
            name: '$branch.name',
            description: '$branch.description'
          },
          subdivision: {
            id: '$branch.subdivisions._id',
            name: '$branch.subdivisions.name',
            description: '$branch.subdivisions.description'
          }
        }
      },
      {
        $group: {
          _id: '$_id.subdivision',
          services: { $push: '$serviceData' },
          totalPrice: { $sum: '$totalPrice' },
          totalJobCount: { $sum: '$currentJobCount' },
          branch: { $first: '$branch' },
          subdivision: { $first: '$subdivision' }
        }
      },
      {
        $project: {
          _id: 0,
          branch: {
            id: '$branch._id',
            name: '$branch.name',
            description: '$branch.description'
          },
          subdivision: 1,
          services: 1,
          totalPrice: 1,
          totalJobCount: 1
        }
      }
    ]);
  }

  async getSubdivisionByIds(id: string, sheetDto: SheetDto): Promise<any> {
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
            branch: '$branch',
            subdivision: '$subdivision',
            department: '$department'
          },
          currentJobCount: {
            $sum: { $ifNull: ['$currentJobCount', 0] }
          }
        }
      },
      {
        $match: {
          currentJobCount: { $gt: 0 }
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
        $lookup: {
          from: 'departments',
          localField: '_id.department',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id.branch',
          foreignField: '_id',
          as: 'branch'
        }
      },
      {
        $unwind: {
          path: '$branch',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$branch.subdivisions',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'branch.subdivisions._id': { $eq: new Types.ObjectId(id) }
        }
      },
      {
        $addFields: {
          totalPrice: {
            $multiply: ['$service.price', '$currentJobCount']
          },
          serviceData: {
            id: '$service._id',
            code: '$service.code',
            name: '$service.name',
            price: '$service.price',
            totalJobCount: '$currentJobCount',
            totalPrice: {
              $multiply: ['$service.price', '$currentJobCount']
            },
            department: {
              id: '$department._id',
              name: '$department.name',
              phone: '$department.phone',
              manager: '$department.manager'
            }
          },
          branch: {
            id: '$branch._id',
            name: '$branch.name',
            description: '$branch.description'
          },
          subdivision: {
            id: '$branch.subdivisions._id',
            name: '$branch.subdivisions.name',
            description: '$branch.subdivisions.description'
          }
        }
      },
      {
        $group: {
          _id: '$_id.subdivision',
          services: { $push: '$serviceData' },
          totalPrice: { $sum: '$totalPrice' },
          totalJobCount: { $sum: '$currentJobCount' },
          branch: { $first: '$branch' },
          subdivision: { $first: '$subdivision' }
        }
      },
      {
        $project: {
          _id: 0,
          branch: {
            id: '$branch._id',
            name: '$branch.name',
            description: '$branch.description'
          },
          subdivision: 1,
          services: 1,
          totalPrice: 1,
          totalJobCount: 1
        }
      }
    ]);
  }
}
