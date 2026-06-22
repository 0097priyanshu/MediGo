import { RequestHandler } from "express";
import { DemoResponse } from "../shared/api";

export const handleDemo= (req, res) => {
  const response= {
    message,
  };
  res.status(200).json(response);
};
