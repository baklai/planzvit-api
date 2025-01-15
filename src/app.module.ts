import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync } from 'fs';
import { Schema } from 'mongoose';
import * as mongooseAutopopulate from 'mongoose-autopopulate';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { join } from 'path';
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

import appConfig from './config/app.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DepartmentsModule } from './departments/departments.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ReportsModule } from './reports/reports.module';
import { ServicesModule } from './services/services.module';
import { SheetsModule } from './sheets/sheets.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SyslogsModule } from './syslogs/syslogs.module';
import { SubdivisionsModule } from './subdivisions/subdivisions.module';

function createStaticModule(directory: string, serveRoot: string, exclude = ['/api/(.*)']) {
  if (!directory || !serveRoot) return [];

  const filePath = join(__dirname, '..', directory, 'index.html');

  return existsSync(filePath)
    ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', directory),
          serveRoot,
          exclude
        })
      ]
    : [];
}

const AppStaticModule = createStaticModule('app', '/', ['/api/(.*)']);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig]
    }),

    ...AppStaticModule,

    ScheduleModule.forRoot(),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: connection => {
          connection.plugin((schema: Schema) => {
            schema.set('autoCreate', false);
            schema.set('versionKey', false);
            schema.set('timestamps', true);
            schema.virtual('id').get(function () {
              return this._id;
            });
            schema.set('toJSON', {
              virtuals: true,
              transform: function (doc, ret) {
                delete ret._id;
              }
            });
            schema.set('toObject', {
              virtuals: true,
              transform: function (doc, ret) {
                delete ret._id;
              }
            });
          });

          connection.plugin(mongooseAutopopulate);
          connection.plugin(mongooseAggregatePaginate);
          connection.plugin(mongoosePaginate);

          return connection;
        }
      })
    }),

    AuthModule,
    ProfilesModule,
    DepartmentsModule,
    ServicesModule,
    BranchesModule,
    SubdivisionsModule,
    ReportsModule,
    SheetsModule,
    StatisticsModule,
    SyslogsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: '/syslogs', method: RequestMethod.GET },
        { path: '/auth/:params', method: RequestMethod.GET },
        { path: '/auth/:params', method: RequestMethod.POST }
      )
      .forRoutes('*');
  }
}
