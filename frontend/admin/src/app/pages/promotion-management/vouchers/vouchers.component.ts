import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
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
    this.loadVouchers();
  }

  loadVouchers(): void {
    console.log('[VouchersComponent] Loading vouchers...');
    this.subscription.add(
      this.voucherService.getVouchers({
        search: this.searchTerm || undefined,
        creator: this.selectedCreator !== 'all' ? this.selectedCreator : undefined,
        status: this.selectedStatus !== 'all' ? this.selectedStatus : undefined,
        type: this.selectedType !== 'all' ? this.selectedType : undefined
      }).subscribe({
        next: (vouchers) => {
          console.log('[VouchersComponent] Received vouchers:', vouchers);
          this.vouchers = vouchers;
          this.filteredVouchers = vouchers; // API already filters, so use directly
        },
        error: (error) => {
          console.error('[VouchersComponent] Error loading vouchers:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterVouchers(): void {
    // Reload from API with filters
    this.loadVouchers();
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
    const newStatus = voucher.status === 'paused' ? 'active' : 'paused';
    this.subscription.add(
      this.voucherService.updateVoucherStatus(voucher.id, newStatus).subscribe({
        next: () => {
          this.loadVouchers(); // Reload to get updated data
        },
        error: (error) => {
          console.error('Error updating voucher status:', error);
        }
      })
    );
  }

  deleteVoucher(id: string): void {
    const voucher = this.filteredVouchers.find(v => v.id === id);
    const voucherCode = voucher?.code || 'this voucher';
    
    if (confirm(`Are you sure you want to delete "${voucherCode}"? This action cannot be undone.`)) {
      this.subscription.add(
        this.voucherService.deleteVoucher(id).subscribe({
          next: () => {
            this.loadVouchers(); // Reload to get updated data
          },
          error: (error) => {
            console.error('Error deleting voucher:', error);
            alert('Failed to delete voucher. Please try again.');
          }
        })
      );
    }
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.loadVouchers(); // Reload with new search term
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
      const deleteObservables = Array.from(this.selectedVouchers).map(id =>
        this.voucherService.deleteVoucher(id)
      );

      // Use forkJoin to wait for all deletions to complete
      this.subscription.add(
        forkJoin(deleteObservables).subscribe({
          next: () => {
            this.selectedVouchers.clear();
            this.loadVouchers(); // Reload to get updated data
          },
          error: (error) => {
            console.error('Error bulk deleting vouchers:', error);
          }
        })
      );
    }
  }
}
