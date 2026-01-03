'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { siteConfig, featuresConfig } from '@/config';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Heart, Search } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useCartStore } from '@/store/cartStore';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Для избежания hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemsCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-primary">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-fast
                  ${
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-text-muted hover:text-text'
                  }`}
              >
                {t(item.label.replace('nav.', ''))}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            {featuresConfig.search && (
              <button
                className="p-2 text-text-muted hover:text-text transition-colors"
                aria-label={t('search') || 'Search'}
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist */}
            {featuresConfig.wishlist && (
              <Link
                href="/wishlist"
                className="p-2 text-text-muted hover:text-text transition-colors hidden sm:block"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            {featuresConfig.cart.enabled && (
              <Link
                href="/cart"
                className="p-2 text-text-muted hover:text-text transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-text-inverse text-xs rounded-full flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              className="p-2 md:hidden text-text-muted hover:text-text"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium transition-colors
                    ${
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-text-muted hover:text-text'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.label.replace('nav.', ''))}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
