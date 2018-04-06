describe('A suite is just a function', function() {
  var a;

  it('and so is a spec', function() {
    a = false;

    expect(a).toBe(false);
  });
});
