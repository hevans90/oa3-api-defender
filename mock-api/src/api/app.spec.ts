import * as request from 'supertest';
import { Server } from 'http';
import { finishTest } from '../../spec/tools/finish-test';

import { App } from './app';
import { serverRunner } from './server-runner';

describe('App', function() {
  let server: Server;
  const port = 3000;

  beforeEach(done => {
    console.log(`\nRestarting server...`);
    server = serverRunner(port, false, done);
  });

  afterEach(done => {
    server.close(done);
  });

  it('should respond 404 to unknown routes', done => {
    request(server)
      .get('/nonsense_route')
      .expect(404, finishTest(done));
  });

  describe('/plans', () => {
    it('should respond 200', done => {
      request(server)
        .get('/plans')
        .expect(200, finishTest(done));
    });
  });
});
