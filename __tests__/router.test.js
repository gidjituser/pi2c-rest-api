import request from 'supertest-as-promised';
import Api from '../src/Api';

const app = new Api().express;

describe('PI2c Rest API', () => {
  describe('GET /api/v1/version - version', () => {
    it('should return object', () => {
      return request(app).get('/api/v1/version')
      .expect(200)
      .then(res => {
        // check that it sends back an array
        expect(res.body).toBeInstanceOf(Object);
      });
    });
  });
  it('should return objs w/ correct props', () => {
    return request(app).get('/api/v1/version')
    .expect(200)
    .then(res => {
      // check for the expected properties
      let expectedProps = ['version'];
      let sampleKeys = Object.keys(res.body);
      expectedProps.forEach((key) => {
        expect(sampleKeys.includes(key)).toBe(true);
      });
    });
  });
});
