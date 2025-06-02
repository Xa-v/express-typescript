// module.exports = validateRequest;
export default validateRequest;

function validateRequest(err: any, req: any, res: any, next: any, schema: any) {
  const options = {
    abortEarly: false, 
    allowUnknown: true, 
    stripUnknown: true 
  };
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(`Validation error: ${error.details.map((x: { message: any; }) => x.message).join(', ')}`);
  }
  else {
    req.body = value;
    next();
  }
}