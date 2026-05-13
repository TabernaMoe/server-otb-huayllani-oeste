import { ZodError } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const detailedErrors = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      console.log(detailedErrors);
      return res.status(400).json({
        ok: false,
        message: 'Errores de validación',
        errors: detailedErrors,
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno al validar los datos',
    });
  }
};
