const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const outputPdf = path.resolve('docs', 'Rotana_Nob_AndroidAppDevelopment_Month1.pdf');
const screenshotsDir = path.resolve('docs', 'screenshots');

function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) return '';
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

const images = {
  task1_home: getBase64Image('task1_home.png'),
  task1_event_detail: getBase64Image('task1_event_detail.png'),
  task1_notifications: getBase64Image('task1_notifications.png'),
  task1_calendar_bookmarks: getBase64Image('task1_calendar_bookmarks.png'),
  task1_bilingual_khmer: getBase64Image('task1_bilingual_khmer.png'),
  task2_shopsphere_catalog: getBase64Image('task2_shopsphere_catalog.png'),
  task2_seller_studio: getBase64Image('task2_seller_studio.png'),
  task2_checkout_payment_safety: getBase64Image('task2_checkout_payment_safety.png'),
  test_suite_passed: getBase64Image('test_suite_passed.png'),
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Rotana NOB - Android App Development Month 1 Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 18mm 16mm 18mm 16mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1f2937;
    background: #fff;
    font-size: 10.5pt;
    line-height: 1.55;
  }
  .page-break {
    page-break-before: always;
    break-before: page;
  }
  .no-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  /* Header styling */
  .doc-org {
    text-align: center;
    font-size: 12pt;
    font-weight: 700;
    color: #2563eb;
    letter-spacing: 1px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }
  .doc-title {
    text-align: center;
    font-size: 18pt;
    font-weight: 800;
    color: #1e3a8a;
    line-height: 1.25;
    margin-bottom: 24px;
    text-transform: uppercase;
  }
  
  /* Info table */
  table.info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  table.info-table th {
    background: #1e3a8a;
    color: #ffffff;
    padding: 10px 14px;
    font-size: 11pt;
    text-align: left;
    font-weight: 700;
  }
  table.info-table td {
    padding: 8px 14px;
    border: 1px solid #e5e7eb;
    font-size: 10pt;
  }
  table.info-table tr:nth-child(even) td {
    background: #f9fafb;
  }
  table.info-table td.label {
    font-weight: 700;
    color: #374151;
    width: 32%;
    background: #f3f4f6;
  }
  table.info-table td.value {
    color: #111827;
  }

  h1 {
    font-size: 15pt;
    color: #1e3a8a;
    font-weight: 800;
    margin-top: 20px;
    margin-bottom: 10px;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 4px;
  }
  h2 {
    font-size: 12pt;
    color: #2563eb;
    font-weight: 700;
    margin-top: 14px;
    margin-bottom: 8px;
  }
  p {
    margin-bottom: 10px;
    text-align: justify;
  }
  ul, ol {
    margin-left: 20px;
    margin-bottom: 12px;
  }
  li {
    margin-bottom: 4px;
  }

  /* Image card */
  .figure-box {
    margin: 14px auto 18px auto;
    text-align: center;
    page-break-inside: avoid;
  }
  .figure-box img {
    max-width: 90%;
    max-height: 480px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  .figure-caption {
    font-size: 9pt;
    font-style: italic;
    color: #475569;
    margin-top: 6px;
    text-align: center;
  }

  /* Code block */
  .code-container {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #2563eb;
    border-radius: 6px;
    padding: 10px 14px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    color: #0f172a;
    line-height: 1.45;
    margin: 12px 0 16px 0;
    white-space: pre-wrap;
    page-break-inside: avoid;
  }

  /* Results Table */
  table.results-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 18px 0;
    page-break-inside: avoid;
  }
  table.results-table th {
    background: #1e3a8a;
    color: #fff;
    padding: 8px 12px;
    font-size: 9.5pt;
    text-align: left;
    border: 1px solid #1e3a8a;
  }
  table.results-table td {
    padding: 7px 12px;
    border: 1px solid #e2e8f0;
    font-size: 9pt;
  }
  table.results-table tr:nth-child(even) td {
    background: #f8fafc;
  }
  .status-badge-pass {
    background: #ecfdf5;
    color: #059669;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
  }
