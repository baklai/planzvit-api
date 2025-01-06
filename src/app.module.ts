import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { join } from 'path';
import { existsSync } from 'fs';
import * as mongooseAutopopulate from 'mongoose-autopopulate';
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
import * as mongoosePaginate from 'mongoose-paginate-v2';

import appConfig from './config/app.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SyslogsModule } from './syslogs/syslogs.module';
import { DepartmentsModule } from './departments/departments.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ServicesModule } from './services/services.module';

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
    SyslogsModule,
    ProfilesModule,
    ServicesModule,
    DepartmentsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).exclude().forRoutes('*');
  }
}
