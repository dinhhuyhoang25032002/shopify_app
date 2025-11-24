import * as Yup from "yup";
import { APPLY_TYPE, DISCOUNT_TYPE, STATUS_RULES } from "../../const";

export const ruleSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  status: Yup.string()
    .oneOf([STATUS_RULES.ENABLE, STATUS_RULES.DISABLE])
    .required(),
  priority: Yup.number().typeError("Priority must be a number")
  .min(1, "Priority must be greater than 0"),

  apply: Yup.string().oneOf([APPLY_TYPE.ALL, APPLY_TYPE.TAGS]).required(),

  tags: Yup.array().when("apply", {
    is: APPLY_TYPE.TAGS,
    then: (schema) =>
      schema.min(1, "At least 1 tag must be selected for Tag mode"),
  }),

  type: Yup.string()
    .oneOf(Object.values(DISCOUNT_TYPE))
    .required("Discount type is required"),

  value: Yup.number()
    .typeError("Value must be a number")
    .when("type", {
      is: DISCOUNT_TYPE.PERCENT,
      then: (schema) =>
        schema
          .min(1, "Percent must be at least 1%")
          .max(100, "Percent cannot exceed 100%"),
      otherwise: (schema) =>
        schema.min(0, "Value must be greater than or equal to 0"),
    }),
});
