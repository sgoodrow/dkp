import { FieldMeta } from "@tanstack/react-form";

export const getHelperText = ({
  field,
  helperText,
}: {
  field: {
    state: { meta: FieldMeta };
  };
  helperText?: string;
}) => {
  const error = getErrored(field.state.meta, true);
  return {
    error,
    helperText: error ? field.state.meta.errors.join(",") : helperText,
  };
};

export const getErrored = (meta?: FieldMeta, requiredTouched?: boolean) => {
  const errors = !!meta?.errors?.length;
  return requiredTouched ? meta?.isTouched && errors : errors;
};
