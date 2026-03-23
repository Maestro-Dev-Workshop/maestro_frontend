import { TestBed } from '@angular/core/testing';
import { SubscriptionService } from '../subscription.service';
import { HttpBaseService } from '../http-base.service';
import { of } from 'rxjs';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let mockHttpService: jasmine.SpyObj<HttpBaseService>;

  const mockPlan = {
    code: 'premium-monthly',
    name: 'Premium Monthly',
    price: 999,
    currency: 'NGN',
    features: ['Unlimited lessons', 'Priority support'],
  };

  const mockSubscription = {
    id: 'sub-123',
    plan_code: 'premium-monthly',
    status: 'active',
    expires_at: '2024-12-31',
  };

  beforeEach(() => {
    mockHttpService = jasmine.createSpyObj('HttpBaseService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        SubscriptionService,
        { provide: HttpBaseService, useValue: mockHttpService },
      ],
    });

    service = TestBed.inject(SubscriptionService);
  });

  describe('getPlans', () => {
    it('should call GET subscriptions/plans', () => {
      const mockResponse = { plans: [mockPlan] };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getPlans().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subscriptions/plans');
    });
  });

  describe('getSinglePlan', () => {
    it('should call GET subscriptions/plans/:planCode', () => {
      const mockResponse = { plan: mockPlan };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getSinglePlan('premium-monthly').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subscriptions/plans/premium-monthly');
    });

    it('should handle different plan codes', () => {
      const mockResponse = { plan: { ...mockPlan, code: 'basic-yearly' } };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getSinglePlan('basic-yearly').subscribe();

      expect(mockHttpService.get).toHaveBeenCalledWith('subscriptions/plans/basic-yearly');
    });
  });

  describe('subscribe', () => {
    it('should call POST subscriptions with planCode', () => {
      const mockResponse = {
        authorization_url: 'https://paystack.com/pay/abc123',
        reference: 'ref-123',
      };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.subscribe('premium-monthly').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('subscriptions', { planCode: 'premium-monthly' });
    });
  });

  describe('verifyTransaction', () => {
    it('should call POST subscriptions/verify with reference', () => {
      const mockResponse = { status: 'success', subscription: mockSubscription };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.verifyTransaction('ref-123').subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith('subscriptions/verify', { reference: 'ref-123' });
    });

    it('should handle verification failure', () => {
      const mockResponse = { status: 'failed', message: 'Transaction not found' };
      mockHttpService.post.and.returnValue(of(mockResponse));

      service.verifyTransaction('invalid-ref').subscribe((result: any) => {
        expect(result.status).toBe('failed');
      });
    });
  });

  describe('getSubscription', () => {
    it('should call GET subscriptions', () => {
      const mockResponse = { subscription: mockSubscription };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getSubscription().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subscriptions');
    });
  });

  describe('cancel', () => {
    it('should call DELETE subscriptions', () => {
      const mockResponse = { message: 'Subscription cancelled' };
      mockHttpService.delete.and.returnValue(of(mockResponse));

      service.cancel().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.delete).toHaveBeenCalledWith('subscriptions');
    });
  });

  describe('manageSubscription', () => {
    it('should call GET subscriptions/manage-link', () => {
      const mockResponse = { manage_url: 'https://paystack.com/manage/abc123' };
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.manageSubscription().subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('subscriptions/manage-link');
    });
  });
});
