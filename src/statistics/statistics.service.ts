import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Department } from 'src/departments/schemas/department.schema';
import { Profile } from 'src/profiles/schemas/profile.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Syslog } from 'src/syslogs/schemas/syslog.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    @InjectModel(Syslog.name) private readonly syslogModel: Model<Syslog>
  ) {}

  private getStartAndEndDateOfWeek = (date: Date) => {
    const firstDayOfWeek = 1;
    const day = date.getDay();
    const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  async database() {
    const currentDate = new Date();

    const firstDayOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    const { startOfWeek, endOfWeek } = this.getStartAndEndDateOfWeek(currentDate);

    const [profiles, departments, services] = await Promise.all([
      this.profileModel.countDocuments(),
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments()
    ]);

    return {
      profiles,
      departments,
      services
    };
  }
}
