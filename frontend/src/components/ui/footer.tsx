import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            © {currentYear} NOVAECV. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;