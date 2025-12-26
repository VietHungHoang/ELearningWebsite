import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-downloadable-table',
    imports: [],
    templateUrl: './downloadable-table.component.html',
    styleUrl: './downloadable-table.component.scss'
})
export class DownloadableTableComponent {

    downloadPDF() {
        const doc = new jsPDF();

        const table = document.getElementById('my-table');

        doc.text('Static Table Data', 20, 10);

        (doc as any).autoTable({
            html: '#my-table', 
            startY: 20, 
        });

        doc.save('static-table-data.pdf');
    }

    downloadCSV() {
        const table = document.getElementById('my-table') as HTMLTableElement;
        let csv = '';

        for (let i = 0; i < table.rows.length; i++) {
            const row = table.rows[i];
            const cells = row.cells;
            const rowData = [];

            for (let j = 0; j < cells.length; j++) {
                rowData.push(cells[j].innerText);
            }

            csv += rowData.join(',') + '\n';
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table-data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    downloadExcel() {

        const table = document.getElementById('my-table') as HTMLTableElement;

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();

        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'TableData');

        XLSX.writeFile(workbook, 'table-data.xlsx');
    }

    printTableInNewWindow() {

        const tableHtml = document.getElementById('my-table')!.outerHTML;

        const printWindow = window.open('', '', 'width=800,height=600');

        if (printWindow) {

            const content = `
                <html>
                    <head>
                    <title>Print Table</title>
                        <style>
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                                border: 1px solid black;
                            }
                            @media print {
                                body {
                                    font-size: 12px;
                                    margin: 0;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${tableHtml}
                    </body>
                </html>
            `;

            printWindow.document.open();
            printWindow.document.write(content);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
                printWindow.onafterprint = () => {
                    printWindow.close();
                };
            };
        }
    }

}