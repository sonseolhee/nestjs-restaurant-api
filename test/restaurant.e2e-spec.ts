import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';

import * as request from 'supertest';

describe('RestaurantController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect(), await app.close();
  });

  const user = {
    email: 'elma1673@gmail.com',
    name: 'Elma',
    password: '123456789',
  };

  const newRestaurant = {
    name: 'ElmaRestaurant',
    description: 'This is just a description',
    email: 'e_restaurant@gamil.com',
    phoneNo: 1012345678,
    address: 'Cheongwadae-ro Jongno-gu Seoul, Republic of Korea',
    category: 'Fast Food',
  };

  let jwtToken;
  let restaurantCreated;

  it('(GET) - login user', () => {
    return request(app.getHttpServer())
      .get('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
        jwtToken = res.body.token;
      });
  });

  it('(POST) - creates a new restaurant', async () => {
    return await request(app.getHttpServer())
      .post('/restaurants')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newRestaurant)
      .expect(201)
      .then((res) => {
        expect(res.body._id).toBeDefined();
        expect(res.body.name).toEqual(newRestaurant.name);
        restaurantCreated = res.body;
      });
  });

  it('(GET) - get all restaurants', async () => {
    return await request(app.getHttpServer())
      .get('/restaurants')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(1);
      });
  });

  it('(GET) - get restaurant by Id', async () => {
    return await request(app.getHttpServer())
      .get(`/restaurants/${restaurantCreated._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(restaurantCreated._id);
      });
  });

  it('(PUT) - update restaurant by Id', async () => {
    return await request(app.getHttpServer())
      .put(`/restaurants/${restaurantCreated._id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'updated name' })
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual('updated name');
      });
  });

  it('(DELETE) - delete restaurant by Id', async () => {
    return await request(app.getHttpServer())
      .delete(`/restaurants/${restaurantCreated._id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.deleted).toEqual(true);
      });
  });
});
