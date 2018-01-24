'use strict';

module.exports[404] = function pageNotFound(req, res) {
  var viewFilePath = '404',
    statusCode = 404,
    result = {
      status: statusCode
    };

  res.status(result.status);
  res.render(viewFilePath, {}, function(err, html) {
    if (err) {
      return res.status(result.status).json(result);
    }

    res.send(html);
  });
};
