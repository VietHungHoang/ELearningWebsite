import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { CurrencyService } from './currency.service';

export interface Voucher {
  id: string;
  voucherId?: string;
  code: string;
  description?: string;
  createdBy: 'Admin' | 'Instructor';
  creatorName: string;
  productType: string;
  targetAudience?: 'all' | 'top-spenders' | 'new-students' | 'no-spending-1month'; // New field: target student segment
  value: string;
  scope: string;
  usage: string;
  date: string;
  status: 'active' | 'expired' | 'paused' | 'upcoming';
  discountType?: string;
  discountValue?: string;
  maxDiscount?: string;
  minOrderValue?: number;
  totalUsageLimit?: number;
  usagePerUser?: number;
  startDate?: string;
  endDate?: string;
  isUnlimited?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private vouchersSubject = new BehaviorSubject<Voucher[]>([]);
  private mockVouchers: Voucher[] = [
    {
      id: '1',
      voucherId: 'VOI-2025-001',
      code: 'BLACKFRIDAY',
      createdBy: 'Admin',
      creatorName: 'Admin',
      productType: 'All Products',
      targetAudience: 'all',
      value: '30% off (Max 200k)',
      scope: 'All Products',
      usage: '150/500',
      date: '11/11 - 15/11',
      status: 'active'
    },
    {
      id: '2',
      voucherId: 'VOI-2025-002',
      code: 'JSDETHA',
      createdBy: 'Instructor',
      creatorName: 'Inst: A.Nguyen',
      productType: 'Classes',
      targetAudience: 'top-spenders',
      value: '50% off (Max 500k)',
      scope: 'Instructor Package',
      usage: '25/1000',
      date: '01/11 - 30/11',
      status: 'active'
    },
    {
      id: '3',
      voucherId: 'VOI-2025-003',
      code: 'WELCOME10',
      createdBy: 'Admin',
      creatorName: 'Admin',
      productType: 'Classes',
      targetAudience: 'new-students',
      value: '100,000 VND off',
      scope: 'Category: Marketing',
      usage: '5/1000',
      date: '(Unlimited)',
      status: 'active'
    },
    {
      id: '4',
      voucherId: 'VOI-2025-004',
      code: 'TUTOR_B',
      createdBy: 'Instructor',
      creatorName: 'Inst: B.Tran',
      productType: '1-on-1 Classes',
      targetAudience: 'no-spending-1month',
      value: '200,000 VND off',
      scope: 'Instructor Package',
      usage: '0/500',
      date: '01/10 - 31/10',
      status: 'expired'
    }
  ];

