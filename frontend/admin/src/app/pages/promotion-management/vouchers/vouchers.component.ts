import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { VoucherService, Voucher } from '../../../services/voucher.service';

@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.scss'
})
export class VouchersComponent implements OnInit, OnDestroy {
  vouchers: Voucher[] = [];
  searchTerm: string = '';
  selectedCreator: string = 'all';
  selectedStatus: string = 'all';
  selectedType: string = 'all';
  filteredVouchers: Voucher[] = [];
  isFilterMenuOpen = false;
  selectedVouchers: Set<string> = new Set();
  private subscription: Subscription = new Subscription();

  constructor(private voucherService: VoucherService) {}

  ngOnInit(): void {

    this.subscription.add(
      this.voucherService.vouchers$.subscribe(vouchers => {
        this.vouchers = vouchers;
        this.filterVouchers();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterVouchers(): void {
    this.filteredVouchers = this.vouchers.filter(v => {
      const matchSearch = v.code.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCreator = this.selectedCreator === 'all' ||
        (this.selectedCreator === 'admin' && v.createdBy === 'Admin') ||
        (this.selectedCreator === 'instructor' && v.createdBy === 'Instructor');
      const matchStatus = this.selectedStatus === 'all' || v.status === this.selectedStatus;
      const matchType = this.selectedType === 'all' || v.value.includes(this.selectedType);

      return matchSearch && matchCreator && matchStatus && matchType;
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'active': return 'bg-success-50 text-success-600';
      case 'expired': return 'bg-danger-50 text-danger-600';
      case 'paused': return 'bg-warning-50 text-warning-600';
      case 'upcoming': return 'bg-info-50 text-info-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'voucherManagement.status.active',
      'expired': 'voucherManagement.status.expired',
      'paused': 'voucherManagement.status.paused',
      'upcoming': 'voucherManagement.status.upcoming'
    };
    return statusMap[status] || status;
  }

  getActorLabel(actor?: string): string {
    const actorMap: { [key: string]: string } = {
      'all': 'voucherManagement.actor.allStudents',
      'top-spenders': 'voucherManagement.actor.topSpenders',
      'new-students': 'voucherManagement.actor.newStudents',
      'no-spending-1month': 'voucherManagement.actor.noSpending1Month'
    };
    return actorMap[actor || 'all'] || 'voucherManagement.actor.allStudents';
  }

  toggleFilterMenu(): void {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  pauseVoucher(voucher: Voucher): void {
    if (voucher.status !== 'paused') {
      voucher.status = 'paused';
    } else {
      voucher.status = 'active';
    }
  }

  deleteVoucher(id: string): void {
    this.vouchers = this.vouchers.filter(v => v.id !== id);
    this.filterVouchers();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterVouchers();
  }

  onCreatorChange(creator: string): void {
    this.selectedCreator = creator;
    this.filterVouchers();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.filterVouchers();
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
    this.filterVouchers();
  }

  toggleVoucherSelection(voucherId: string): void {
    if (this.selectedVouchers.has(voucherId)) {
      this.selectedVouchers.delete(voucherId);
    } else {
      this.selectedVouchers.add(voucherId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedVouchers.size === this.filteredVouchers.length) {
      this.selectedVouchers.clear();
    } else {
      this.filteredVouchers.forEach(v => this.selectedVouchers.add(v.id));
    }
  }

  isAllSelected(): boolean {
    return this.filteredVouchers.length > 0 && this.selectedVouchers.size === this.filteredVouchers.length;
  }

  isIndeterminate(): boolean {
    return this.selectedVouchers.size > 0 && this.selectedVouchers.size < this.filteredVouchers.length;
  }

  bulkDeleteVouchers(): void {
    if (this.selectedVouchers.size === 0) return;

    if (confirm(`Delete ${this.selectedVouchers.size} voucher(s)?`)) {
      this.vouchers = this.vouchers.filter(v => !this.selectedVouchers.has(v.id));
      this.selectedVouchers.clear();
      this.filterVouchers();
    }
  }
}
