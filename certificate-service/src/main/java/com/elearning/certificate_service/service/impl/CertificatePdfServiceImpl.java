package com.elearning.certificate_service.service.impl;

import com.elearning.certificate_service.dto.request.IssueCertificateRequest;
import com.elearning.certificate_service.service.CertificatePdfService;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import com.itextpdf.io.font.constants.StandardFonts;

@Service
public class CertificatePdfServiceImpl implements CertificatePdfService {

        // Professional color palette
        private static final DeviceRgb NAVY_BLUE = new DeviceRgb(25, 47, 89);
        private static final DeviceRgb GOLD = new DeviceRgb(184, 134, 11);
        private static final DeviceRgb LIGHT_GOLD = new DeviceRgb(245, 158, 11);
        private static final DeviceRgb DARK_GRAY = new DeviceRgb(31, 41, 55);
        private static final DeviceRgb MEDIUM_GRAY = new DeviceRgb(75, 85, 99);
        private static final DeviceRgb LIGHT_GRAY = new DeviceRgb(156, 163, 175);
        private static final DeviceRgb BACKGROUND_CREAM = new DeviceRgb(254, 252, 247);

        @Override
        public byte[] generateCertificate(IssueCertificateRequest request) {
                String organizationName = request.getOrganizationName() != null ? request.getOrganizationName()
                                : "PROFESSIONAL E-LEARNING INSTITUTE";

                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                        PdfWriter writer = new PdfWriter(baos);
                        PdfDocument pdf = new PdfDocument(writer);
                        Document document = new Document(pdf, PageSize.A4.rotate());

                        float width = pdf.getDefaultPageSize().getWidth();
                        float height = pdf.getDefaultPageSize().getHeight();

                        // Create premium background and borders
                        createPremiumBackground(pdf, width, height);
                        createElegantBorders(pdf, width, height);

                        // Load professional fonts
                        PdfFont serifBold = PdfFontFactory.createFont(StandardFonts.TIMES_BOLD);
                        PdfFont serifItalic = PdfFontFactory.createFont(StandardFonts.TIMES_ITALIC);
                        PdfFont serif = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);
                        PdfFont sansSerif = PdfFontFactory.createFont(StandardFonts.HELVETICA);
                        PdfFont sansSerifBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

                        // Create well-balanced layout
                        createBalancedHeader(document, organizationName, width, height, serifBold, sansSerif);
                        createBalancedMainContent(document, request, width, height, serifBold, serifItalic, serif,
                                        sansSerif);
                        createRightSidebar(pdf, document, request, width, height, sansSerif, sansSerifBold);
                        createBalancedSignatureArea(document, request, width, height, serifBold, sansSerif);
                        createProfessionalFooter(document, organizationName, width, height, sansSerif);

