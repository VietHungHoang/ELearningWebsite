package com.elearning.certificate_service.service.impl;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.elearning.certificate_service.service.CertificatePdfService;
import com.itextpdf.io.image.ImageDataFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class CertificatePdfServiceImpl implements CertificatePdfService {

        @Override
        public byte[] generateCertificate(String learnerName, String courseName, String instructorName) {
                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

                        PdfWriter writer = new PdfWriter(baos);
                        PdfDocument pdf = new PdfDocument(writer);
                        Document document = new Document(pdf, PageSize.A4.rotate());

                        float width = pdf.getDefaultPageSize().getWidth();
                        float height = pdf.getDefaultPageSize().getHeight();
                        float outerMargin = 40;
                        float innerMargin = 60;

                        // === Background image ===
                        try {
                                Image bgImage = new Image(ImageDataFactory.create(
                                                getClass().getClassLoader().getResource("background.png")))
                                                .scaleToFit(width, height)
                                                .setFixedPosition(0, 0)
                                                .setOpacity(0.12f);
                                document.add(bgImage);
                        } catch (Exception e) {
                                System.err.println("Background image not found: " + e.getMessage());
                        }

                        // === Watermark LOGO mờ ===
                        try {

                                Image watermarkLogo = new Image(ImageDataFactory.create(
                                                getClass().getClassLoader().getResource("logo.png")))
                                                .scaleToFit(300, 200)
                                                .setFixedPosition((width - 300) / 2, (height - 200) / 2)
                                                .setOpacity(0.05f);
                                document.add(watermarkLogo);
                        } catch (Exception e) {
                                System.err.println("Watermark logo not found: " + e.getMessage());
                        }

                        // === Khung viền ===
                        PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage());
                        // Outer border
                        canvas.setLineWidth(4);
                        canvas.setStrokeColor(ColorConstants.BLUE);
                        canvas.rectangle(outerMargin, outerMargin,
                                        width - 2 * outerMargin, height - 2 * outerMargin);
                        canvas.stroke();

                        // Inner border
                        canvas.setLineWidth(1);
                        canvas.setStrokeColor(ColorConstants.BLUE);
                        canvas.rectangle(innerMargin, innerMargin,
                                        width - 2 * innerMargin, height - 2 * innerMargin);
                        canvas.stroke();

                        // === Logo góc trái trên ===
                        try {
                                Image logoImage = new Image(ImageDataFactory.create(
                                                getClass().getClassLoader().getResource("logo.png")))
                                                .setWidth(80)
                                                .setHeight(40)
                                                .setFixedPosition(outerMargin + 10, height - 60);
                                document.add(logoImage);
                        } catch (Exception e) {
                                System.err.println("Main logo not found: " + e.getMessage());
                        }

                        // === Institution name ===
                        document.add(new Paragraph("E-LEARNING ACADEMY")
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(12)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.LEFT)
                                        .setMarginTop(5));

                        // === Certificate Title ===
                        document.add(new Paragraph("Certificate of Completion")
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(26)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginTop(20));

                        // Subtitle
                        document.add(new Paragraph("This is to certify that")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(14)
                                        .setTextAlignment(TextAlignment.CENTER));

                        // Learner’s Name
                        document.add(new Paragraph(learnerName)
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(20)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginBottom(5));

                        // Completion text
                        document.add(new Paragraph("has successfully completed")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(14)
                                        .setTextAlignment(TextAlignment.CENTER));

                        // Course name
                        document.add(new Paragraph(courseName)
                                        .setFont(PdfFontFactory.createFont("Times-Italic"))
                                        .setFontSize(18)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginBottom(15));

                        // Issued date
                        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
                        document.add(new Paragraph("Issued on: " + date)
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(10)
                                        .setTextAlignment(TextAlignment.RIGHT)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(20));

                        // === Signatures ===
                        Paragraph signatureSection = new Paragraph()
                                        .setWidth(UnitValue.createPercentValue(80))
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10);

                        signatureSection.add(new Text("_____________________________\n")
                                        .setFont(PdfFontFactory.createFont("Helvetica")).setFontSize(10));
                        signatureSection.add(new Text(instructorName + "\n")
                                        .setFont(PdfFontFactory.createFont("Times-Bold")).setFontSize(10));
                        signatureSection.add(new Text("Course Instructor")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(8).setFontColor(ColorConstants.GRAY));

                        signatureSection.add(new Text("            "));

                        signatureSection.add(new Text("_____________________________\n")
                                        .setFont(PdfFontFactory.createFont("Helvetica")).setFontSize(10));
                        signatureSection.add(new Text("Director of Education\n")
                                        .setFont(PdfFontFactory.createFont("Times-Bold")).setFontSize(10));
                        signatureSection.add(new Text("E-Learning Academy")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(8).setFontColor(ColorConstants.GRAY));

                        document.add(signatureSection);

                        // Footer
                        document.add(new Paragraph("E-Learning Academy | Empowering Knowledge Worldwide")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(7)
                                        .setFontColor(ColorConstants.GRAY)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginTop(10));

                        document.close();
                        return baos.toByteArray();

                } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("Error generating PDF certificate: " + e.getMessage(), e);
                }
        }
}

// Hàm main để test
// public static void main(String[] args) {
// CertificatePdfServiceImpl certificateService = new
// CertificatePdfServiceImpl();
// String learnerName = "Nguyen Van A";
// String courseName = "A basic Java course";
// String instructorName = "TS. Tran Thi B";
// try {
// byte[] pdfBytes = certificateService.generateCertificate(learnerName,
// courseName,
// instructorName);
// String outputPath = "certificate_output.pdf";
// try (FileOutputStream fos = new FileOutputStream(outputPath)) {
// fos.write(pdfBytes);
// System.out.println("Tạo chứng chỉ PDF thành công tại: " + outputPath);
// } catch (Exception e) {
// System.err.println("Lỗi khi ghi file PDF: " + e.getMessage());
// e.printStackTrace();
// }
// } catch (Exception e) {
// System.err.println("Lỗi khi tạo chứng chỉ: " + e.getMessage());
// e.printStackTrace();
// }
// }