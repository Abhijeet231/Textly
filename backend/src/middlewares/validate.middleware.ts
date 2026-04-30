import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validate = (schema: z.ZodType, target: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {

    const source = target === "body" ? req.body : target === "query" ? req.query : req.params;

    const result = schema.safeParse(source);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: z.treeifyError(result.error)
      });
      return;
    }

    if (target === "body") {
      req.body = result.data;
    } else if (target === "query") {
      Object.assign(req.query, result.data);
    } else if (target === "params") {
      Object.assign(req.params, result.data);
    }

    next();
  };
};

export default validate;