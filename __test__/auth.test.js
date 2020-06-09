'use strict';

const bearer = require('../src/middleware/bearer-middle');
describe('bearer', () => {
  it('Invokes next() with a masseage invalid token authorization headers arent provided', () => {
    const req ={
      headers:{

      },
    };
    const res = {};
    const next = jest.fn();
    bearer(req, res, next);
    expect(next).toHaveBeenCalledWith('User is not loggedin');
  });

}); 