import * as colors from 'colors';
import * as request from 'request';

const apiUrl = 'http://localhost:4040';

const callPlans = () => {
  request.get(
    `${apiUrl}/plans`,
    (err: any, req: request.Response, body: any) => {
      console.log(JSON.stringify(body));
    }
  );
};

console.log(`\n${colors.bgBlue(colors.bold('--API Testing CLI--'))}\n`);
callPlans();
