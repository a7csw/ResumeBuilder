# 🔗 NovaCV Frontend-Backend Integration Guide

## 🎯 Complete Integration Steps for Your React Frontend

This guide shows you exactly how to connect your existing NovaCV React frontend with the new Node.js backend that includes Paddle payment integration.

---

## 📋 Integration Checklist

### ✅ **Backend Setup Complete**
- [x] Node.js Express server with Paddle integration
- [x] MongoDB database models
- [x] Authentication with JWT
- [x] Payment processing with webhooks
- [x] Comprehensive API endpoints
- [x] Security middleware and validation

### 🔧 **Frontend Integration Tasks**
- [ ] Update environment variables
- [ ] Replace Lemon Squeezy with Paddle API calls
- [ ] Update authentication service
- [ ] Integrate payment checkout flow
- [ ] Update user profile management
- [ ] Connect subscription management

---

## 🔧 Frontend Environment Configuration

Update your frontend `.env` file:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_STORAGE_KEY=novacv_token
VITE_REFRESH_TOKEN_KEY=novacv_refresh_token

# Frontend URLs (for Paddle redirects)
VITE_APP_URL=http://localhost:3000
VITE_SUCCESS_URL=http://localhost:3000/payment-success
VITE_CANCEL_URL=http://localhost:3000/pricing

# Environment
VITE_ENVIRONMENT=development
```

---

## 📡 API Service Layer

Create or update `src/services/api.ts`:

```typescript
/**
 * API Service for NovaCV Backend Integration
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'novacv_token');
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth Methods
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(refreshToken?: string) {
    return this.request('/users/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/users/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User Profile Methods
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getDashboard() {
    return this.request('/users/dashboard');
  }

  // Payment Methods
  async getPlans() {
    return this.request('/payments/plans');
  }

  async createCheckout(checkoutData: {
    planId: string;
    userId: string;
    successUrl?: string;
    cancelUrl?: string;
  }) {
    return this.request('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
  }

  async getSubscription() {
    return this.request('/payments/subscription');
  }

  async cancelSubscription() {
    return this.request('/payments/subscription/cancel', {
      method: 'POST',
    });
  }

  async getPaymentHistory(page = 1, limit = 10) {
    return this.request(`/payments/history?page=${page}&limit=${limit}`);
  }

  async getFeatureAccess() {
    return this.request('/payments/features');
  }

  async verifyPayment(paymentData: {
    checkoutId?: string;
    subscriptionId?: string;
  }) {
    return this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
```

---

## 🔐 Authentication Hook

Update `src/hooks/useAuth.ts`:

```typescript
/**
 * Authentication Hook with Backend Integration
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  subscription: {
    plan: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    autoRenew: boolean;
  };
  isEmailVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load user from token on mount
  useEffect(() => {
    loadUserFromToken();
  }, []);

  const loadUserFromToken = async () => {
    try {
      const token = localStorage.getItem('novacv_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await apiService.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to load user from token:', error);
      localStorage.removeItem('novacv_token');
      localStorage.removeItem('novacv_refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens
        localStorage.setItem('novacv_token', tokens.accessToken);
        localStorage.setItem('novacv_refresh_token', tokens.refreshToken);
        
        // Set user
        setUser(user);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens
        localStorage.setItem('novacv_token', tokens.accessToken);
        localStorage.setItem('novacv_refresh_token', tokens.refreshToken);
        
        // Set user
        setUser(user);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('novacv_refresh_token');
      await apiService.logout(refreshToken || undefined);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless
      localStorage.removeItem('novacv_token');
      localStorage.removeItem('novacv_refresh_token');
      setUser(null);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await apiService.updateProfile(profileData);
      
      if (response.success && response.data) {
        setUser(prev => prev ? { ...prev, ...response.data.user } : null);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const refreshAuth = async () => {
    await loadUserFromToken();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 💳 Payment Integration

Update `src/services/paymentService.ts`:

```typescript
/**
 * Payment Service with Paddle Backend Integration
 */

import { apiService } from './api';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number;
  recurring?: boolean;
  features: {
    aiGenerations: number;
    templates: number;
    exports: string[];
    customization: string;
    support: string;
    watermark: boolean;
    analytics?: boolean;
    atsOptimization?: boolean;
  };
}

export interface Subscription {
  plan: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  daysRemaining: number;
  features: Record<string, any>;
  usage: {
    aiGenerations: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
  paddle?: {
    subscriptionId: string;
    customerId: string;
    nextBillDate: string | null;
    nextBillAmount: number;
    currency: string;
    billingType: string;
  };
}

class PaymentService {
  async getPlans(): Promise<Plan[]> {
    try {
      const response = await apiService.getPlans();
      return response.data?.plans || [];
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      throw error;
    }
  }

  async initiateCheckout(planId: string, userId: string): Promise<string> {
    try {
      const checkoutData = {
        planId,
        userId,
        successUrl: `${window.location.origin}/payment-success?plan=${planId}`,
        cancelUrl: `${window.location.origin}/pricing`,
      };

      const response = await apiService.createCheckout(checkoutData);
      
      if (response.success && response.data?.checkoutUrl) {
        return response.data.checkoutUrl;
      } else {
        throw new Error('Failed to generate checkout URL');
      }
    } catch (error) {
      console.error('Checkout initiation failed:', error);
      throw error;
    }
  }

  async getSubscription(): Promise<Subscription | null> {
    try {
      const response = await apiService.getSubscription();
      return response.data || null;
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      return null;
    }
  }

