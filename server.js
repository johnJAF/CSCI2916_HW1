const express = require('express');

const app = express();

app.use((req, res, next) => {
    if (!req.headers['content-type']) {
      req.headers['content-type'] = 'text/plain';
    }
    next();
  });

// capture all raw bodies regardless of content-type
app.use(express.raw({ type: '*/*' }));

app.post('/', (req, res) => {
  const contentType = req.headers['content-type'] || 'text/plain';

  res.set('Content-Type', contentType);

  // req.body will be a Buffer (or undefined)
  if (!req.body || req.body.length === 0) {
    return res.send();
  }

  return res.send(req.body);
});

// export for testing
module.exports = app;

// start server only if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`echo server listening on port ${PORT}`);
  });
}