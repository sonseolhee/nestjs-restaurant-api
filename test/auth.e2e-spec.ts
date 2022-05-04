import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';

import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    mongoose.connect(process.env.DB_URI_LOCAL, function () {
      mongoose.connection.db.dropDatabase();
    });
  });

  afterAll(async () => {
    await mongoose.disconnect(), await app.close();
  });

  const user = {
    email: 'elma1673@gmail.com',
    name: 'Elma',
    password: '123456789',
  };

  it('(POST) - register a new user', async () => {
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body.email).toBeDefined();
      });
  });

  it('(GET) - login user', async () => {
    return await request(app.getHttpServer())
      .get('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
      });
  });
});