</style>
</head>
<body>

  <!-- COVER / CANDIDATE INFORMATION -->
  <div class="doc-org">Arch Technologies — Remote Internship &amp; Training Program</div>
  <div class="doc-title">Month 1 Project Submission Report — Android App Development</div>

  <table class="info-table">
    <tr>
      <th colspan="2">CANDIDATE INFORMATION &amp; PROJECT CREDENTIALS</th>
    </tr>
    <tr>
      <td class="label">Candidate Full Name</td>
      <td class="value"><strong>Rotana NOB</strong></td>
    </tr>
    <tr>
      <td class="label">Internship Domain</td>
      <td class="value"><strong>Android App Development</strong></td>
    </tr>
    <tr>
      <td class="label">University / Institution</td>
      <td class="value"><strong>Asia Euro University (AEU)</strong></td>
    </tr>
    <tr>
      <td class="label">Field of Study / Major</td>
      <td class="value">Computer Science &amp; Software Engineering</td>
    </tr>
    <tr>
      <td class="label">Primary Email Address</td>
      <td class="value"><code>nobrothana180703@gmail.com</code></td>
    </tr>
    <tr>
      <td class="label">Contact Phone Number</td>
      <td class="value">+855 87 986 045</td>
    </tr>
    <tr>
      <td class="label">Submission Period</td>
      <td class="value">Month 1 Assignment (October 2026)</td>
    </tr>
    <tr>
      <td class="label">GitHub Developer Profile</td>
      <td class="value"><a href="https://github.com/Rotananob">https://github.com/Rotananob</a></td>
    </tr>
    <tr>
      <td class="label">Repository URL</td>
      <td class="value"><a href="https://github.com/Rotananob/Arch-Technologies_MobileApp">https://github.com/Rotananob/Arch-Technologies_MobileApp</a></td>
    </tr>
  </table>

  <!-- SECTION 1 -->
  <h1>1. Executive Summary</h1>
  <p>
    During my first month in the <strong>Arch Technologies Remote Mobile App Development Internship</strong>, I engineered, verified, and delivered two complete, production-grade applications meeting contemporary industry standards:
  </p>
  <ul>
    <li><strong>Task 1 — College Alert Application:</strong> Engineered with <strong>Flutter 3.x</strong>, <strong>Riverpod 2.6</strong>, and a <strong>NestJS + PostgreSQL</strong> relational backend. It delivers real-time campus event alerts, urgent examination notices, interactive calendar scheduling, offline bookmarking, and native bilingual localization supporting English and Khmer Unicode with typography optimized for readability.</li>
    <li><strong>Task 2 — ShopSphere Mobile E-Commerce Application:</strong> Engineered with <strong>100% Native Android Kotlin</strong>, <strong>Jetpack Compose</strong>, <strong>Room Database</strong>, and a <strong>NestJS + PostgreSQL</strong> backend. It implements an authoritative cart computation engine, a peer-to-peer C2C marketplace (&quot;Sell Your Product&quot;), concurrency-safe SQL stock locks, and a simulated PCI-DSS compliant payment sandbox with Luhn algorithm card validation.</li>
  </ul>
  <p>
    Both systems strictly adhere to Clean Architecture principles, operate with verified relational data persistence, and pass all 35 automated test suites with 100% compliance.
  </p>

  <!-- SECTION 2: TASK 1 -->
  <div class="page-break"></div>
  <h1>2. Task 1: College Alert Application</h1>
  <p>
    College Alert provides university students with a centralized, reliable hub for discovering campus announcements, midterm exam schedules, career workshops, and urgent safety broadcasts without missing deadlines.
  </p>

  <h2>2.1 Architecture &amp; Core Technical Features</h2>
  <ul>
    <li><strong>Presentation Layer:</strong> Flutter 3.x with Riverpod StateNotifier architecture and declarative GoRouter navigation.</li>
    <li><strong>Bilingual Localization Engine:</strong> Integrated ARB resource bundles (<code>app_en.arb</code> and <code>app_km.arb</code>) paired with Google Font <em>Kantumruy Pro</em> and a 1-tap instant language switch pill in the top navigation bar.</li>
    <li><strong>Campus Calendar &amp; Offline Bookmarks:</strong> Interactive schedule view enabling students to browse daily agendas, filter events by faculty or category, and store bookmarks offline.</li>
    <li><strong>Backend Service:</strong> Modular NestJS REST API with Prisma ORM and PostgreSQL 17 relational database.</li>
    <li><strong>Adaptive Viewport Layout:</strong> Dynamic layout providing a <code>NavigationRail</code> sidebar on widescreen and tablet viewports (&ge; 720px) and a clean single-line <code>NavigationBar</code> on mobile devices.</li>
  </ul>

  <h2>2.2 Mobile Visual Interface Showcase</h2>

  <div class="figure-box">
    <img src="${images.task1_home}" alt="Figure 1: Task 1 College Alert Home Feed">
    <div class="figure-caption">Figure 1: Task 1 College Alert — Campus Home Feed with Priority Exam Notice, Featured Expo Hero &amp; Category Filter Chips</div>
  </div>

  <div class="figure-box">
    <img src="${images.task1_event_detail}" alt="Figure 2: Event Details Screen">
    <div class="figure-caption">Figure 2: Task 1 College Alert — Event Detail Screen with Live Capacity Tracker (142/300 spots) and Booking CTA</div>
  </div>

  <div class="figure-box">
    <img src="${images.task1_notifications}" alt="Figure 3: Notifications Center">
    <div class="figure-caption">Figure 3: Task 1 College Alert — Notifications Center with Urgent Exam Hall Allotment Dispatch &amp; Unread Badges</div>
  </div>

  <div class="figure-box">
    <img src="${images.task1_calendar_bookmarks}" alt="Figure 4: Campus Calendar View">
    <div class="figure-caption">Figure 4: Task 1 College Alert — Campus Calendar Schedule View with Scheduled Academic Agenda &amp; Bookmarks</div>
  </div>

  <div class="figure-box">
    <img src="${images.task1_bilingual_khmer}" alt="Figure 5: Bilingual Khmer Localization">
    <div class="figure-caption">Figure 5: Task 1 College Alert — Native Khmer Localization UI with Kantumruy Pro Typography &amp; 1-Tap Language Switcher</div>
  </div>

  <h2>2.3 Implementation Code Section (Flutter)</h2>
  <p>The following Flutter widget illustrates the event rendering component supporting bilingual titles, category badging, and bookmark toggles:</p>

  <div class="code-container">// Flutter EventCard UI Component with Status Badges and Bookmarking
