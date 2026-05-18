"use client";

import PropTypes from "prop-types";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({ label, htmlFor, children, className }) {
  return (
    <div className={cn("form-field", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
