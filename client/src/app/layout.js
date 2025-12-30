import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Toaster } from 'react-hot-toast';

const fontMain = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "ZansMarket | Premium Tech Gear",
  description: "Experience the next generation of e-commerce.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontMain.variable} antialiased bg-black text-gray-100 min-h-screen flex flex-col selection:bg-blue-500 selection:text-white font-sans`}
      >
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            duration: 3000,
          }}
        />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 fade-in">
              {children}
            </main>
            <footer className="bg-[#050505] border-t border-white/10 text-gray-400 py-10">
              <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-white font-bold mb-4">ZansMarket</h3>
                  <p className="text-sm leading-relaxed">Premium technology for professional users. Elevate your setup today.</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Shop</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Latest Arrivals</li>
                    <li>Best Sellers</li>
                    <li>Deals</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Help Center</li>
                    <li>Shipping Status</li>
                    <li>Returns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Connect</h4>
                  <div className="flex space-x-4">
                    {/* Social placeholders */}
                    <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12 pt-8 border-t border-white/5 text-sm">
                &copy; {new Date().getFullYear()} ZansMarket Inc. All Rights Reserved.
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
