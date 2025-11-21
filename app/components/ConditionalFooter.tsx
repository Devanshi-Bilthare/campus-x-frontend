'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAuthPage || isAdminPage) {
    return null;
  }

  return <Footer />;
}

