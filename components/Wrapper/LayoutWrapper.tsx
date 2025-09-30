import { NextPage } from "next";

interface Props {
  children: React.ReactNode;
  className?: string | "";
}
const LayoutWrapper: NextPage<Props> = ({ children, className }) => {
  return (
    <div className={`container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-12 2xl:px-16 overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
};

export default LayoutWrapper;