  vouchers$ = this.vouchersSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private currencyService: CurrencyService
  ) {}

  /**
   * Get vouchers from API
   * API Endpoint: GET /api/v1/admin/vouchers
   * Query Params: search, creator, status, type, page, size
   * @returns Observable of Voucher[]
   */
  getVouchers(params?: {
    search?: string;
    creator?: string;
    status?: string;
    type?: string;
    page?: number;
    size?: number;
  }): Observable<Voucher[]> {
    const queryParams: any = {};
    if (params?.search) queryParams.search = params.search;
    if (params?.creator && params.creator !== 'all') queryParams.creator = params.creator;
    if (params?.status && params.status !== 'all') queryParams.status = params.status;
    if (params?.type && params.type !== 'all') queryParams.type = params.type;
    if (params?.page !== undefined) queryParams.page = params.page - 1; // Convert to 0-based
    if (params?.size !== undefined) queryParams.size = params.size;

    console.log('[VoucherService] Calling API /vouchers with params:', queryParams);
    return this.apiService.get<Voucher[]>('/vouchers', queryParams).pipe(
      map((response: any) => {
        console.log('[VoucherService] API response:', response);
        if (response.success && response.data) {
          const vouchers = Array.isArray(response.data) ? response.data : (response.data?.content || []);
          console.log('[VoucherService] Parsed vouchers:', vouchers);
          this.vouchersSubject.next(vouchers);
          return vouchers;
        }
        console.warn('[VoucherService] API failed, returning mock data. Response:', response);
        return this.getMockVouchers(params);
      }),
      catchError(error => {
        console.error('[VoucherService] API error, returning mock data:', error);
        return of(this.getMockVouchers(params));
      })
    );
  }

  /**
   * Get mock vouchers for fallback
   */
  private getMockVouchers(params?: {
    search?: string;
    creator?: string;
    status?: string;
    type?: string;
  }): Voucher[] {
    let filtered = [...this.mockVouchers];

    // Filter by search
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(v => v.code.toLowerCase().includes(search));
    }

    // Filter by creator
    if (params?.creator && params.creator !== 'all') {
      if (params.creator === 'admin') {
        filtered = filtered.filter(v => v.createdBy === 'Admin');
      } else if (params.creator === 'instructor') {
        filtered = filtered.filter(v => v.createdBy === 'Instructor');
      }
    }

    // Filter by status
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(v => v.status === params.status);
    }

    // Filter by type
    if (params?.type && params.type !== 'all') {
      if (params.type === '%') {
        filtered = filtered.filter(v => v.value.includes('%'));
      } else if (params.type === 'đ') {
        filtered = filtered.filter(v => v.value.includes('VND') || v.value.includes('đ'));
      }
    }

    this.vouchersSubject.next(filtered);
    return filtered;
  }

  /**
   * Get vouchers from BehaviorSubject (for backward compatibility)
   */
  getVouchersLocal(): Voucher[] {
    return this.vouchersSubject.value;
  }

  /**
   * Get voucher by ID from local data (for backward compatibility)
   */
  getVoucherById(id: string): Voucher | undefined {
    return this.vouchersSubject.value.find(v => v.id === id);
  }

  /**
   * Get voucher by ID from API
   * API Endpoint: GET /api/v1/admin/vouchers/:id
   */
  getVoucher(id: string): Observable<Voucher> {
    console.log('[VoucherService] getVoucher called with ID:', id);
    console.log('[VoucherService] Calling API: GET /vouchers/' + id);
    return this.apiService.get<Voucher>(`/vouchers/${id}`).pipe(
      map((response: any) => {
        console.log('[VoucherService] getVoucher API response:', response);
        if (response.success && response.data) {
          console.log('[VoucherService] Voucher data received:', response.data);
          return response.data;
        }
        console.warn('[VoucherService] API response not successful:', response);
        throw new Error(response.message || 'Failed to get voucher');
      }),
      catchError(error => {
        console.error('[VoucherService] Get voucher error:', error);
        console.log('[VoucherService] Falling back to local data for ID:', id);
        // Fallback: get from local data
        const voucher = this.getVoucherById(id);
        if (voucher) {
          console.log('[VoucherService] Found voucher in local data:', voucher);
          return of(voucher);
        }
        console.error('[VoucherService] Voucher not found in local data');
        throw error;
      })
    );
  }

  /**
   * Create voucher via API
   * API Endpoint: POST /api/v1/admin/vouchers
   */
  createVoucher(voucherData: Partial<Voucher>): Observable<Voucher> {
    return this.apiService.post<Voucher>('/vouchers', voucherData).pipe(
      map((response: any) => {
        if (response.success && response.data) {
          const currentVouchers = this.vouchersSubject.value;
          this.vouchersSubject.next([...currentVouchers, response.data]);
          return response.data;
        }
        throw new Error(response.message || 'Failed to create voucher');
      }),
      catchError(error => {
        console.error('[VoucherService] Create voucher error:', error);
        // Fallback: create locally
        const newVoucher: Voucher = {
          id: Date.now().toString(),
          code: voucherData.code || '',
          description: voucherData.description || '',
          createdBy: 'Admin',
          creatorName: 'Admin',
          productType: voucherData.productType || 'course',
          value: this.formatVoucherValue(voucherData),
          scope: 'All Products',
          usage: '0/' + (voucherData.totalUsageLimit || 1000),
          date: this.formatDateRange(voucherData.startDate, voucherData.endDate, voucherData.isUnlimited),
          status: 'active',
          ...voucherData
        } as Voucher;
        const currentVouchers = this.vouchersSubject.value;
        this.vouchersSubject.next([...currentVouchers, newVoucher]);
        return of(newVoucher);
      })
    );
  }

  /**
   * Update voucher via API
   * API Endpoint: PUT /api/v1/admin/vouchers/:id
   */
  updateVoucher(id: string, voucherData: Partial<Voucher>): Observable<Voucher> {
    return this.apiService.put<Voucher>(`/vouchers/${id}`, voucherData).pipe(
      map((response: any) => {
        if (response.success && response.data) {
          const currentVouchers = this.vouchersSubject.value;
          const index = currentVouchers.findIndex(v => v.id === id);
          if (index !== -1) {
            currentVouchers[index] = response.data;
            this.vouchersSubject.next([...currentVouchers]);
          }
          return response.data;
        }
        throw new Error(response.message || 'Failed to update voucher');
      }),
      catchError(error => {
        console.error('[VoucherService] Update voucher error:', error);
        // Fallback: update locally
        const currentVouchers = this.vouchersSubject.value;
        const index = currentVouchers.findIndex(v => v.id === id);
        if (index === -1) {
          throw new Error('Voucher not found');
        }
        const updatedVoucher: Voucher = {
          ...currentVouchers[index],
          ...voucherData,
          value: this.formatVoucherValue(voucherData),
          date: this.formatDateRange(voucherData.startDate, voucherData.endDate, voucherData.isUnlimited)
        };
        currentVouchers[index] = updatedVoucher;
        this.vouchersSubject.next([...currentVouchers]);
        return of(updatedVoucher);
      })
    );
  }

  /**
   * Delete voucher via API
   * API Endpoint: DELETE /api/v1/admin/vouchers/:id
   */
  deleteVoucher(id: string): Observable<void> {
    return this.apiService.delete<void>(`/vouchers/${id}`).pipe(
      map(response => {
        if (response.success) {
          const currentVouchers = this.vouchersSubject.value.filter(v => v.id !== id);
          this.vouchersSubject.next(currentVouchers);
        }
      }),
      catchError(error => {
        console.error('[VoucherService] Delete voucher error:', error);
        // Fallback: delete locally
        const currentVouchers = this.vouchersSubject.value.filter(v => v.id !== id);
        this.vouchersSubject.next(currentVouchers);
        return of(void 0);
      })
    );
  }

  /**
   * Pause/Resume voucher via API
   * API Endpoint: PATCH /api/v1/admin/vouchers/:id/status
   */
  updateVoucherStatus(id: string, status: 'active' | 'paused'): Observable<Voucher> {
    return this.apiService.patch<Voucher>(`/vouchers/${id}/status`, { status }).pipe(
      map((response: any) => {
        if (response.success && response.data) {
          const currentVouchers = this.vouchersSubject.value;
          const index = currentVouchers.findIndex(v => v.id === id);
          if (index !== -1) {
            currentVouchers[index] = response.data;
            this.vouchersSubject.next([...currentVouchers]);
          }
          return response.data;
        }
        throw new Error(response.message || 'Failed to update voucher status');
      }),
      catchError(error => {
        console.error('[VoucherService] Update voucher status error:', error);
        // Fallback: update locally
        const currentVouchers = this.vouchersSubject.value;
        const index = currentVouchers.findIndex(v => v.id === id);
        if (index !== -1) {
          currentVouchers[index].status = status;
          this.vouchersSubject.next([...currentVouchers]);
          return of(currentVouchers[index]);
        }
        throw error;
      })
    );
  }

  private formatVoucherValue(data: Partial<Voucher>): string {
    if (data.discountType === 'percentage') {
      const value = data.discountValue ? `${data.discountValue}% off` : '';
      const max = data.maxDiscount ? ` (Max ${this.currencyService.format(Number(data.maxDiscount), 'VND')})` : '';
      return value + max;
    } else {
      return data.discountValue ? `${this.currencyService.format(Number(data.discountValue), 'VND')} off` : '';
    }
  }

  private formatDateRange(startDate?: string, endDate?: string, isUnlimited?: boolean): string {
    if (isUnlimited) {
      return '(Unlimited)';
    }
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('vi-VN');
      const end = new Date(endDate).toLocaleDateString('vi-VN');
      return `${start} - ${end}`;
    }
    return '';
  }
}
