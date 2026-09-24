import type { ReactNode } from "react";
import styles from "./layout.module.css";

export default function FarmerLayout({ children }: { children: ReactNode }) {
  return <div className={styles.farmerRoot}>{children}</div>;
}
