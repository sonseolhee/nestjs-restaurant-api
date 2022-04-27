import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ConfigModule} from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI_LOCAL),
    RestaurantsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
