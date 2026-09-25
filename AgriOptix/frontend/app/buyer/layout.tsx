import type { ReactNode } from "react";
import "./tailwind.css";

export default function BuyerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div data-buyer-app>{children}</div>;
}
