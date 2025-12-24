import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SemiCircularGaugeRadialbarChartService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {

                const ApexCharts = (await import('apexcharts')).default;

                const options = {
                    series: [76],
                    chart: {
                        type: "radialBar",
                        offsetY: -20
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: -90,
                            endAngle: 90,
                            track: {
                                background: "#e7e7e7",
                                strokeWidth: "97%",
                                margin: 5, 
                                dropShadow: {
                                    enabled: true,
                                    top: 2,
                                    left: 0,
                                    opacity: 0.31,
                                    blur: 2
                                }
                            },
                            dataLabels: {
                                name: {
                                    show: false
                                },
                                value: {
                                    offsetY: -2,
                                    fontSize: "22px"
                                }
                            }
                        }
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            shade: "light",
                            shadeIntensity: 0.4,
                            inverseColors: false,
                            opacityFrom: 1,
                            opacityTo: 1,

                        }
                    },
                    labels: ["Average Results"],
                    colors: ["#605DFF"]
                };

                const chart = new ApexCharts(document.querySelector('#semi_circular_gauge_radialbar_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}