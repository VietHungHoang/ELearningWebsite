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
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class CertificatePdfServiceImpl implements CertificatePdfService {

        @Override
        public byte[] generateCertificate(String learnerName, String courseName, String instructorName) {
                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                        PdfWriter writer = new PdfWriter(baos);
                        PdfDocument pdf = new PdfDocument(writer);
                        // Đặt hướng ngang (landscape)
                        Document document = new Document(pdf, PageSize.A4.rotate());

                        // Vẽ viền kép (ngoài và trong, màu xanh)
                        PdfCanvas canvas = new PdfCanvas(pdf.addNewPage());
                        float width = pdf.getDefaultPageSize().getWidth();
                        float height = pdf.getDefaultPageSize().getHeight();
                        float outerMargin = 40;
                        float innerMargin = 60;

                        // Thêm background ảnh
                        try {
                                Image bgImage = new Image(ImageDataFactory.create("src/main/resources/background.png"))
                                                .scaleToFit(width, height)
                                                .setFixedPosition(0, 0)
                                                .setOpacity(0.15f);
                                document.add(bgImage);
                        } catch (Exception e) {
                                System.err.println("Không thể tải background: " + e.getMessage());
                        }

                        // Thêm watermark chữ
                        PdfCanvas watermarkCanvas = new PdfCanvas(pdf.getFirstPage());
                        watermarkCanvas.saveState();
                        watermarkCanvas.setFillColor(ColorConstants.LIGHT_GRAY);
                        watermarkCanvas.beginText();
                        PdfFont watermarkFont = PdfFontFactory.createFont("Times-Bold");
                        watermarkCanvas.setFontAndSize(watermarkFont, 60); // Giảm font để tránh che nội dung
                        float textWidth = watermarkFont.getWidth("E-LEARNING ACADEMY", 60);
                        watermarkCanvas.setTextMatrix((width - textWidth) / 2, height / 2 - 30); // Căn giữa
                        watermarkCanvas.showText("E-LEARNING ACADEMY");
                        watermarkCanvas.endText();
                        watermarkCanvas.restoreState();

                        // Viền ngoài (xanh, dày)
                        canvas.setLineWidth(4);
                        canvas.setStrokeColor(ColorConstants.BLUE);
                        canvas.rectangle(outerMargin, outerMargin, width - 2 * outerMargin, height - 2 * outerMargin);
                        canvas.stroke();

                        // Viền trong (xanh, mỏng)
                        canvas.setLineWidth(1);
                        canvas.setStrokeColor(ColorConstants.BLUE);
                        canvas.rectangle(innerMargin, innerMargin, width - 2 * innerMargin, height - 2 * innerMargin);
                        canvas.stroke();

                        // Logo
                        try {
                                Image logoImage = new Image(ImageDataFactory.create("src/main/resources/logo.png"))
                                                .setWidth(80)
                                                .setHeight(40)
                                                .setTextAlignment(TextAlignment.LEFT)
                                                .setMarginTop(outerMargin + 5)
                                                .setMarginLeft(outerMargin + 10);
                                document.add(logoImage);
                        } catch (Exception e) {
                                System.err.println("Không thể tải logo: " + e.getMessage());
                                document.add(new Paragraph("E-LEARNING LOGO")
                                                .setFont(PdfFontFactory.createFont("Times-Bold"))
                                                .setFontSize(12)
                                                .setFontColor(ColorConstants.BLACK)
                                                .setTextAlignment(TextAlignment.LEFT)
                                                .setMarginTop(outerMargin + 5)
                                                .setMarginLeft(outerMargin + 10));
                        }

                        // Tên tổ chức
                        Paragraph institutionName = new Paragraph("E-LEARNING ACADEMY")
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(12)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.LEFT)
                                        .setMarginTop(3)
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10);
                        document.add(institutionName);

                        // Tiêu đề chứng chỉ
                        Paragraph title = new Paragraph("Certificate of Completion")
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(26)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginTop(8)
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(8);
                        document.add(title);

                        // Phụ đề
                        document.add(new Paragraph("This is to certify that")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(14)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(6));

                        // Tên người học
                        document.add(new Paragraph(learnerName)
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(18)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(6));

                        // Văn bản hoàn thành khóa học
                        document.add(new Paragraph("has successfully completed")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(14)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(6));

                        // Tên khóa học
                        document.add(new Paragraph(courseName)
                                        .setFont(PdfFontFactory.createFont("Times-Italic"))
                                        .setFontSize(16)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(8));

                        // Ngày phát hành
                        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
                        document.add(new Paragraph("Issued on: " + date)
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(10)
                                        .setFontColor(ColorConstants.BLACK)
                                        .setTextAlignment(TextAlignment.RIGHT)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(8));

                        // Phần chữ ký
                        Paragraph signatureSection = new Paragraph()
                                        .setWidth(UnitValue.createPercentValue(80))
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(outerMargin - 15);

                        // Chữ ký giảng viên
                        signatureSection.add(new Text("_____________________________\n")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(10));
                        signatureSection.add(new Text(instructorName + "\n")
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(10)
                                        .setFontColor(ColorConstants.BLACK));
                        signatureSection.add(new Text("Course Instructor")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(8)
                                        .setFontColor(ColorConstants.GRAY));

                        // Khoảng cách giữa chữ ký
                        signatureSection.add(new Text("        "));

                        // Chữ ký giám đốc
                        signatureSection.add(new Text("_____________________________\n")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(10));
                        signatureSection.add(new Text("Director of Education\n")
                                        .setFont(PdfFontFactory.createFont("Times-Bold"))
                                        .setFontSize(10)
                                        .setFontColor(ColorConstants.BLACK));
                        signatureSection.add(new Text("E-Learning Academy")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(8)
                                        .setFontColor(ColorConstants.GRAY));

                        document.add(signatureSection);

                        // Chân trang
                        Paragraph footer = new Paragraph("E-Learning Academy | Empowering Knowledge Worldwide")
                                        .setFont(PdfFontFactory.createFont("Helvetica"))
                                        .setFontSize(7)
                                        .setFontColor(ColorConstants.GRAY)
                                        .setTextAlignment(TextAlignment.CENTER)
                                        .setMarginTop(3)
                                        .setMarginLeft(outerMargin + 10)
                                        .setMarginRight(outerMargin + 10)
                                        .setMarginBottom(outerMargin - 15);
                        document.add(footer);

                        document.close();
                        return baos.toByteArray();
                } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("Lỗi khi tạo chứng chỉ PDF: " + e.getMessage(), e);
                }
        }

        // Hàm main để test
        public static void main(String[] args) {
                CertificatePdfServiceImpl certificateService = new CertificatePdfServiceImpl();
                String learnerName = "Nguyễn Văn A";
                String courseName = "Lập trình Java Cơ bản";
                String instructorName = "TS. Trần Thị B";
                try {
                        byte[] pdfBytes = certificateService.generateCertificate(learnerName, courseName,
                                        instructorName);
                        String outputPath = "certificate_output.pdf";
                        try (FileOutputStream fos = new FileOutputStream(outputPath)) {
                                fos.write(pdfBytes);
                                System.out.println("Tạo chứng chỉ PDF thành công tại: " + outputPath);
                        } catch (Exception e) {
                                System.err.println("Lỗi khi ghi file PDF: " + e.getMessage());
                                e.printStackTrace();
                        }
                } catch (Exception e) {
                        System.err.println("Lỗi khi tạo chứng chỉ: " + e.getMessage());
                        e.printStackTrace();
                }
        }
}