  async cancelSubscription(): Promise<void> {
    try {
      const response = await apiService.cancelSubscription();
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      throw error;
    }
  }

  async getFeatureAccess(): Promise<Record<string, boolean>> {
    try {
      const response = await apiService.getFeatureAccess();
      return response.data?.features || {};
    } catch (error) {
      console.error('Failed to fetch feature access:', error);
      return {};
    }
  }

  async verifyPayment(checkoutId?: string, subscriptionId?: string): Promise<boolean> {
    try {
      const response = await apiService.verifyPayment({
        checkoutId,
        subscriptionId,
      });
      return response.data?.verified || false;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  async getPaymentHistory(page = 1, limit = 10) {
    try {
      const response = await apiService.getPaymentHistory(page, limit);
      return response.data || { history: [], pagination: {} };
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return { history: [], pagination: {} };
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
```

---

## 🔄 Update Existing Components

### **1. Update Authentication Page**

In `src/pages/Auth.tsx`, replace the existing authentication logic:

```typescript
// Replace existing auth logic with:
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const { login, register, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({ title: "Welcome Back!", description: "Successfully signed in." });
      navigate('/form-selection');
    } catch (error: any) {
      toast({ 
        title: "Sign In Failed", 
        description: error.message || "Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    
    try {
      await register({ firstName, lastName, email, password, confirmPassword });
      toast({ title: "Account Created!", description: "Welcome to NovaCV!" });
      navigate('/form-selection');
    } catch (error: any) {
      toast({ 
        title: "Sign Up Failed", 
        description: error.message || "Please try again.", 
        variant: "destructive" 
      });
    }
  };

  // ... rest of component
};
```

### **2. Update Pricing Page**

In `src/pages/Pricing.tsx`, replace Lemon Squeezy integration:

```typescript
// Replace existing payment logic with:
import { paymentService } from '@/services/paymentService';
import { useAuth } from '@/hooks/useAuth';

const Pricing = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (planId: "basic" | "pro") => {
    try {
      if (!isAuthenticated || !user) {
        navigate(`/auth?redirect=pricing`);
        return;
      }

      const checkoutUrl = await paymentService.initiateCheckout(planId, user.id);
      
      // Redirect to Paddle checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error('Error initiating checkout:', error);
      toast({ 
        title: "Payment Error", 
        description: error.message || "Failed to start checkout process.", 
        variant: "destructive" 
      });
    }
  };

  // ... rest of component
};
```

### **3. Update Profile Components**

Update your profile components to use the new API:

```typescript
// In ProfileSubscriptionCard.tsx
import { useEffect, useState } from 'react';
import { paymentService, Subscription } from '@/services/paymentService';

const ProfileSubscriptionCard = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const sub = await paymentService.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription || subscription.status !== 'active') {
      navigate('/pricing');
      return;
    }
    
    navigate('/subscription-details');
  };

  // ... rest of component
};
```

---

## 🚀 Frontend App Integration

Update your main `src/App.tsx`:

```typescript
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// ... other imports

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="novacv-theme">
          <Toaster />
          <BrowserRouter>
            {/* Your existing routes */}
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
```

---

## 🧪 Testing the Integration

### **1. Start Both Servers**

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)  
cd ..  # Go back to ResumeBuilder root
npm run dev
```

### **2. Test Authentication Flow**

1. Navigate to `http://localhost:3000/auth`
2. Register a new account
3. Verify successful login and redirect
4. Check browser network tab for API calls

### **3. Test Payment Flow**

1. Navigate to `http://localhost:3000/pricing`
2. Click on a plan (while signed in)
3. Verify Paddle checkout URL generation
4. Test the full checkout flow

### **4. Test Profile Management**

1. Navigate to `http://localhost:3000/profile`
2. Verify subscription details display
3. Test profile updates

---

## 🔧 Environment Setup

### **Development**
```bash
# Backend
PADDLE_ENVIRONMENT=sandbox
PADDLE_VENDOR_ID=your-sandbox-vendor-id

# Frontend
VITE_API_URL=http://localhost:5000/api/v1
```

### **Production**
```bash
# Backend
PADDLE_ENVIRONMENT=production
PADDLE_VENDOR_ID=your-live-vendor-id

# Frontend
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 🎯 Final Integration Checklist

### **Frontend Changes**
- [ ] Install new dependencies if needed
- [ ] Update environment variables
- [ ] Replace API service layer
- [ ] Update authentication hook
- [ ] Update payment service
- [ ] Update all components using old services
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Test profile management

### **Backend Verification**
- [ ] Backend server running on port 5000
- [ ] MongoDB connected successfully
- [ ] Paddle webhook endpoint accessible
- [ ] All API endpoints responding correctly
- [ ] Environment variables configured
- [ ] Logs showing successful operations

### **Integration Testing**
- [ ] User registration works
- [ ] User login works
- [ ] Profile updates work
- [ ] Plan selection works
- [ ] Paddle checkout generation works
- [ ] Subscription management works
- [ ] Feature access control works

---

## 🎉 Congratulations!

Your NovaCV app now has a **complete backend integration** with:

✅ **Professional Authentication System**
✅ **Paddle Payment Processing**  
✅ **Real User & Subscription Management**
✅ **Feature Access Control**
✅ **Comprehensive API Integration**

Your app is now ready for **real users and real payments**! 🚀💰

---

**Next Steps:**
1. Deploy backend to production
2. Configure live Paddle account
3. Update frontend environment for production
4. Launch your resume builder platform!

**Happy launching! 🎊**
