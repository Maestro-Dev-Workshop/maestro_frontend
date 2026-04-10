import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { HttpBaseService } from '../http-base.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttpService: jasmine.SpyObj<HttpBaseService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
  };

  const mockLoginResponse = {
    message: 'Login successful',
    user: mockUser,
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456',
  };

  beforeEach(() => {
    mockHttpService = jasmine.createSpyObj('HttpBaseService', ['get', 'post', 'put', 'delete']);

    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpBaseService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('signup', () => {
    it('should call POST auth/sign-up with user data', () => {
      const signupData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const mockResponse = { message: 'Signup successful', user: mockUser };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.signup(signupData).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/sign-up', signupData);
    });
  });

  describe('login', () => {
    it('should call POST auth/login with credentials', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      mockHttpService.post.and.returnValue(of(mockLoginResponse));

      service.login(credentials).subscribe((result) => {
        expect(result).toEqual(mockLoginResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/login', credentials);
    });
  });

  describe('googleAuth', () => {
    it('should call POST auth/google with token', () => {
      const googleToken = 'google-oauth-token';
      mockHttpService.post.and.returnValue(of(mockLoginResponse));

      service.googleAuth(googleToken).subscribe((result) => {
        expect(result).toEqual(mockLoginResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/google', { token: googleToken });
    });
  });

  describe('refreshAccessToken', () => {
    it('should call POST auth/refresh-token', () => {
      const mockResponse = { message: 'Token refreshed', accessToken: 'new-access-token' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.refreshAccessToken().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/refresh-token', {});
    });
  });

  describe('verifyEmail', () => {
    it('should call POST auth/verify-email with token', () => {
      const mockResponse = { message: 'Email verified' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.verifyEmail('verification-token').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/verify-email', { token: 'verification-token' });
    });
  });

  describe('resendVerificationEmail', () => {
    it('should call POST auth/resend-verification with email', () => {
      const mockResponse = { message: 'Verification email sent' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.resendVerificationEmail('test@example.com').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/resend-verification', { email: 'test@example.com' });
    });
  });

  describe('forgotPassword', () => {
    it('should call POST auth/forgot-password with email', () => {
      const mockResponse = { message: 'Reset email sent' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.forgotPassword('test@example.com').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/forgot-password', { email: 'test@example.com' });
    });
  });

  describe('resetPassword', () => {
    it('should call POST auth/reset-password with token and new password', () => {
      const mockResponse = { message: 'Password reset successful' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.resetPassword('reset-token', 'newPassword123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('auth/reset-password', {
        reset_token: 'reset-token',
        new_password: 'newPassword123',
      });
    });
  });

  describe('logout', () => {
    it('should clear all storage items', () => {
      localStorage.setItem('accessToken', 'token');
      localStorage.setItem('refreshToken', 'refresh');
      localStorage.setItem('userEmail', 'email');
      sessionStorage.setItem('maestro-feedback-banner-dismissed', 'true');

      service.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('userEmail')).toBeNull();
      expect(sessionStorage.getItem('maestro-feedback-banner-dismissed')).toBeNull();
    });
  });

  describe('accessToken getter', () => {
    it('should return access token from localStorage', () => {
      localStorage.setItem('accessToken', 'my-token');

      expect(service.accessToken).toBe('my-token');
    });

    it('should return null when no token exists', () => {
      expect(service.accessToken).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorage.setItem('accessToken', 'my-token');

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('storeTokens', () => {
    it('should store access and refresh tokens in localStorage', () => {
      service.storeTokens({
        user: mockUser,
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
      });

      expect(localStorage.getItem('accessToken')).toBe('access-123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-456');
    });
  });
});