class EventCard extends StatelessWidget {
  final Map&lt;String, dynamic&gt; event;
  final bool isKhmer;
  final bool isBookmarked;
  final VoidCallback onTap;
  final VoidCallback onBookmarkToggle;

  const EventCard({
    super.key,
    required this.event,
    this.isKhmer = false,
    this.isBookmarked = false,
    required this.onTap,
    required this.onBookmarkToggle,
  });

  @override
  Widget build(BuildContext context) {
    final title = isKhmer &amp;&amp; event['titleKh'] != null ? event['titleKh'] : event['title'];
    final priority = event['priorityAlert'] as bool? ?? false;
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(children: [
            Row(children: [
              StatusBadge(label: event['category']?['name'] ?? 'General', color: priority ? Colors.red : Colors.blue),
              IconButton(icon: Icon(isBookmarked ? Icons.bookmark : Icons.bookmark_border), onPressed: onBookmarkToggle),
            ]),
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            Text(event['location'] ?? 'Campus', style: Theme.of(context).textTheme.bodySmall),
          ]),
        ),
      ),
    );
  }
}</div>

  <!-- SECTION 3: TASK 2 -->
  <div class="page-break"></div>
  <h1>3. Task 2: ShopSphere Mobile E-Commerce Application</h1>
  <p>
    ShopSphere is an advanced peer-to-peer (C2C) and merchant mobile marketplace engineered with <strong>100% Native Android Kotlin</strong> and <strong>Jetpack Compose</strong>. Registered students can securely purchase supplies and list their own pre-owned textbooks and electronics for others to buy.
  </p>

  <h2>3.1 Visual Design &amp; Native Compose UI Showcase</h2>

  <div class="figure-box">
    <img src="${images.task2_shopsphere_catalog}" alt="Figure 6: ShopSphere Catalog">
    <div class="figure-caption">Figure 6: Task 2 ShopSphere — Native Android Kotlin Jetpack Compose Product Catalog with Student Pricing &amp; Cart Badges</div>
  </div>

  <div class="figure-box">
    <img src="${images.task2_seller_studio}" alt="Figure 7: C2C Seller Studio">
    <div class="figure-caption">Figure 7: Task 2 ShopSphere — Peer-to-Peer (C2C) Seller Studio (&quot;Sell Your Product&quot;) with Condition &amp; Stock Controls</div>
  </div>

  <div class="figure-box">
    <img src="${images.task2_checkout_payment_safety}" alt="Figure 8: Payment Safety Sandbox">
    <div class="figure-caption">Figure 8: Task 2 ShopSphere — PCI-DSS &amp; Luhn Payment Safety Sandbox with MOD 10 Checksum &amp; Concurrency SQL Locks</div>
  </div>

  <h2>3.2 Data Security &amp; Payment Safety Architecture</h2>
  <p>
    In strict compliance with the task specification (<em>&quot;Addressing data security and payment safety is crucial&quot;</em>):
  </p>
  <ul>
    <li><strong>Luhn Algorithm Checksum:</strong> Validates payment card numbers via the industry-standard MOD 10 arithmetic algorithm before checkout submission.</li>
    <li><strong>PCI-DSS Card Number Masking:</strong> Primary Account Numbers are never stored in plaintext and are masked as <code>**** **** **** 1234</code> with unique tokenized transaction hashes (<code>TXN-XXXXXXXX</code>).</li>
    <li><strong>Concurrency-Safe SQL Transactions:</strong> Server-side atomic locks (<code>prisma.$transaction</code>) prevent overselling and double-spending across simultaneous checkouts.</li>
    <li><strong>Cryptographic Password Hashing:</strong> Bcrypt with 10 salt rounds secures all user credentials in PostgreSQL.</li>
  </ul>

  <h2>3.3 Implementation Code Section (Kotlin)</h2>
  <p>The following Kotlin models handle authoritative shopping cart arithmetic and stock boundary validation:</p>

  <div class="code-container">// Kotlin Authoritative Cart Calculation &amp; Stock Validation Model
