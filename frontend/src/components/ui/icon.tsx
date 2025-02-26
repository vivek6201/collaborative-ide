import { LucideProps } from "lucide-react";
import React from "react";

export const Icon = ({
  name,
  size = 16,
  className,
  ...props
}: {
  name: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  size?: number;
  className?: string;
}) => {
  return React.createElement(name, {
    width: size,
    height: size,
    className: className || "",
    ...props,
  });
};
