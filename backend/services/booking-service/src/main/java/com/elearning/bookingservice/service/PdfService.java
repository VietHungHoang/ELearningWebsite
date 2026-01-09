package com.elearning.bookingservice.service;

import com.elearning.bookingservice.dto.response.TransactionDetailResponse;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@Slf4j
public class PdfService {

    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(59, 130, 246); // Blue-500
    private static final DeviceRgb GRAY_COLOR = new DeviceRgb(107, 114, 128); // Gray-500
    private static final NumberFormat VND_FORMAT = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

    /**
     * Generate a PDF receipt for a transaction
     * 
     * @param transaction Transaction detail data
     * @return PDF file as byte array
     */
    public byte[] generateTransactionReceipt(TransactionDetailResponse transaction) {
        log.info("Generating PDF receipt for transaction: {}", transaction.getId());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Header
            addHeader(document);

            // Transaction ID and Date
            addTransactionInfo(document, transaction);

            // Student and Class Information
            addDetailsSection(document, transaction);

            // Payment Information
            addPaymentSection(document, transaction);

            // Footer
            addFooter(document);

            document.close();
            log.info("PDF generated successfully for transaction: {}", transaction.getId());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error generating PDF for transaction: {}", transaction.getId(), e);
            throw new RuntimeException("Failed to generate PDF receipt", e);
        }
    }

    private void addHeader(Document document) {
        Paragraph header = new Paragraph("LERNEN E-LEARNING PLATFORM")
                .setFontSize(20)
                .setBold()
                .setFontColor(PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        document.add(header);

        Paragraph subHeader = new Paragraph("Transaction Receipt")
                .setFontSize(14)
                .setFontColor(GRAY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(subHeader);
    }

    private void addTransactionInfo(Document document, TransactionDetailResponse transaction) {
        Paragraph transactionId = new Paragraph("Transaction ID: " + transaction.getId())
                .setFontSize(10)
                .setFontColor(GRAY_COLOR)
                .setMarginBottom(5);
        document.add(transactionId);

        String formattedDate = formatDateTime(transaction.getCreatedAt());
        Paragraph date = new Paragraph("Date: " + formattedDate)
                .setFontSize(10)
                .setFontColor(GRAY_COLOR)
                .setMarginBottom(15);
        document.add(date);
    }

    private void addDetailsSection(Document document, TransactionDetailResponse transaction) {
        // Section title
        Paragraph sectionTitle = new Paragraph("Transaction Details")
                .setFontSize(14)
                .setBold()
                .setMarginBottom(10);
        document.add(sectionTitle);

        // Create details table
        Table table = new Table(UnitValue.createPercentArray(new float[] { 30, 70 }))
                .useAllAvailableWidth()
                .setMarginBottom(15);

        // Student Information
        addTableRow(table, "Student ID", transaction.getStudentId());

        // Tutor Information
        addTableRow(table, "Tutor", transaction.getTutorName());

        // Class Information
        if (transaction.getClassName() != null) {
            addTableRow(table, "Class", transaction.getClassName());
        }
        if (transaction.getClassType() != null) {
            String classType = formatClassType(transaction.getClassType());
            addTableRow(table, "Class Type", classType);
        }

        document.add(table);
    }

    private void addPaymentSection(Document document, TransactionDetailResponse transaction) {
        // Section title
        Paragraph sectionTitle = new Paragraph("Payment Information")
                .setFontSize(14)
                .setBold()
                .setMarginBottom(10);
        document.add(sectionTitle);

        // Create payment table
        Table table = new Table(UnitValue.createPercentArray(new float[] { 30, 70 }))
                .useAllAvailableWidth()
                .setMarginBottom(15);

        // Payment details
        if (transaction.getSessionsPurchased() != null && transaction.getSessionsPurchased() > 0) {
            addTableRow(table, "Sessions Purchased", String.valueOf(transaction.getSessionsPurchased()));
        }
        if (transaction.getPricePerSession() != null && transaction.getPricePerSession() > 0) {
            addTableRow(table, "Price per Session", formatCurrency(transaction.getPricePerSession()));
        }
        if (transaction.getDiscount() != null && transaction.getDiscount() > 0) {
            addTableRow(table, "Discount", transaction.getDiscount() + "%");
        }

        addTableRow(table, "Total Amount", formatCurrency(transaction.getAmount()));
        addTableRow(table, "Payment Method", formatPaymentMethod(transaction.getPaymentProvider()));
        addTableRow(table, "Status", formatStatus(transaction.getStatus()));

        if (transaction.getProviderTransactionId() != null) {
            addTableRow(table, "Provider TX ID", transaction.getProviderTransactionId());
        }

        document.add(table);
    }

    private void addFooter(Document document) {
        Paragraph footer = new Paragraph("Thank you for using Lernen E-Learning Platform!")
                .setFontSize(10)
                .setFontColor(GRAY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
        document.add(footer);

        Paragraph contact = new Paragraph("For support, contact us at support@lernen.com")
                .setFontSize(8)
                .setFontColor(GRAY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(5);
        document.add(contact);
    }

    private void addTableRow(Table table, String label, String value) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label).setBold().setFontSize(10))
                .setBackgroundColor(new DeviceRgb(249, 250, 251))
                .setPadding(8);

        Cell valueCell = new Cell()
                .add(new Paragraph(value != null ? value : "N/A").setFontSize(10))
                .setPadding(8);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private String formatDateTime(String dateTime) {
        try {
            LocalDateTime dt = LocalDateTime.parse(dateTime);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss", new Locale("vi", "VN"));
            return dt.format(formatter);
        } catch (Exception e) {
            return dateTime;
        }
    }

    private String formatCurrency(double amount) {
        return VND_FORMAT.format(amount);
    }

    private String formatPaymentMethod(String provider) {
        if (provider == null)
            return "N/A";
        switch (provider.toUpperCase()) {
            case "MOMO":
                return "MoMo";
            case "VNPAY":
                return "VNPay";
            case "SEPAY":
                return "SePay";
            default:
                return provider;
        }
    }

    private String formatStatus(String status) {
        if (status == null)
            return "N/A";
        switch (status.toUpperCase()) {
            case "CONFIRMED":
                return "Completed";
            case "PENDING":
                return "Pending";
            case "FAILED":
                return "Failed";
            case "CANCELLED":
                return "Cancelled";
            default:
                return status;
        }
    }

    private String formatClassType(String classType) {
        if (classType == null)
            return "N/A";
        if (classType.equals("1-on-1") || classType.equals("ONE_ON_ONE")) {
            return "1-on-1";
        } else if (classType.equals("GROUP") || classType.equals("1 and n")) {
            return "Group";
        }
        return classType;
    }
}
