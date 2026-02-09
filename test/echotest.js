const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
chai.should();

describe('echo server', () => {

  it('should echo plain text and preserve content-type', (done) => {
    const payload = 'hello world';

    chai.request(app)
      .post('/')
      .set('Content-Type', 'text/plain')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(200);
        res.headers['content-type'].should.include('text/plain');
        res.text.should.equal(payload);
        done();
      });
  });

  it('should echo json and preserve application/json content-type', (done) => {
    const payload = JSON.stringify({ message: 'hello json' });

    chai.request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(payload)
      .end((err, res) => {
        res.should.have.status(200);
        res.headers['content-type'].should.include('application/json');
        res.text.should.equal(payload);
        done();
      });
  });

  it('should default to text/plain when no content-type is provided', (done) => {
    const payload = 'no content type';
  
    chai.request(app)
      .post('/')
      .send(payload)
      .unset('Content-Type')   // <-- key line: removes the auto header
      .end((err, res) => {
        if (err) return done(err);
  
        try {
          res.should.have.status(200);
          res.headers['content-type'].should.include('text/plain');
          res.text.should.equal(payload);
          return done();
        } catch (e) {
          return done(e);
        }
      });
  });

  it('should handle empty body with default text/plain content-type', (done) => {
    chai.request(app)
      .post('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.headers['content-type'].should.include('text/plain');
        res.text.should.equal('');
        done();
      });
  });

});