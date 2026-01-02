import { Component, Inject, OnInit, PLATFORM_ID, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '../../../../i18n/translate.pipe';

@Component({
    selector: 'app-payment-method-chart',
    template: `
        <div class="trezo-card bg-white dark:bg-[#0c1427] p-[16px] rounded-md">
            <div class="trezo-card-header mb-[12px]">
                <div class="trezo-card-title">
                    <h5 class="!mb-0 text-base">{{ 'revenueDashboard.charts.paymentMethods.title' | translate }}</h5>
                </div>
            </div>
            <div class="trezo-card-content">
                <div class="-mt-[12px] -mb-[14px]">
                    <div id="payment_method_chart"></div>
                </div>
            </div>
        </div>
    `,
    styleUrl: './payment-method-chart.component.scss',
    imports: [TranslatePipe]
})
export class PaymentMethodChartComponent implements OnInit, OnChanges {
    private isBrowser: boolean;
    private chartInstance: any;

    @Input() paymentMethodsData: { series: number[]; labels: string[] } | null = null;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        this.loadChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['paymentMethodsData'] && this.paymentMethodsData && this.chartInstance) {
            this.updateChart();
        }
    }

    private async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                const series = this.paymentMethodsData?.series || [60, 40];
                const labels = this.paymentMethodsData?.labels || ['VNPay', 'Momo'];

                const options = {
                    series,
                    chart: {
                        type: 'donut',
                        height: 280
                    },
                    colors: ['#9CAAFF', '#605DFF'],
                    labels,
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '75%'
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: (val: any) => {
                            return val.toFixed(1) + '%';
                        }
                    },
                    legend: {
                        position: 'bottom',
                        fontSize: '12px',
                        labels: {
                            colors: '#64748B'
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (val: any) => {
                                return val.toFixed(1) + '%';
                            }
                        }
                    }
                };

                this.chartInstance = new ApexCharts(
                    document.querySelector('#payment_method_chart'),
                    options
                );
                this.chartInstance.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

    private updateChart(): void {
        if (this.chartInstance && this.paymentMethodsData) {
            this.chartInstance.updateOptions({
                series: this.paymentMethodsData.series,
                labels: this.paymentMethodsData.labels
            });
        }
    }
}
