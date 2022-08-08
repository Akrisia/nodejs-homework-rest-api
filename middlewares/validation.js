const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      next(error);
    }
    next();
  };
};

const favoriteValidation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      error.message = "Missing field favorite";
      next(error);
    }
    next();
  };
};

const subscriptionValidation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      error.message = "Missing field subscription";
      next(error);
    }
    next();
  };
};

module.exports = {
  validation,
  favoriteValidation,
  subscriptionValidation,
};
