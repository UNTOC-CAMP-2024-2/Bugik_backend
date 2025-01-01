import request from 'supertest';
import app from '../src/app';

describe('User Registration and Login Flow', () => {
  let email = `testuser${Date.now()}@example.com`;
  let nickname = `testuser${Date.now()}`;
  let verificationCode = '';

  it('should check if the email is not taken', async () => {
    const response = await request(app).get(`/api/v1/auth/checkEmail/${email}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`There is no User whose email is ${email}`);
  });

  it('should send a verification code to the email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/email/auth')
      .send({ email });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Verification email sent.');
  });

  it('should retrieve the verification code from the database', async () => {
    verificationCode = '123456'; // Example code
  });

  it('should verify the email using the verification code', async () => {
    const response = await request(app)
      .post('/api/v1/auth/email/verify')
      .send({ email, code: verificationCode });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email verified successfully.');
  });

  it('should check if the nickname is not taken', async () => {
    const response = await request(app).get(`/api/v1/auth/checkUsername/${nickname}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`There is no User whose nickname is ${nickname}`);
  });

  it('should register the user with email and nickname', async () => {
    const response = await request(app)
      .post('/api/v1/auth/email')
      .send({ email, nickname, college: 'Test University' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should log in the user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email, nickname });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});
