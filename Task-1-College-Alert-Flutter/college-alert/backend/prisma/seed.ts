import { PrismaClient, Role, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting College Alert database seed...');

  // 1. Clean existing seed data
  await prisma.notification.deleteMany();
  await prisma.savedEvent.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const salt = await bcrypt.genSalt(10);
  const studentPasswordHash = await bcrypt.hash('Password123!', salt);
  const adminPasswordHash = await bcrypt.hash('AdminPassword2026!', salt);

  const studentUser = await prisma.user.create({
    data: {
      email: 'rotana.nob@university.edu',
      passwordHash: studentPasswordHash,
      fullName: 'Rotana Nob',
      studentId: 'STU-2026-089',
      department: 'Computer Science & Software Engineering',
      phoneNumber: '+85512345678',
      role: Role.STUDENT,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      preferences: {
        create: {
          eventAnnouncements: true,
          upcomingReminders: true,
          registrationUpdates: true,
          generalAlerts: true,
        },
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@collegealert.edu',
      passwordHash: adminPasswordHash,
      fullName: 'Dr. Sarah Vance',
      studentId: 'ADM-001',
      department: 'Office of Student Affairs',
      phoneNumber: '+85587654321',
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      preferences: {
        create: {
          eventAnnouncements: true,
          upcomingReminders: true,
          registrationUpdates: true,
          generalAlerts: true,
        },
      },
    },
  });

  console.log(`👤 Created Student: ${studentUser.email} (Password: Password123!)`);
  console.log(`👤 Created Admin: ${adminUser.email} (Password: AdminPassword2026!)`);

  // 3. Create Categories
  const categoriesData = [
    {
      name: 'Academic',
      nameKh: 'ការសិក្សា',
      slug: 'academic',
      icon: 'school',
      colorHex: '#1E40AF', // Deep blue
    },
    {
      name: 'Workshops & Tech',
      nameKh: 'សិក្ខាសាលា & បច្ចេកវិទ្យា',
      slug: 'workshops-tech',
      icon: 'lightbulb',
      colorHex: '#0D9488', // Teal
    },
    {
      name: 'Career & Internship',
      nameKh: 'អាជីពការងារ',
      slug: 'career',
      icon: 'work',
      colorHex: '#7C3AED', // Purple
    },
    {
      name: 'Sports & Wellness',
      nameKh: 'កីឡា & សុខភាព',
      slug: 'sports-wellness',
      icon: 'fitness_center',
      colorHex: '#D97706', // Amber
    },
    {
      name: 'Campus Life & Arts',
      nameKh: 'ជីវិតនិស្សិត & សិល្បៈ',
      slug: 'campus-life',
      icon: 'groups',
      colorHex: '#E11D48', // Rose red
    },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) => prisma.category.create({ data: cat })),
  );
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));
  console.log(`📁 Created ${categories.length} categories`);

  // 4. Create Realistic Campus Events
  const now = new Date();
  const addDays = (days: number, hours = 9) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hours, 0, 0, 0);
    return d;
  };

  const eventsData = [
    {
      title: 'Annual Engineering & Software Expo 2026',
      titleKh: 'ពិព័រណ៍វិស្វកម្ម និងបច្ចេកវិទ្យាប្រចាំឆ្នាំ ២០២៦',
      description:
        'Join the university flagship technology exposition showcasing over 60 capstone projects from software engineering, artificial intelligence, robotics, and cloud computing students. Industry judges from leading regional tech firms will award top honours.',
      descriptionKh:
        'ចូលរួមទស្សនាពិព័រណ៍បច្ចេកវិទ្យាដ៏ធំបំផុតប្រចាំឆ្នាំ ដែលបង្ហាញគម្រោងឆ្នើមជាង ៦០ ពីនិស្សិតផ្នែកវិស្វកម្មសូហ្វវែរ បញ្ញាសិប្បនិម្មិត និងរ៉ូបូត។ មានការចូលរួមវាយតម្លៃដោយផ្ទាល់ពីអ្នកជំនាញក្រុមហ៊ុនបច្ចេកវិទ្យាល្បីៗ។',
      categoryId: catMap.get('workshops-tech')!,
      location: 'Grand Exhibition Hall, Building Innovation C',
      isOnline: false,
      organizer: 'Faculty of Science & Technology',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      startDate: addDays(3, 9),
      endDate: addDays(3, 17),
      isRegistrationRequired: true,
      maxCapacity: 300,
      isPublished: true,
      isFeatured: true,
      priorityAlert: false,
    },
    {
      title: '⚠️ URGENT: Midterm Exam Schedule & Hall Allotment Released',
      titleKh: '⚠️ បន្ទាន់៖ ការប្រកាសកាលវិភាគប្រឡងឆមាស និងលេខបន្ទប់ប្រឡង',
      description:
        'The Department of Academic Affairs has officially published the Semester 1 Midterm Exam schedule. All students must download and verify their hall tickets by October 30. No electronic devices are permitted inside examination halls.',
      descriptionKh:
        'ការិយាល័យកិច្ចការសិក្សាបានប្រកាសជាផ្លូវការនូវកាលវិភាគប្រឡងឆមាសទី ១។ និស្សិតទាំងអស់ត្រូវត្រួតពិនិត្យលេខតុ និងបន្ទប់ប្រឡងឱ្យបានមុនថ្ងៃទី ៣០ តុលា។ ហាមដាច់ខាតនូវឧបករណ៍អេឡិចត្រូនិកក្នុងបន្ទប់ប្រឡង។',
      categoryId: catMap.get('academic')!,
      location: 'Academic Affairs Portal & Main Campus Notice Boards',
      isOnline: true,
      meetingUrl: 'https://portal.university.edu/exams',
      organizer: 'Academic Affairs Board',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      startDate: addDays(1, 8),
      endDate: addDays(7, 18),
      isRegistrationRequired: false,
      isPublished: true,
      isFeatured: false,
      priorityAlert: true,
    },
    {
      title: 'Applied AI & Generative Intelligence Masterclass',
      titleKh: 'វគ្គបណ្ដុះបណ្ដាលស្ដីពីបញ្ញាសិប្បនិម្មិត AI និងការអនុវត្តជាក់ស្ដែង',
      description:
        'A comprehensive hands-on workshop covering LLMs, multimodal AI agent workflows, and real-time streaming architectures. Attendees will build and deploy a working conversational agent during the lab session. Laptops required.',
      descriptionKh:
        'សិក្ខាសាលាអនុវត្តផ្ទាល់លើបច្ចេកវិទ្យា Large Language Models, Multi-agent workflows និង Real-time streaming។ សិក្ខាកាមនឹងបានអនុវត្តជាក់ស្ដែងក្នុងការបង្កើត AI agent ផ្ទាល់ខ្លួន។',
      categoryId: catMap.get('workshops-tech')!,
      location: 'Advanced Computing Lab 4, IT Wing',
      isOnline: false,
      organizer: 'Google Developer Student Clubs (GDSC)',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      startDate: addDays(5, 14),
      endDate: addDays(5, 17),
      isRegistrationRequired: true,
      maxCapacity: 60,
      isPublished: true,
      isFeatured: false,
      priorityAlert: false,
    },
    {
      title: 'Campus Career Fair & Tech Internship Drive 2026',
      titleKh: 'ពិព័រណ៍ការងារ និងឱកាសហាត់ការសម្រាប់និស្សិត ២០២៦',
      description:
        'Connect directly with HR directors and lead engineers from 35+ partner organizations including Arch Technologies, Smart Axiata, ABA Bank, and international tech ventures. Bring at least 5 copies of your updated resume.',
      descriptionKh:
        'ជួបពិភាក្សាផ្ទាល់ជាមួយនាយកធនធានមនុស្ស និងវិស្វករជាន់ខ្ពស់មកពីក្រុមហ៊ុនដៃគូជាង ៣៥ រួមទាំង Arch Technologies, Smart, និងធនាគារ ABA។ សូមត្រៀម CV បច្ចុប្បន្នភាពយ៉ាងតិច ៥ ច្បាប់។',
      categoryId: catMap.get('career')!,
      location: 'University Gymnasium & Conference Center',
      isOnline: false,
      organizer: 'Career Services Center',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
      startDate: addDays(8, 9),
      endDate: addDays(8, 16),
      isRegistrationRequired: true,
      maxCapacity: 500,
      isPublished: true,
      isFeatured: true,
      priorityAlert: false,
    },
    {
      title: 'Inter-University Basketball Tournament Finals',
      titleKh: 'ការប្រកួតបាល់បោះផ្ដាច់ព្រ័ត្រអន្តរសកលវិទ្យាល័យ',
      description:
        'Come cheer for the University Tigers as they face off against the reigning champions in the Grand Championship Final. Free admission for all students with valid student ID cards. Halftime show featuring the university dance troupe.',
      descriptionKh:
        'ចូលរួមលើកទឹកចិត្តក្រុមបាល់បោះសាកលវិទ្យាល័យយើង ក្នុងការប្រកួតដណ្ដើមពានរង្វាន់ជើងឯក។ ចូលរួមដោយសេរីសម្រាប់និស្សិតដែលមានកាតសិស្ស។ មានការសម្ដែងពិសេសនៅវគ្គពាក់កណ្ដាលតង់។',
      categoryId: catMap.get('sports-wellness')!,
      location: 'Main Sports Complex, Court 1',
      isOnline: false,
      organizer: 'Department of Athletics & Student Council',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      startDate: addDays(4, 16),
      endDate: addDays(4, 19),
      isRegistrationRequired: false,
      isPublished: true,
      isFeatured: false,
      priorityAlert: false,
    },
    {
      title: 'Khmer Culture & Heritage Student Festival',
      titleKh: 'មហោស្រពវប្បធម៌ និងបេតិកភណ្ឌខ្មែរសម្រាប់និស្សិត',
      description:
        'Celebrate traditional Khmer performing arts, classical music, traditional cuisine showcases, and interactive cultural workshops organized by the Student Cultural Union. Open to the entire campus community.',
      descriptionKh:
        'អបអរសាទរសិល្បៈវប្បធម៌ខ្មែរ តន្ត្រីបុរាណ ការតាំងពិព័រណ៍ម្ហូបអាហារ និងសិក្ខាសាលាវប្បធម៌ ដែលរៀបចំឡើងដោយសមាគមនិស្សិត។ បើកទូលាយសម្រាប់សហគមន៍សាកលវិទ្យាល័យទាំងមូល។',
      categoryId: catMap.get('campus-life')!,
      location: 'Campus Courtyard & Open Amphitheater',
      isOnline: false,
      organizer: 'Student Cultural Union',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      startDate: addDays(12, 10),
      endDate: addDays(12, 21),
      isRegistrationRequired: false,
      isPublished: true,
      isFeatured: false,
      priorityAlert: false,
    },
  ];

  const createdEvents = await Promise.all(
    eventsData.map((ev) => prisma.event.create({ data: ev })),
  );
  console.log(`📅 Created ${createdEvents.length} realistic campus events`);

  // 5. Create Sample Registrations and Saved Events for Rotana Nob
  await prisma.eventRegistration.create({
    data: {
      userId: studentUser.id,
      eventId: createdEvents[0].id, // Registered for Tech Expo
      status: 'REGISTERED',
    },
  });

  await prisma.savedEvent.create({
    data: {
      userId: studentUser.id,
      eventId: createdEvents[2].id, // Saved AI Masterclass
    },
  });

  // 6. Create Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        eventId: createdEvents[1].id,
        title: '🚨 Urgent: Midterm Schedule Published',
        titleKh: '🚨 បន្ទាន់៖ កាលវិភាគប្រឡងឆមាសត្រូវបានប្រកាស',
        message: 'Midterm exam timetable has been posted. Please check your assigned rooms.',
        messageKh: 'កាលវិភាគប្រឡងឆមាសត្រូវបានបង្ហោះ។ សូមត្រួតពិនិត្យបន្ទប់ប្រឡងរបស់អ្នក។',
        type: NotificationType.EVENT_ANNOUNCEMENT,
        isRead: false,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        userId: studentUser.id,
        eventId: createdEvents[0].id,
        title: 'Registration Confirmed: Tech Expo 2026',
        titleKh: 'ការចុះឈ្មោះជោគជ័យ៖ ពិព័រណ៍បច្ចេកវិទ្យា ២០២៦',
        message: 'Your seat for the Annual Engineering Expo has been reserved.',
        messageKh: 'កន្លែងអង្គុយរបស់អ្នកត្រូវបានកក់ទុកដោយជោគជ័យ។',
        type: NotificationType.REGISTRATION_CONFIRMED,
        isRead: true,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        userId: studentUser.id,
        title: 'Welcome to College Alert!',
        titleKh: 'សូមស្វាគមន៍មកកាន់ College Alert!',
        message: 'Stay updated with important campus events, exams, and university alerts.',
        messageKh: 'ទទួលបានដំណឹងថ្មីៗទាក់ទងនឹងព្រឹត្តិការណ៍សាលា ការប្រឡង និងការជូនដំណឹងបន្ទាន់។',
        type: NotificationType.GENERAL,
        isRead: true,
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
    ],
  });

  console.log('🔔 Created notifications for student user');
  console.log('✅ College Alert database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
