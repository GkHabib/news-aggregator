import type { ComponentProps } from "react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { cx } from "@/utils/cx";
import {
  iconButtonClassName,
  type IconButtonStyleProps,
} from "@/components/IconButton/iconButtonClassName";

interface IconButtonProps extends IconButtonStyleProps, ComponentProps<"button"> {
  icon: IconName;
  /** Required: the button has no visible text. */
  label: string;
}

/** 44px round icon-only button (36px filled variant for in-field actions). */
export function IconButton({ icon, label, tone, size, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(iconButtonClassName({ tone, size }), className)}
      {...rest}
    >
      <Icon name={icon} size={size === "small" ? 16 : 20} />
    </button>
  );
}
