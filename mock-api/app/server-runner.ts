import { App } from './app';
import { Server } from 'http';

/**
 * Simple IoC container for running a server, for use with Jasmine tests & serving via ts-node.
 *
 * @param port the port the server will run on
 * @param useReporters toggle console reporters (requests & their statuses will be logged to the console)
 * @param callback for use with Jasmine, see https://gist.github.com/vladimirze/960d8c721455333a154fa1f73b412d51
 */
export const serverRunner = (
  port: number,
  useReporters: boolean,
  callback?
): Server => {
  const app = new App(useReporters);
  return app.express.listen(port, function() {
    console.log(`Express server listening on port ${port}`);
    if (callback) {
      callback();
    }
  });
};
