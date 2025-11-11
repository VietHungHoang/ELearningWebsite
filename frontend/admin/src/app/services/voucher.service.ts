import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Voucher {
  id: string;
  code: string;
  description?: string;
  createdBy: 'Admin' | 'Instructor';
  creatorName: string;
  productType: string;
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
  private vouchersSubject = new BehaviorSubject<Voucher[]>([
    {
      id: '1',
      code: 'BLACKFRIDAY',
      createdBy: 'Admin',
      creatorName: 'Admin',
      productType: 'All Products',
      value: '30% off (Max 200k)',
      scope: 'All Products',
      usage: '150/500',
      date: '11/11 - 15/11',
      status: 'active'
    },
    {
      id: '2',
      code: 'JSDETHA',
      createdBy: 'Instructor',
      creatorName: 'Inst: A.Nguyen',
      productType: 'Courses',
      value: '50% off (Max 500k)',
      scope: 'Instructor Package',
      usage: '25/1000',
      date: '01/11 - 30/11',
      status: 'active'
    },
    {
      id: '3',
      code: 'WELCOME10',
      createdBy: 'Admin',
      creatorName: 'Admin',
      productType: 'Courses',
      value: '100,000 VND off',
      scope: 'Category: Marketing',
      usage: '5/1000',
      date: '(Unlimited)',
      status: 'active'
    },
    {
      id: '4',
      code: 'TUTOR_B',
      createdBy: 'Instructor',
      creatorName: 'Inst: B.Tran',
      productType: '1-on-1 Classes',
      value: '200,000 VND off',
      scope: 'Instructor Package',
      usage: '0/500',
      date: '01/10 - 31/10',
      status: 'expired'
    }
  ]);

  vouchers$ = this.vouchersSubject.asObservable();

  constructor() { }

  getVouchers(): Voucher[] {
    return this.vouchersSubject.value;
  }

  getVoucherById(id: string): Voucher | undefined {
    return this.vouchersSubject.value.find(v => v.id === id);
  }

  createVoucher(voucherData: Partial<Voucher>): Promise<Voucher> {
    return new Promise((resolve) => {
      setTimeout(() => {
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
        };

        const currentVouchers = this.vouchersSubject.value;
        this.vouchersSubject.next([...currentVouchers, newVoucher]);
        resolve(newVoucher);
      }, 500);
    });
  }

  updateVoucher(id: string, voucherData: Partial<Voucher>): Promise<Voucher> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentVouchers = this.vouchersSubject.value;
        const index = currentVouchers.findIndex(v => v.id === id);

        if (index === -1) {
          reject(new Error('Voucher not found'));
          return;
        }

        const updatedVoucher: Voucher = {
          ...currentVouchers[index],
          ...voucherData,
          value: this.formatVoucherValue(voucherData),
          date: this.formatDateRange(voucherData.startDate, voucherData.endDate, voucherData.isUnlimited)
        };

        currentVouchers[index] = updatedVoucher;
        this.vouchersSubject.next([...currentVouchers]);
        resolve(updatedVoucher);
      }, 500);
    });
  }

  private formatVoucherValue(data: Partial<Voucher>): string {
    if (data.discountType === 'percentage') {
      const value = data.discountValue ? `${data.discountValue}% off` : '';
      const max = data.maxDiscount ? ` (Max ${data.maxDiscount})` : '';
      return value + max;
    } else {
      return data.discountValue ? `${data.discountValue} VND off` : '';
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
