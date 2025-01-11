import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';

import { Department } from 'src/departments/schemas/department.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Branch } from 'src/branches/schemas/branch.schema';
import { Document } from 'src/documents/schemas/document.schema';

import { SubdivisionDocumentDto } from './dto/subdivision-document.dto';
import { BranchDocumentDto } from './dto/branch-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: PaginateModel<Document>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>
  ) {}

  async getSubdivisionDocument(query: SubdivisionDocumentDto): Promise<any> {
    return [];
  }

  async getBranchDocument(query: BranchDocumentDto): Promise<any> {
    return [];
  }
}