                        document.close();
                        return baos.toByteArray();
                } catch (Exception e) {
                        throw new RuntimeException("Failed to generate professional certificate PDF", e);
                }
        }

        private void createPremiumBackground(PdfDocument pdf, float width, float height) {
                PdfCanvas canvas = new PdfCanvas(pdf.addNewPage());

                // Subtle cream background
                canvas.setFillColor(BACKGROUND_CREAM);
                canvas.rectangle(0, 0, width, height);
                canvas.fill();

                // Corner decorations
                float cornerSize = 60f;
                canvas.setFillColor(LIGHT_GOLD);

                // Top-left
                canvas.moveTo(0, height);
                canvas.lineTo(cornerSize, height);
                canvas.lineTo(0, height - cornerSize);
                canvas.fill();

                // Bottom-right
                canvas.moveTo(width, 0);
                canvas.lineTo(width - cornerSize, 0);
                canvas.lineTo(width, cornerSize);
                canvas.fill();
        }

        private void createElegantBorders(PdfDocument pdf, float width, float height) {
                PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage());

                float margin1 = 25f;
                float margin2 = 35f;
                float margin3 = 45f;

                // Triple border system
                canvas.setLineWidth(3f);
                canvas.setStrokeColor(GOLD);
                canvas.rectangle(margin1, margin1, width - 2 * margin1, height - 2 * margin1);
                canvas.stroke();

                canvas.setLineWidth(1f);
                canvas.setStrokeColor(NAVY_BLUE);
                canvas.rectangle(margin2, margin2, width - 2 * margin2, height - 2 * margin2);
                canvas.stroke();

                canvas.setLineWidth(0.5f);
                canvas.setStrokeColor(LIGHT_GRAY);
                canvas.rectangle(margin3, margin3, width - 2 * margin3, height - 2 * margin3);
                canvas.stroke();
        }

        private void createBalancedHeader(Document document, String organizationName,
                        float width, float height, PdfFont serifBold, PdfFont sansSerif) {

                float headerStartY = height - 70f;
                float leftMargin = 40f; // Match main content
                float rightMargin = 200f; // Match main content
                float contentWidth = width - leftMargin - rightMargin;
                float centerX = (leftMargin + (width - rightMargin)) / 2f; // Center within left content area

                // Organization name - properly sized and centered
                Paragraph orgName = new Paragraph(organizationName.toUpperCase())
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(serifBold)
                                .setFontSize(20)
                                .setFontColor(NAVY_BLUE)
                                .setCharacterSpacing(2f);
                orgName.setFixedPosition(1, centerX - contentWidth / 2, headerStartY, contentWidth);
                document.add(orgName);

                // Tagline - properly spaced and centered
                Paragraph tagline = new Paragraph("CENTER FOR PROFESSIONAL DEVELOPMENT & CERTIFICATION")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerif)
                                .setFontSize(9)
                                .setFontColor(MEDIUM_GRAY)
                                .setCharacterSpacing(1.2f);
                tagline.setFixedPosition(1, centerX - contentWidth / 2, headerStartY - 30, contentWidth);
                document.add(tagline);

                // Decorative line - centered within left content area
                PdfCanvas canvas = new PdfCanvas(document.getPdfDocument().getFirstPage());
                canvas.setStrokeColor(GOLD);
                canvas.setLineWidth(2f);
                canvas.moveTo(centerX - 180, headerStartY - 50);
                canvas.lineTo(centerX + 180, headerStartY - 50);
                canvas.stroke();
        }

        private void createBalancedMainContent(Document document, IssueCertificateRequest request,
                        float width, float height, PdfFont serifBold, PdfFont serifItalic,
                        PdfFont serif, PdfFont sansSerif) {

                float contentStartY = height - 150f; // Moved down to avoid overlap with gold line
                float leftMargin = 40f; // Moved left for better balance
                float rightMargin = 200f; // Space for sidebar
                float contentWidth = width - leftMargin - rightMargin;
                float centerX = (leftMargin + (width - rightMargin)) / 2f; // Center within left content area

                // Certificate title - perfectly centered
                Paragraph certTitle = new Paragraph("CERTIFICATE OF PROFESSIONAL ACHIEVEMENT")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(serifBold)
                                .setFontSize(18)
                                .setFontColor(NAVY_BLUE)
                                .setCharacterSpacing(1.8f);
                certTitle.setFixedPosition(1, centerX - contentWidth / 2, contentStartY, contentWidth);
                document.add(certTitle);

                // Presentation text - perfectly centered
                Paragraph presentation = new Paragraph("This is to certify that")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(serifItalic)
                                .setFontSize(16)
                                .setFontColor(DARK_GRAY)
                                .setCharacterSpacing(1f);
                presentation.setFixedPosition(1, centerX - contentWidth / 2, contentStartY - 50, contentWidth);
                document.add(presentation);

                // Recipient name - perfectly centered and prominent
                Paragraph recipientName = new Paragraph(request.getLearnerName().toUpperCase())
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(serifBold)
                                .setFontSize(32)
                                .setFontColor(NAVY_BLUE)
                                .setCharacterSpacing(2.2f);
                recipientName.setFixedPosition(1, centerX - contentWidth / 2, contentStartY - 100, contentWidth);
                document.add(recipientName);

                // Achievement description - perfectly centered
                Paragraph achievement1 = new Paragraph(
                                "has successfully completed the comprehensive course of study and")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(serif)
                                .setFontSize(14)
                                .setFontColor(DARK_GRAY)
                                .setCharacterSpacing(0.5f);
                achievement1.setFixedPosition(1, centerX - contentWidth / 2, contentStartY - 140, contentWidth);
                document.add(achievement1);

                Paragraph achievement2 = new Paragraph("fulfilled all requirements for certification in")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(serif)
                                .setFontSize(14)
                                .setFontColor(DARK_GRAY)
                                .setCharacterSpacing(0.5f);
                achievement2.setFixedPosition(1, centerX - contentWidth / 2, contentStartY - 165, contentWidth);
                document.add(achievement2);

                // Course name - perfectly centered and highlighted
                Paragraph courseName = new Paragraph(request.getCourseName())
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(serifItalic)
                                .setFontSize(22)
                                .setFontColor(GOLD)
                                .setCharacterSpacing(1.2f);
                courseName.setFixedPosition(1, centerX - contentWidth / 2, contentStartY - 200, contentWidth);
                document.add(courseName);

                // Authorization details - perfectly centered
                String courseDetails = String.format(
                                "Authorized by %s and delivered through our accredited learning platform",
                                request.getOrganizationName() != null ? request.getOrganizationName()
                                                : "Professional E-Learning Institute");

                Paragraph details = new Paragraph(courseDetails)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerif)
                                .setFontSize(12)
                                .setFontColor(MEDIUM_GRAY)
                                .setCharacterSpacing(0.3f);
                details.setFixedPosition(1, centerX - contentWidth / 2, contentStartY - 230, contentWidth);
                document.add(details);
        }

        private void createRightSidebar(PdfDocument pdf, Document document, IssueCertificateRequest request,
                        float width, float height, PdfFont sansSerif, PdfFont sansSerifBold) {

                float sidebarX = width - 220f;
                float sidebarWidth = 180f;
                float sidebarY = height - 80f;
                float sidebarHeight = height - 160f;

                // Create modern sidebar container with border
                createModernSidebarContainer(pdf, sidebarX, sidebarY, sidebarWidth, sidebarHeight);

                // Professional badge at top
                createModernBadge(pdf, document, sidebarX + sidebarWidth / 2, sidebarY - 60f, sansSerif, sansSerifBold);

                // Information panel below badge
                createModernInfoPanel(document, request, sidebarX + sidebarWidth / 2, sidebarY - 140f,
                                sidebarWidth - 40f, sansSerif, sansSerifBold);

                // QR code at bottom - adjusted for tapered container
        }

        private void createModernSidebarContainer(PdfDocument pdf, float x, float y, float width, float height) {
                PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage());

                // Create unique tapered rectangle with pointed bottom

                float taperHeight = 40f; // Height of the taper

                // Main rectangle background
                canvas.setFillColor(new DeviceRgb(255, 248, 220)); // Warm cream-gold background
                canvas.rectangle(x, y - height + taperHeight, width, height - taperHeight);
                canvas.fill();

                // Tapered bottom section - create pointed bottom
                canvas.moveTo(x, y - height + taperHeight);
                canvas.lineTo(x + width / 2, y - height); // Point to center bottom
                canvas.lineTo(x + width, y - height + taperHeight);
                canvas.lineTo(x + width, y - height + taperHeight);
                canvas.lineTo(x, y - height + taperHeight);
                canvas.closePath();
                canvas.fill();

                // Darker gold accent at top
                canvas.setFillColor(new DeviceRgb(255, 215, 0)); // Gold accent
                canvas.rectangle(x, y - 20, width, 20);
                canvas.fill();

                // Elegant border with gold accent - main rectangle
                canvas.setStrokeColor(new DeviceRgb(184, 134, 11)); // Dark gold border
                canvas.setLineWidth(2f);
                canvas.rectangle(x, y - height + taperHeight, width, height - taperHeight);
                canvas.stroke();

                // Tapered bottom border - create pointed bottom
                canvas.moveTo(x, y - height + taperHeight);
                canvas.lineTo(x + width / 2, y - height); // Point to center bottom
                canvas.lineTo(x + width, y - height + taperHeight);
                canvas.stroke();

                // Inner accent border
                canvas.setStrokeColor(NAVY_BLUE);
                canvas.setLineWidth(1f);
                canvas.rectangle(x + 3, y - height + 3 + taperHeight, width - 6, height - 6 - taperHeight);
                canvas.stroke();

                // Left accent line - darker gold (only for main rectangle part)
                canvas.setFillColor(new DeviceRgb(184, 134, 11)); // Dark gold
                canvas.rectangle(x, y - height + taperHeight, 5, height - taperHeight);
                canvas.fill();

                // Decorative elements for the pointed section
                canvas.setFillColor(new DeviceRgb(255, 215, 0)); // Gold
                canvas.circle(x + width / 2, y - height + 8, 4);
                canvas.fill();

                // Small decorative dots on sides of the point
                canvas.setFillColor(new DeviceRgb(184, 134, 11));
                canvas.circle(x + width / 2 - 8, y - height + 15, 1.5f);
                canvas.fill();
                canvas.circle(x + width / 2 + 8, y - height + 15, 1.5f);
                canvas.fill();
        }

        private void createModernBadge(PdfDocument pdf, Document document, float centerX, float centerY,
                        PdfFont sansSerif, PdfFont sansSerifBold) {

                float badgeRadius = 50f;
                PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage());

                // Badge shadow
                canvas.setFillColor(new DeviceRgb(229, 231, 235));
                canvas.circle(centerX + 2, centerY - 2, badgeRadius);
                canvas.fill();

                // Main badge background
                canvas.setFillColor(ColorConstants.WHITE);
                canvas.circle(centerX, centerY, badgeRadius);
                canvas.fill();

                // Outer ring - gold
                canvas.setStrokeColor(GOLD);
                canvas.setLineWidth(4f);
                canvas.circle(centerX, centerY, badgeRadius);
                canvas.stroke();

                // Inner ring - navy
                canvas.setStrokeColor(NAVY_BLUE);
                canvas.setLineWidth(2f);
                canvas.circle(centerX, centerY, badgeRadius - 12f);
                canvas.stroke();

                // Badge icon - checkmark (corrected direction from the provided code)
                canvas.setStrokeColor(new DeviceRgb(52, 168, 83)); // SUCCESS_GREEN
                canvas.setLineWidth(3f);
                canvas.moveTo(centerX - 12, centerY - 2); // Start point (left)
                canvas.lineTo(centerX - 3, centerY - 8); // Middle point (bottom)
                canvas.lineTo(centerX + 12, centerY + 8); // End point (top-right)
                canvas.stroke();

                // Badge text - single line
                Paragraph badgeText = new Paragraph("CERTIFIED")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerifBold)
                                .setFontSize(7)
                                .setFontColor(NAVY_BLUE)
                                .setCharacterSpacing(0.8f);
                badgeText.setFixedPosition(1, centerX - 30, centerY - 35, 60);
                document.add(badgeText);
        }

        private void createModernInfoPanel(Document document, IssueCertificateRequest request,
                        float centerX, float startY, float panelWidth, PdfFont sansSerif, PdfFont sansSerifBold) {

                float currentY = startY;

                // Header with gold background
                Paragraph header = new Paragraph("CERTIFICATE DETAILS")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerifBold)
                                .setFontSize(10)
                                .setFontColor(ColorConstants.WHITE) // White text on gold background
                                .setCharacterSpacing(1.5f);
                header.setFixedPosition(1, centerX - panelWidth / 2, currentY, panelWidth);
                document.add(header);
                currentY -= 30f; // More space after header

                // Divider line - gold accent
                PdfCanvas canvas = new PdfCanvas(document.getPdfDocument().getFirstPage());
                canvas.setStrokeColor(new DeviceRgb(184, 134, 11)); // Dark gold divider
                canvas.setLineWidth(1.5f);
                canvas.moveTo(centerX - panelWidth / 2 + 20, currentY + 10);
                canvas.lineTo(centerX + panelWidth / 2 - 20, currentY + 10);
                canvas.stroke();
                currentY -= 25f; // More space after divider

                // Issue date
                String formattedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
                addModernInfoItem(document, "Date of Issue", formattedDate,
                                centerX, currentY, panelWidth, sansSerif, sansSerifBold, NAVY_BLUE);
                currentY -= 40f; // Increased spacing

                // Credential level - split into two lines to avoid overlap
                addModernInfoItem(document, "Credential Level", "PROFESSIONAL",
                                centerX, currentY, panelWidth, sansSerif, sansSerifBold, GOLD);
                currentY -= 25f; // Space for second line

                // Second line for "CERTIFICATE"
                Paragraph certLine = new Paragraph("CERTIFICATE")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerifBold)
                                .setFontSize(9)
                                .setFontColor(GOLD)
                                .setCharacterSpacing(0.3f);
                certLine.setFixedPosition(1, centerX - panelWidth / 2, currentY, panelWidth);
                document.add(certLine);
                currentY -= 40f; // Increased spacing after both lines

                // Institution
                addModernInfoItem(document, "Institution", "E-LEARNING ACADEMY",
                                centerX, currentY, panelWidth, sansSerif, sansSerifBold, MEDIUM_GRAY);
        }

        private void addModernInfoItem(Document document, String label, String value,
                        float centerX, float y, float width, PdfFont labelFont, PdfFont valueFont,
                        DeviceRgb valueColor) {

                // Label with modern styling
                Paragraph labelPara = new Paragraph(label.toUpperCase())
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(labelFont)
                                .setFontSize(8)
                                .setFontColor(MEDIUM_GRAY)
                                .setCharacterSpacing(0.8f);
                labelPara.setFixedPosition(1, centerX - width / 2, y, width);
                document.add(labelPara);

                // Value with emphasis
                Paragraph valuePara = new Paragraph(value)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(valueFont)
                                .setFontSize(9)
                                .setFontColor(valueColor)
                                .setCharacterSpacing(0.3f);
                valuePara.setFixedPosition(1, centerX - width / 2, y - 15, width); // Increased spacing
                document.add(valuePara);
        }

        private void createBalancedSignatureArea(Document document, IssueCertificateRequest request,
                        float width, float height, PdfFont serifBold, PdfFont sansSerif) {

                float sigY = 160f;
                float leftMargin = 40f; // Match main content
                float rightMargin = 200f; // Match main content
                float centerX = (leftMargin + (width - rightMargin)) / 2f;
                float leftSigX = centerX - 160f; // Moved further left for better balance
                float rightSigX = centerX + 120f;

                // Left signature
                createSingleSignature(document, request.getInstructorName(), "Course Instructor",
                                leftSigX, sigY, serifBold, sansSerif);

                // Right signature
                createSingleSignature(document, "Dr. Sarah Mitchell", "Director of Professional Education",
                                rightSigX, sigY, serifBold, sansSerif);

                // Issue date - centered between signatures
                Paragraph issueDate = new Paragraph(
                                "Issued on " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")))
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerif)
                                .setFontSize(11)
                                .setFontColor(MEDIUM_GRAY);
                issueDate.setFixedPosition(1, centerX - 180, sigY - 50, 360);
                document.add(issueDate);
        }

        private void createSingleSignature(Document document, String name, String title,
                        float x, float y, PdfFont serifBold, PdfFont sansSerif) {

                float sigWidth = 180f;

                // Signature line
                Paragraph sigLine = new Paragraph("_______________________")
                                .setFont(sansSerif)
                                .setFontSize(11)
                                .setFontColor(LIGHT_GRAY);
                sigLine.setFixedPosition(1, x, y, sigWidth);
                document.add(sigLine);

                // Name
                Paragraph sigName = new Paragraph(name)
                                .setFont(serifBold)
                                .setFontSize(11)
                                .setFontColor(DARK_GRAY);
                sigName.setFixedPosition(1, x, y - 18, sigWidth);
                document.add(sigName);

                // Title
                Paragraph sigTitle = new Paragraph(title)
                                .setFont(sansSerif)
                                .setFontSize(9)
                                .setFontColor(MEDIUM_GRAY);
                sigTitle.setFixedPosition(1, x, y - 32, sigWidth);
                document.add(sigTitle);
        }

        private void createProfessionalFooter(Document document, String organizationName,
                        float width, float height, PdfFont sansSerif) {

                float footerY = 50f;
                float leftMargin = 40f; // Match main content
                float rightMargin = 200f; // Match main content
                float footerWidth = width - leftMargin - rightMargin;
                float centerX = (leftMargin + (width - rightMargin)) / 2f;

                Paragraph accreditation = new Paragraph(
                                "This certificate represents successful completion of a rigorous professional development program")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerif)
                                .setFontSize(9)
                                .setFontColor(MEDIUM_GRAY);
                accreditation.setFixedPosition(1, centerX - footerWidth / 2, footerY, footerWidth);
                document.add(accreditation);

                Paragraph contact = new Paragraph(
                                "www.professionalelearning.edu  |  certificates@peli.edu  |  +1 (555) 123-4567")
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFont(sansSerif)
                                .setFontSize(8)
                                .setFontColor(LIGHT_GRAY);
                contact.setFixedPosition(1, centerX - footerWidth / 2, footerY - 15, footerWidth);
                document.add(contact);
        }
}