import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollProgress />
      <Navbar />
      <main className="pt-16 flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
