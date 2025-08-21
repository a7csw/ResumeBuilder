/**
 * Analytics and Tracking
 * 
 * Centralized analytics implementation with privacy-focused tracking.
 * Ready for Google Analytics 4, Plausible, or other analytics providers.
 */

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

interface ConversionEvent {
  event: 'page_view' | 'signup' | 'subscription_start' | 'subscription_success' | 'template_select' | 'export_resume';
  value?: number;
  currency?: string;
  user_id?: string;
  plan_type?: string;
  template_id?: string;
}

class Analytics {
  private enabled: boolean = false;
  private userId?: string;

  constructor() {
    // Enable analytics only in production and if consent is given
    this.enabled = import.meta.env.VITE_ENVIRONMENT === 'production';
  }

  /**
   * Initialize analytics with user consent
   */
  init(hasConsent: boolean = false) {
    if (!hasConsent || !this.enabled) {
      this.enabled = false;
      return;
    }

    // Initialize Google Analytics 4 (if GA_MEASUREMENT_ID is provided)
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId && typeof window !== 'undefined') {
      // Load GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      
      gtag('js', new Date());
      gtag('config', gaId, {
        privacy_mode: true,
        anonymize_ip: true,
      });

      // Make gtag available globally
      (window as any).gtag = gtag;
    }

    // Initialize Plausible (if enabled)
    const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (plausibleDomain && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.domain = plausibleDomain;
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }

    console.log('Analytics initialized');
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string) {
    this.userId = userId;
    
    if (this.enabled && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId,
      });
    }
  }

  /**
   * Track page views
   */
  pageView(path: string, title?: string) {
    if (!this.enabled) return;

    console.log('Page view:', { path, title });

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.origin + path,
        page_path: path,
      });
    }

    // Plausible
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview');
    }
  }

  /**
   * Track conversion events
   */
  trackConversion(event: ConversionEvent) {
    if (!this.enabled) return;

    console.log('Conversion event:', event);

    const eventData = {
      ...event,
      user_id: this.userId,
      timestamp: new Date().toISOString(),
    };

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        value: event.value,
        currency: event.currency || 'USD',
        user_id: this.userId,
        custom_parameters: {
          plan_type: event.plan_type,
          template_id: event.template_id,
        },
      });
    }

    // Plausible
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(event.event, {
        props: {
          plan_type: event.plan_type,
          template_id: event.template_id,
          value: event.value,
        },
      });
    }

    // Custom analytics endpoint (optional)
    this.sendToCustomEndpoint(eventData);
  }

  /**
   * Track custom events
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.enabled) return;

    console.log('Custom event:', event);

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, event.parameters);
    }

    // Plausible
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(event.name, { props: event.parameters });
    }
  }

  /**
   * Send events to custom analytics endpoint
   */
  private async sendToCustomEndpoint(eventData: any) {
    try {
      // Optional: Send to your own analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData),
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
}

// Singleton instance
export const analytics = new Analytics();

// Convenience functions
export const trackPageView = (path: string, title?: string) => analytics.pageView(path, title);
export const trackConversion = (event: ConversionEvent) => analytics.trackConversion(event);
export const trackEvent = (event: AnalyticsEvent) => analytics.trackEvent(event);

// Declare global gtag for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    plausible: (event: string, options?: any) => void;
  }
}

export default analytics;
