import type { ComponentProps } from "react";
import { Icon } from "@/components/Icon/Icon";
import { cx } from "@/utils/cx";
import { buttonClassName, type ButtonStyleProps } from "@/components/Button/buttonClassName";

type ButtonProps = ButtonStyleProps & ComponentProps<"button">;

export function Button({ variant, size, icon, block, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(buttonClassName({ variant, size, icon, block }), className)}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}
