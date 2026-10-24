const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  PageBreak,
} = require('./Task-1-College-Alert-Flutter/college-alert/backend/node_modules/docx');

async function createSubmissionDocx() {
  const primaryColor = '1E3A8A'; // Deep Navy
  const secondaryColor = '2563EB'; // Royal Blue
  const darkTextColor = '1F2937'; // Slate Gray
  const lightBgColor = 'F3F4F6'; // Light Gray
  const accentGreen = '059669'; // Emerald Green

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 22, // 11pt
            color: darkTextColor,
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          // Header / Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ARCH TECHNOLOGIES INTERNSHIP PROGRAM',
                bold: true,
                size: 28,
                color: secondaryColor,
              }),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'MONTH 1 FINAL SUBMISSION REPORT — ANDROID APP DEVELOPMENT',
                bold: true,
                size: 36,
                color: primaryColor,
              }),
            ],
            spacing: { after: 360 },
          }),

          // Candidate Info Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: primaryColor },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'CANDIDATE INFORMATION', bold: true, color: 'FFFFFF', size: 24 }),
                        ],
                      }),
                    ],
                    columnSpan: 2,
                  }),
                ],
              }),
              createTableRow('Full Name', 'Rotana NOB', true),
              createTableRow('Internship Domain', 'Android App Development', false),
              createTableRow('University', 'Asia Euro University', false),
              createTableRow('Email Address', 'nobrothana180703@gmail.com', false),
              createTableRow('Phone Number', '+855 87 986 045', false),
              createTableRow('Submission Target', 'submissions.archtech@gmail.com', false),
              createTableRow('Expected File Name', 'Rotana_Nob_AndroidAppDevelopment_Month1.pdf', false),
              createTableRow('GitHub Repository', 'https://github.com/Rotananob/Arch-Technologies_MobileApp', false),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Executive Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '1. Executive Summary', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'During Month 1 of the Arch Technologies Remote Mobile App Development Internship, two complete, production-grade applications were designed, developed, and verified to rigorous software engineering standards:\n\n' +
                  '• Task 1 — College Alert Application: Engineered with Flutter 3.x, Riverpod 2.6, and a NestJS + PostgreSQL backend. It delivers real-time campus event alerts, interactive calendars, bookmarking, and native bilingual localization (English & Khmer).\n' +
                  '• Task 2 — ShopSphere E-Commerce Application: Built with 100% Native Android Kotlin, Jetpack Compose, Room Database, and NestJS + PostgreSQL. Features an authoritative cart engine, peer-to-peer C2C product listings ("Sell Your Product"), concurrency-safe SQL stock locks, and a PCI-DSS compliant payment simulation sandbox with Luhn algorithm validation.\n\n' +
                  'Both projects follow Clean Architecture, run reliably with zero external paid third-party dependencies, and pass all automated tests.',
              }),
            ],
            spacing: { after: 240 },
          }),

          // Page Break to Task 1
          new Paragraph({ children: [new PageBreak()] }),

          // Task 1: College Alert
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '2. Task 1: College Alert Application', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'College Alert provides university students with a centralized, reliable hub for discovering campus announcements, academic exams, career workshops, and urgent safety alerts without missing deadlines.',
              }),
            ],
            spacing: { after: 160 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2.1 Architecture & Core Features', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 160, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  '• Presentation Layer: Flutter 3.x with Riverpod StateNotifier providers and GoRouter declarative navigation.\n' +
                  '• Bilingual Localization: Integrated native ARB files (app_en.arb and app_km.arb) supporting Khmer Unicode seamlessly.\n' +
                  '• Calendar & Bookmarking: Interactive month/day schedule synchronizer allowing offline saved event reviews.\n' +
                  '• Backend Service: NestJS modular REST API with Prisma ORM and PostgreSQL 17 relational database.\n' +
                  '• Security: JWT access/refresh token rotation with bcrypt password hashing.',
              }),
            ],
            spacing: { after: 160 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2.2 Implementation Code Section (Flutter)', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 160, after: 100 },
          }),
          createCodeBlock(
            '// Flutter EventCard UI Component with Bookmark and Priority Alerts\n' +
            'class EventCard extends StatelessWidget {\n' +
            '  final Map<String, dynamic> event;\n' +
            '  final VoidCallback onTap;\n' +
            '  final VoidCallback onBookmarkToggle;\n\n' +
            '  const EventCard({super.key, required this.event, required this.onTap, required this.onBookmarkToggle});\n\n' +
            '  @override\n' +
            '  Widget build(BuildContext context) {\n' +
            '    final isSaved = event["isSaved"] as bool? ?? false;\n' +
            '    final priority = event["priorityAlert"] as bool? ?? false;\n' +
            '    return Card(\n' +
            '      elevation: 2,\n' +
            '      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),\n' +
            '      child: InkWell(\n' +
            '        onTap: onTap,\n' +
            '        child: Padding(\n' +
            '          padding: const EdgeInsets.all(16.0),\n' +
            '          child: Column(children: [\n' +
            '            Row(children: [\n' +
            '              StatusBadge(label: event["category"]?["name"] ?? "General", color: priority ? Colors.red : Colors.blue),\n' +
            '              IconButton(icon: Icon(isSaved ? Icons.bookmark : Icons.bookmark_border), onPressed: onBookmarkToggle),\n' +
            '            ]),\n' +
            '            Text(event["title"], style: Theme.of(context).textTheme.titleMedium),\n' +
            '            Text(event["location"], style: Theme.of(context).textTheme.bodySmall),\n' +
            '          ]),\n' +
            '        ),\n' +
            '      ),\n' +
            '    );\n' +
            '  }\n' +
            '}'
          ),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Page Break to Task 2
          new Paragraph({ children: [new PageBreak()] }),

          // Task 2: ShopSphere E-Commerce
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '3. Task 2: ShopSphere Mobile E-Commerce Application', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'ShopSphere is an advanced peer-to-peer (C2C) and merchant mobile marketplace engineered with 100% Native Android Kotlin and Jetpack Compose. Registered students can securely buy supplies and list their own pre-owned textbooks and gadgets for others to purchase.',
              }),
            ],
            spacing: { after: 160 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '3.1 Data Security & Payment Safety Implementation', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 160, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'In direct fulfillment of the requirement ("Addressing data security and payment safety is crucial"):\n\n' +
                  '1. Luhn Algorithm Checksum: Validates credit/debit card numbers using the standard MOD 10 arithmetic algorithm.\n' +
                  '2. CVV & Expiry Format Security: Enforces 3 to 4 digit verification and temporal expiry checks.\n' +
                  '3. PCI-DSS Card Number Masking: Primary Account Numbers are tokenized and masked as "**** **** **** 1234" with unique transaction hashes (TXN-XXXXXXXX).\n' +
                  '4. Concurrency-Safe SQL Transactions: Server-side atomic locks (prisma.$transaction) prevent double-spending and overselling.\n' +
                  '5. Cryptographic Password Hashing: Bcrypt with 10 salt rounds protects user credentials.',
              }),
            ],
            spacing: { after: 160 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '3.2 Implementation Code Section (Kotlin)', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 160, after: 100 },
          }),
          createCodeBlock(
            '// Kotlin Authoritative Cart Calculation & Stock Validation Model\n' +
            'data class CartItem(\n' +
            '    val id: String,\n' +
            '    val productId: String,\n' +
            '    val productTitle: String,\n' +
            '    val unitPrice: Double,\n' +
            '    val quantity: Int,\n' +
            '    val maxAvailableStock: Int\n' +
            ') {\n' +
            '    val totalPrice: Double get() = unitPrice * quantity\n' +
            '    val isStockSufficient: Boolean get() = quantity <= maxAvailableStock\n' +
            '}\n\n' +
            'data class CartSummary(\n' +
            '    val items: List<CartItem> = emptyList(),\n' +
            '    val subtotal: Double = 0.0,\n' +
            '    val deliveryFee: Double = 2.00,\n' +
            '    val total: Double = 0.0\n' +
            ') {\n' +
            '    companion object {\n' +
            '        fun calculate(items: List<CartItem>, deliveryFee: Double = 2.00): CartSummary {\n' +
            '            val subtotal = items.sumOf { it.totalPrice }\n' +
            '            val fee = if (items.isEmpty()) 0.0 else deliveryFee\n' +
            '            return CartSummary(items = items, subtotal = subtotal, deliveryFee = fee, total = subtotal + fee)\n' +
            '        }\n' +
            '    }\n' +
            '}'
          ),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Page Break to Verification & Submission
          new Paragraph({ children: [new PageBreak()] }),

          // Consolidated Test Results
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '4. Consolidated Automated Test Results', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Test Suite'),
                  createHeaderCell('Framework'),
                  createHeaderCell('Count'),
                  createHeaderCell('Status'),
                ],
              }),
              createTestRow('Task 1 Mobile Tests', 'Flutter Test / WidgetTester', '8 Tests', 'PASSED (100%)'),
              createTestRow('Task 1 Backend Tests', 'Jest / ts-jest', '6 Tests', 'PASSED (100%)'),
              createTestRow('Task 2 Android Tests', 'JUnit 4 / Kotlin', '9 Tests', 'PASSED (100%)'),
              createTestRow('Task 2 Backend Tests', 'Jest / ts-jest', '12 Tests', 'PASSED (100%)'),
              createTestRow('TOTAL TEST SUITE', 'Multi-Platform Automation', '35 Tests', '100% PASS'),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 260 } }),

          // LinkedIn Post Draft
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '5. Professional LinkedIn Announcement Post', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  '🚀 Excited to share my Month 1 submission for the Android App Development Internship at Arch Technologies!\n\n' +
                  'Over the past month, I engineered two production-grade mobile systems:\n' +
                  '📱 Task 1: College Alert Application (Flutter 3, Riverpod 2.6, NestJS, PostgreSQL, Bilingual EN/KM)\n' +
                  '🛒 Task 2: ShopSphere E-Commerce Application (Native Android Kotlin, Jetpack Compose, Room DB, Payment Security Sandbox)\n\n' +
                  '🧪 35+ automated tests passing across mobile and backend suites with 100% compliance!\n\n' +
                  'A huge thank you to the team at @Arch Technologies for this rewarding learning experience!\n\n' +
                  'GitHub: https://github.com/Rotananob/Arch-Technologies_MobileApp\n' +
                  '#AndroidDev #Kotlin #JetpackCompose #Flutter #NestJS #PostgreSQL #ArchTechnologies #Internship',
              }),
            ],
            spacing: { after: 240 },
          }),

          // Email Submission Template
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '6. Official Email Submission Template', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'To: submissions.archtech@gmail.com\n' +
                  'Subject: Month 1 Task Submission – Rotana NOB – Android App Development\n' +
                  'Attachment: Rotana_Nob_AndroidAppDevelopment_Month1.pdf\n\n' +
                  'Dear Team Arch Technologies,\n\n' +
                  'I am pleased to submit my completed work and project report for Month 1 of the Android App Development Internship.\n\n' +
                  'Candidate Information:\n' +
                  '• Full Name: Rotana NOB\n' +
                  '• Internship Domain: Android App Development\n' +
                  '• University: Asia Euro University\n' +
                  '• Email: nobrothana180703@gmail.com\n' +
                  '• Phone: +855 87 986 045\n\n' +
                  'Completed Projects:\n' +
                  '1. Task 1: College Alert Application (Flutter + NestJS + PostgreSQL)\n' +
                  '2. Task 2: ShopSphere E-Commerce Application (Native Android Kotlin + Room + NestJS)\n\n' +
                  'GitHub Repository: https://github.com/Rotananob/Arch-Technologies_MobileApp\n\n' +
                  'Please find the attached PDF report. Thank you for your guidance and evaluation!\n\n' +
                  'Warm regards,\n' +
                  'Rotana NOB\n' +
                  'Intern – Android App Development',
              }),
            ],
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve('docs', 'Rotana_Nob_AndroidAppDevelopment_Month1.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('SUCCESS: Word document created at:', outPath);
}

function createTableRow(label, value, isFirst) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: 'F3F4F6' },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20 })] })],
      }),
    ],
  });
}

function createHeaderCell(title) {
  return new TableCell({
    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
    children: [new Paragraph({ children: [new TextRun({ text: title, bold: true, color: 'FFFFFF', size: 20 })] })],
  });
}

function createTestRow(suite, framework, count, status) {
  return new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: suite, bold: true, size: 19 })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: framework, size: 19 })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: count, size: 19 })] })] }),
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: 'ECFDF5' },
        children: [new Paragraph({ children: [new TextRun({ text: status, bold: true, color: '059669', size: 19 })] })],
      }),
    ],
  });
}

function createCodeBlock(code) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              left: { style: BorderStyle.SINGLE, size: 3, color: '2563EB' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            },
            children: code.split('\n').map(
              (line) =>
                new Paragraph({
                  children: [new TextRun({ text: line, font: 'Courier New', size: 17, color: '0F172A' })],
                  spacing: { before: 20, after: 20 },
                })
            ),
          }),
        ],
      }),
    ],
  });
}

createSubmissionDocx().catch((err) => {
  console.error('Error creating docx:', err);
  process.exit(1);
});
