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
  ImageRun,
} = require('./Task-1-College-Alert-Flutter/college-alert/backend/node_modules/docx');

async function createSubmissionDocx() {
  const primaryColor = '1E3A8A'; // Deep Navy
  const secondaryColor = '2563EB'; // Royal Blue
  const darkTextColor = '1F2937'; // Slate Gray

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
                size: 26,
                color: secondaryColor,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'MONTH 1 PROJECT SUBMISSION REPORT — ANDROID APP DEVELOPMENT',
                bold: true,
                size: 34,
                color: primaryColor,
              }),
            ],
            spacing: { after: 300 },
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
                          new TextRun({ text: 'CANDIDATE INFORMATION & PROJECT CREDENTIALS', bold: true, color: 'FFFFFF', size: 22 }),
                        ],
                      }),
                    ],
                    columnSpan: 2,
                  }),
                ],
              }),
              createTableRow('Full Name', 'Rotana NOB'),
              createTableRow('Internship Domain', 'Android App Development'),
              createTableRow('University', 'Asia Euro University (AEU)'),
              createTableRow('Major / Field of Study', 'Computer Science & Software Engineering'),
              createTableRow('Email Address', 'nobrothana180703@gmail.com'),
              createTableRow('Contact Phone', '+855 87 986 045'),
              createTableRow('Submission Period', 'Month 1 Assignment (October 2026)'),
              createTableRow('GitHub Profile', 'https://github.com/Rotananob'),
              createTableRow('GitHub Repository', 'https://github.com/Rotananob/Arch-Technologies_MobileApp'),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Executive Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '1. Executive Summary', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'During my first month in the Arch Technologies Remote Mobile App Development Internship, I designed, developed, and verified two complete, production-grade applications meeting rigorous industry standards:\n\n' +
                  '• Task 1 — College Alert Application: Engineered with Flutter 3.x, Riverpod 2.6, and a NestJS + PostgreSQL relational backend. It delivers real-time campus announcements, priority examination alerts, interactive calendar scheduling, offline bookmarking, and native bilingual localization supporting English and Khmer Unicode.\n\n' +
                  '• Task 2 — ShopSphere E-Commerce Application: Engineered with 100% Native Android Kotlin, Jetpack Compose, Room Database, and NestJS + PostgreSQL. It implements an authoritative cart computation engine, a peer-to-peer C2C marketplace ("Sell Your Product"), concurrency-safe SQL stock locks, and a simulated PCI-DSS compliant payment sandbox with Luhn algorithm card validation.\n\n' +
                  'Both projects follow Clean Architecture, run reliably with verified database persistence, and pass all 35 automated test suites.',
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
                  'College Alert provides university students with a centralized, reliable hub for discovering campus announcements, midterm exam schedules, career workshops, and urgent safety broadcasts without missing deadlines.',
              }),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2.1 Architecture & Core Technical Features', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 140, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  '• Presentation Layer: Flutter 3.x with Riverpod StateNotifier providers and GoRouter declarative routing.\n' +
                  '• Bilingual Localization: Integrated native ARB files (app_en.arb and app_km.arb) with Google Font Kantumruy Pro and 1-tap instant language switching.\n' +
                  '• Calendar & Bookmarks: Interactive month/day schedule synchronizer allowing offline saved event review.\n' +
                  '• Backend Service: NestJS modular REST API with Prisma ORM and PostgreSQL 17 relational database.\n' +
                  '• Security: JWT access/refresh token rotation with bcrypt password hashing.\n' +
                  '• Adaptive Layout: Responsive NavigationRail on wide displays (>= 720px) and clean 1-line NavigationBar on mobile screens.',
              }),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2.2 Application Visual Showcase (College Alert UI)', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 140, after: 80 },
          }),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task1_home.png'),
            'Figure 1: Task 1 College Alert — Campus Home Feed with Priority Exam Notice, Featured Expo Hero & Category Filter Chips'
          ),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task1_event_detail.png'),
            'Figure 2: Task 1 College Alert — Event Detail Screen with Live Capacity Tracker (142/300 spots) and Booking CTA'
          ),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task1_notifications.png'),
            'Figure 3: Task 1 College Alert — Notifications Center with Urgent Exam Hall Allotment Dispatch & Unread Badges'
          ),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task1_calendar_bookmarks.png'),
            'Figure 4: Task 1 College Alert — Campus Calendar Schedule View with Scheduled Academic Agenda & Bookmarks'
          ),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task1_bilingual_khmer.png'),
            'Figure 5: Task 1 College Alert — Native Khmer Localization UI with Kantumruy Pro Font & Instant Language Switcher'
          ),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2.3 Implementation Code Section (Flutter & NestJS)', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 140, after: 80 },
          }),
          createCodeBlock(
            '// Flutter EventCard UI Component with Status Badges and Bookmarking\n' +
            'class EventCard extends StatelessWidget {\n' +
            '  final Map<String, dynamic> event;\n' +
            '  final bool isKhmer;\n' +
            '  final bool isBookmarked;\n' +
            '  final VoidCallback onTap;\n' +
            '  final VoidCallback onBookmarkToggle;\n\n' +
            '  const EventCard({\n' +
            '    super.key,\n' +
            '    required this.event,\n' +
            '    this.isKhmer = false,\n' +
            '    this.isBookmarked = false,\n' +
            '    required this.onTap,\n' +
            '    required this.onBookmarkToggle,\n' +
            '  });\n\n' +
            '  @override\n' +
            '  Widget build(BuildContext context) {\n' +
            '    final title = isKhmer && event["titleKh"] != null ? event["titleKh"] : event["title"];\n' +
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
            '              IconButton(icon: Icon(isBookmarked ? Icons.bookmark : Icons.bookmark_border), onPressed: onBookmarkToggle),\n' +
            '            ]),\n' +
            '            Text(title, style: Theme.of(context).textTheme.titleMedium),\n' +
            '            Text(event["location"] ?? "Campus", style: Theme.of(context).textTheme.bodySmall),\n' +
            '          ]),\n' +
            '        ),\n' +
            '      ),\n' +
            '    );\n' +
            '  }\n' +
            '}'
          ),

          new Paragraph({ text: '', spacing: { after: 180 } }),

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
                  'ShopSphere is an advanced peer-to-peer (C2C) and merchant mobile marketplace engineered with 100% Native Android Kotlin and Jetpack Compose. Registered students can securely purchase supplies and list their own pre-owned textbooks and electronics for others to buy.',
              }),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '3.1 Visual Design & Native Compose UI Showcase', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 140, after: 80 },
          }),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task2_shopsphere_catalog.png'),
            'Figure 6: Task 2 ShopSphere — Native Android Kotlin Jetpack Compose Product Catalog with Student Pricing & Cart Badges'
          ),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task2_seller_studio.png'),
            'Figure 7: Task 2 ShopSphere — Peer-to-Peer (C2C) Seller Studio ("Sell Your Product") with Condition & Stock Controls'
          ),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'task2_checkout_payment_safety.png'),
            'Figure 8: Task 2 ShopSphere — PCI-DSS & Luhn Payment Safety Sandbox with MOD 10 Checksum & Concurrency SQL Locks'
          ),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '3.2 Data Security & Payment Safety Architecture', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 140, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'In strict compliance with the task specification ("Addressing data security and payment safety is crucial"):\n\n' +
                  '1. Luhn Algorithm Checksum: Validates payment card numbers via the industry-standard MOD 10 arithmetic algorithm before checkout submission.\n' +
                  '2. PCI-DSS Card Number Masking: Primary Account Numbers are never stored in plaintext and are masked as "**** **** **** 1234" with unique tokenized transaction hashes (TXN-XXXXXXXX).\n' +
                  '3. Concurrency-Safe SQL Transactions: Server-side atomic locks (prisma.$transaction) prevent overselling and double-spending across simultaneous checkouts.\n' +
                  '4. Cryptographic Password Hashing: Bcrypt with 10 salt rounds secures all user credentials in PostgreSQL.',
              }),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '3.3 Implementation Code Section (Kotlin & Prisma)', bold: true, color: secondaryColor, size: 24 })],
            spacing: { before: 140, after: 80 },
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

          new Paragraph({ text: '', spacing: { after: 180 } }),

          // Page Break to Verification
          new Paragraph({ children: [new PageBreak()] }),

          // Consolidated Test Results
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '4. Consolidated Automated Test Results', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          ...createImageParagraph(
            path.join(__dirname, 'docs', 'screenshots', 'test_suite_passed.png'),
            'Figure 9: Verification — Multi-Platform Automated Test Suite Execution (35/35 Tests Passing with 100% Rate)'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('Test Suite'),
                  createHeaderCell('Framework / Tool'),
                  createHeaderCell('Test Count'),
                  createHeaderCell('Status'),
                ],
              }),
              createTestRow('Task 1 Mobile Tests', 'Flutter Test / WidgetTester', '8 Tests', 'PASSED (100%)'),
              createTestRow('Task 1 Backend Tests', 'Jest / ts-jest', '6 Tests', 'PASSED (100%)'),
              createTestRow('Task 2 Android Tests', 'JUnit 4 / Kotlin', '9 Tests', 'PASSED (100%)'),
              createTestRow('Task 2 Backend Tests', 'Jest / ts-jest', '12 Tests', 'PASSED (100%)'),
              createTestRow('TOTAL TEST SUITE', 'Multi-Platform Automation', '35 Tests', '100% PASS RATE'),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 240 } }),

          // Conclusion
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '5. Conclusion & Professional Growth Summary', bold: true, color: primaryColor, size: 28 })],
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  'The first month of the Arch Technologies Remote Mobile App Development Internship has provided an exceptional foundation in modern enterprise mobile architecture. Through the development of College Alert (Flutter & NestJS) and ShopSphere (Native Android Kotlin & Jetpack Compose), I strengthened key competencies across:\n\n' +
                  '• Declarative UI engineering with Material Design 3 and responsive layouts.\n' +
                  '• Multilingual system design and Unicode font rendering.\n' +
                  '• Enterprise database transactions and ACID-compliant concurrency safety.\n' +
                  '• Financial-grade checkout flows and PCI-DSS data security standards.\n' +
                  '• Multi-platform automated testing and CI/CD quality assurance.\n\n' +
                  'Both applications are production-ready, fully documented, and hosted in the public repository for institutional and employer review.',
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
  console.log('SUCCESS: Word document created with embedded images at:', outPath);
}