data class CartItem(
    val id: String,
    val productId: String,
    val productTitle: String,
    val unitPrice: Double,
    val quantity: Int,
    val maxAvailableStock: Int
) {
    val totalPrice: Double get() = unitPrice * quantity
    val isStockSufficient: Boolean get() = quantity &lt;= maxAvailableStock
}

data class CartSummary(
    val items: List&lt;CartItem&gt; = emptyList(),
    val subtotal: Double = 0.0,
    val deliveryFee: Double = 2.00,
    val total: Double = 0.0
) {
    companion object {
        fun calculate(items: List&lt;CartItem&gt;, deliveryFee: Double = 2.00): CartSummary {
            val subtotal = items.sumOf { it.totalPrice }
            val fee = if (items.isEmpty()) 0.0 else deliveryFee
            return CartSummary(items = items, subtotal = subtotal, deliveryFee = fee, total = subtotal + fee)
        }
    }
}</div>

  <!-- SECTION 4: TEST RESULTS -->
  <div class="page-break"></div>
  <h1>4. Consolidated Automated Test Results</h1>
  <p>
    All unit, widget, and integration test suites were executed using the automated multi-platform runner:
  </p>

  <div class="figure-box">
    <img src="${images.test_suite_passed}" alt="Figure 9: Test Suite Results">
    <div class="figure-caption">Figure 9: Verification — Multi-Platform Automated Test Suite Execution (35/35 Tests Passing with 100% Rate)</div>
  </div>

  <table class="results-table">
    <thead>
      <tr>
        <th>Test Suite</th>
        <th>Framework / Tool</th>
        <th>Count</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Task 1 Mobile Tests</strong></td>
        <td>Flutter Test / WidgetTester</td>
        <td>8 Tests</td>
        <td><span class="status-badge-pass">&#10004; PASSED (100%)</span></td>
      </tr>
      <tr>
        <td><strong>Task 1 Backend Tests</strong></td>
        <td>Jest / ts-jest</td>
        <td>6 Tests</td>
        <td><span class="status-badge-pass">&#10004; PASSED (100%)</span></td>
      </tr>
      <tr>
        <td><strong>Task 2 Android Tests</strong></td>
        <td>JUnit 4 / Kotlin</td>
        <td>9 Tests</td>
        <td><span class="status-badge-pass">&#10004; PASSED (100%)</span></td>
      </tr>
      <tr>
        <td><strong>Task 2 Backend Tests</strong></td>
        <td>Jest / ts-jest</td>
        <td>12 Tests</td>
        <td><span class="status-badge-pass">&#10004; PASSED (100%)</span></td>
      </tr>
      <tr style="background:#eff6ff; font-weight:bold;">
        <td>TOTAL TEST SUITE</td>
        <td>Multi-Platform Automation</td>
        <td>35 Tests</td>
        <td><span class="status-badge-pass" style="background:#1e3a8a; color:#fff;">&#10004; 100% PASS RATE</span></td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 5: CONCLUSION -->
  <h1>5. Conclusion &amp; Professional Growth Summary</h1>
  <p>
    The first month of the Arch Technologies Remote Mobile App Development Internship has provided an exceptional foundation in modern enterprise mobile architecture. Through the development of College Alert (Flutter &amp; NestJS) and ShopSphere (Native Android Kotlin &amp; Jetpack Compose), I strengthened key competencies across:
  </p>
  <ul>
    <li>Declarative UI engineering with Material Design 3 and responsive layouts.</li>
    <li>Multilingual system design and Unicode font rendering.</li>
    <li>Enterprise database transactions and ACID-compliant concurrency safety.</li>
    <li>Financial-grade checkout flows and PCI-DSS data security standards.</li>
    <li>Multi-platform automated testing and CI/CD quality assurance.</li>
  </ul>
  <p>
    Both applications are production-ready, fully documented, and hosted in the public repository for institutional and employer review.
  </p>

</body>
</html>
`;

async function run() {
  const tempHtml = path.resolve('temp_report.html');
  fs.writeFileSync(tempHtml, htmlContent, 'utf-8');

  console.log('📄 Converting HTML report to vector PDF via Edge headless...');
  const cmd = `${edgePath} --headless --disable-gpu --print-to-pdf="${outputPdf}" --no-pdf-header-footer "file://${tempHtml.replace(/\\\\/g, '/')}"`;
  try {
    execSync(cmd);
    console.log('🎉 SUCCESS: Created PDF report at:', outputPdf);
  } catch (err) {
    console.error('❌ Error converting to PDF:', err.message);
  } finally {
    if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
  }
}

run();
