/**
 * See this GitHub issue for why this function is necessary: https://github.com/jasmine/jasmine-npm/issues/31
 */
export const finishTest = done => {
  return function(err) {
    if (err) {
      done.fail(err);
    } else {
      done();
    }
  };
};
