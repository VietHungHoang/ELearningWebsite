import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss'
})
export class PaymentMethodComponent implements OnInit {
  activeTab: string = 'general';
  paymentForm!: FormGroup;
  savedSecrets: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.paymentForm = this.fb.group({

      currency_code: ['VND', Validators.required],
      currency_position: ['suffix', Validators.required],

      vnpay_enable: [false],
      vnpay_title: ['Pay with VNPay QR'],
      vnpay_description: ['Scan QR code with your bank app.'],
      vnpay_mode: ['sandbox'],
      vnpay_sandbox_tmn_code: [''],
      vnpay_sandbox_hash_secret: [''],
      vnpay_sandbox_url: ['https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'],
      vnpay_live_tmn_code: [''],
      vnpay_live_hash_secret: [''],
      vnpay_live_url: ['https://payment.vnpayment.vn/paymentv2/vpcpay.html'],

      momo_enable: [false],
      momo_title: ['Pay with Momo E-Wallet'],
      momo_description: ['Scan QR code with your Momo app.'],
      momo_mode: ['sandbox'],
      momo_sandbox_partner_code: [''],
      momo_sandbox_access_key: [''],
      momo_sandbox_secret_key: [''],
      momo_live_partner_code: [''],
      momo_live_access_key: [''],
      momo_live_secret_key: ['']
    });
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  saveSettings(): void {
    if (this.paymentForm.valid) {

      const formData = this.paymentForm.value;
      const secretFields = [
        'vnpay_sandbox_hash_secret',
        'vnpay_live_hash_secret',
        'momo_sandbox_secret_key',
        'momo_live_secret_key'
      ];

      secretFields.forEach(field => {
        if (formData[field]) {
          this.savedSecrets[field] = true;
        }
      });

      console.log('Payment settings saved:', formData);

    }
  }

  getSecretDisplay(fieldName: string): string {
    const value = this.paymentForm.get(fieldName)?.value;
    if (this.savedSecrets[fieldName] && value) {
      return '●'.repeat(Math.min(8, value.length));
    }
    return value || '';
  }

  resetSecretField(fieldName: string): void {
    this.savedSecrets[fieldName] = false;
    this.paymentForm.patchValue({ [fieldName]: '' });
  }
}
