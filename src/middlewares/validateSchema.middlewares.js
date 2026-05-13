import { ZodError } from 'zod';

export const validateSchema = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const detailedErrors = {};

      for (const issue of error.issues) {
        const path = issue.path.reduce((acc, key) => {
          if (typeof key === 'number') return `${acc}[${key}]`;
          return acc ? `${acc}.${key}` : key;
        }, '');

        if (!detailedErrors[path]) detailedErrors[path] = [];
        detailedErrors[path].push(issue.message);
      }
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
