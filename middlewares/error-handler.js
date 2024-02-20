const errorHandlerMiddleware = (err, req, res, next) => {
  let errors = {
    msg: "Something went wrong!",
    statusCode: 403,
  };

  console.log(err);

  if (err.name === "ValidationError") {
    errors.validationError = Object.values(err.errors).reduce((acc, item) => {
      acc[item.path] = item.message;
      return acc;
    }, {});
    errors.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    errors.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    errors.statusCode = 400;
  }

  if (err.name === "CastError") {
    errors.msg = `No item found with id : ${err.value}`;
    errors.statusCode = 404;
  }

  return res.status(403).json({ ...errors });
};

module.exports = errorHandlerMiddleware;