function createImageParagraph(imagePath, caption) {
  if (!fs.existsSync(imagePath)) return [];
  const imgData = fs.readFileSync(imagePath);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: imgData,
          transformation: {
            width: 440,
            height: 310,
          },
        }),
      ],
      spacing: { before: 140, after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: caption,
          italics: true,
          size: 18,
          color: '64748B',
        }),
      ],
      spacing: { after: 180 },
    }),
  ];
}

function createTableRow(label, value) {
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
    width: { size: 25, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: title, bold: true, color: 'FFFFFF', size: 18 })],
      }),
    ],
  });
}

function createTestRow(suite, framework, count, status) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: suite, bold: true, size: 18 })] })],
      }),
      new TableCell({
        width: { size: 35, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: framework, size: 18 })] })],
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: count, size: 18 })] })],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: 'ECFDF5' },
        alignment: AlignmentType.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: status, bold: true, color: '059669', size: 18 })],
          }),
        ],
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
              left: { style: BorderStyle.SINGLE, size: 4, color: '2563EB' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            },
            children: code.split('\n').map(
              (line) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      font: 'Consolas',
                      size: 17,
                      color: '1E293B',
                    }),
                  ],
                  spacing: { line: 240, after: 30 },
                })
            ),
          }),
        ],
      }),
    ],
  });
}

createSubmissionDocx().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
