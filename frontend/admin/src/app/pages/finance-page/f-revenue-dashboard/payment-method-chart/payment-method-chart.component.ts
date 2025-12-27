import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-payment-method-chart',
    template: `
        <div class="trezo-card bg-white dark:bg-[#0c1427] p-[16px] rounded-md">
            <div class="trezo-card-header mb-[12px]">
                <div class="trezo-card-title">
                    <h5 class="!mb-0 text-base">Payment Methods</h5>
                </div>
            </div>
            <div class="trezo-card-content">
                <div class="-mt-[12px] -mb-[14px]">
                    <div id="payment_method_chart"></div>
                </div>
            </div>
        </div>
    `,
    styleUrl: './payment-method-chart.component.scss'
})
export class PaymentMethodChartComponent implements OnInit {
    private isBrowser: boolean;
    private chartInstance: any;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        this.loadChart();
    }

    private async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                const ApexCharts = (await import('apexcharts')).default;

                const options = {
                    series: [60, 40],
                    chart: {
                        type: 'donut',
                        height: 280
                    },
                    colors: ['#9CAAFF', '#605DFF'],
                    labels: ['VNPay', 'Momo'],
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
}
