"use client";

import React from "react";
import Link from "next/link";
import { useTestNavigation } from "@/components/contexts/TestNavigationContext";

interface ProtectedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  href,
  children,
  className,
  title,
  ...props
}) => {
  const { isTestActive, requestNavigation } = useTestNavigation();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isTestActive) {
      // Show warning dialog and wait for user decision
      await requestNavigation(href);
    } else {
      // Navigate normally using Next.js router
      window.location.href = href;
    }
  };

  return (
    <Link
      href={href}
      className={className}
      title={title}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ProtectedLink;
