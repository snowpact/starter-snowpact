import { Footer } from '@/components/organisms/Footer';
import { Navbar } from '@/components/organisms/Navbar';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Navbar />
      <main className="flex-grow mt-18 md:mt-20">{children}</main>
      <Footer />
    </div>
  );
};
