import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Medical Equipment Suppliers | Pacwest",
  description: "Get in touch with Pacwest for inquiries, orders, or support related to high-quality medical equipment and surgical instruments. We’re here to help!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
      <div className="z-50 fixed bottom-5 right-5  ">
      </div>
    </div>
  );
}
