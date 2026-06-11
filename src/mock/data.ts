import type {
  User, Space, Reservation, Feedback, Rating, Complaint, Suggestion,
} from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    full_name: 'علی رضایی',
    email: 'student@uk.ac.ir',
    student_id: '98100001',
    phone: '09121234567',
    department: 'مهندسی کامپیوتر',
    role: 'student',
    is_active: true,
    is_verified: true,
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    full_name: 'مدیر سامانه',
    email: 'admin@uk.ac.ir',
    student_id: undefined,
    phone: '09189876543',
    department: 'معاونت دانشجویی',
    role: 'admin',
    is_active: true,
    is_verified: true,
    created_at: '2023-06-01T10:00:00Z',
  },
  {
    id: 3,
    full_name: 'مریم محمدی',
    email: 'maryam@uk.ac.ir',
    student_id: '99200034',
    phone: '09351234567',
    department: 'علوم پایه',
    role: 'student',
    is_active: true,
    is_verified: true,
    created_at: '2024-02-20T08:00:00Z',
  },
  {
    id: 4,
    full_name: 'تشکل فرهنگی هنری',
    email: 'cultural@uk.ac.ir',
    student_id: undefined,
    phone: '09121111111',
    department: 'فرهنگ و هنر',
    role: 'organization',
    is_active: true,
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const mockSpaces: Space[] = [
  {
    id: 1,
    name: 'زمین فوتبال اصلی',
    name_en: 'Main Football Field',
    space_type: 'football_field',
    description: 'زمین فوتبال استاندارد با چمن مصنوعی و روشنایی کامل برای بازی شبانه. مناسب برای مسابقات و تمرین‌های رسمی.',
    capacity: 22,
    location: 'ضلع غربی دانشگاه',
    floor: 'همکف',
    building: 'مجموعه ورزشی',
    status: 'active',
    amenities: ['رختکن', 'دوش', 'نور شبانه', 'سکوی تماشاگر', 'پارکینگ'],
    rules: 'استفاده از کفش استادیومی الزامی است. بازی در ساعات ۸ صبح تا ۱۰ شب مجاز است. حداکثر ۲ ساعت رزرو پیاپی مجاز است.',
    image_url: undefined,
    avg_rating: 4.3,
    total_ratings: 28,
    requires_admin_approval: true,
    advance_booking_days: 7,
    min_advance_hours: 24,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'زمین فوتسال شماره ۱',
    name_en: 'Futsal Court 1',
    space_type: 'futsal_field',
    description: 'زمین فوتسال سرپوشیده با کفپوش پلیمری. مناسب برای مسابقات و تمرین در تمام فصول.',
    capacity: 10,
    location: 'ساختمان ورزشی مرکزی',
    floor: 'طبقه همکف',
    building: 'سالن ورزشی مرکزی',
    status: 'active',
    amenities: ['رختکن', 'دوش', 'تهویه مطبوع', 'بوفه'],
    rules: 'استفاده از کتانی مناسب الزامی است. رزرو حداقل ۲۴ ساعت قبل.',
    image_url: undefined,
    avg_rating: 4.5,
    total_ratings: 42,
    requires_admin_approval: true,
    advance_booking_days: 14,
    min_advance_hours: 24,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'زمین فوتسال شماره ۲',
    name_en: 'Futsal Court 2',
    space_type: 'futsal_field',
    description: 'زمین فوتسال روباز با نور مصنوعی. مناسب برای تمرینات غیررسمی و بازی‌های دوستانه.',
    capacity: 10,
    location: 'ضلع شمالی دانشگاه',
    floor: 'همکف',
    building: 'مجموعه ورزشی',
    status: 'active',
    amenities: ['رختکن', 'نور شبانه'],
    rules: 'حداکثر ۱.۵ ساعت در یک نوبت. رزرو از ساعت ۸ تا ۲۲.',
    image_url: undefined,
    avg_rating: 3.9,
    total_ratings: 19,
    requires_admin_approval: true,
    advance_booking_days: 7,
    min_advance_hours: 12,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'پلاتوی فرهنگی مرکزی',
    name_en: 'Central Cultural Plaza',
    space_type: 'cultural_plaza',
    description: 'فضای باز فرهنگی در قلب دانشگاه، مناسب برای اجراهای هنری، نمایش‌ها، غرفه‌های کتاب و رویدادهای فرهنگی.',
    capacity: 500,
    location: 'مرکز دانشگاه',
    floor: 'همکف',
    building: 'فضای باز مرکزی',
    status: 'active',
    amenities: ['سیستم صوتی', 'صحنه نمایش', 'برق', 'آب', 'سرویس بهداشتی'],
    rules: 'استفاده از موسیقی با صدای بلند تنها با مجوز خاص. پایان برنامه تا ساعت ۲۱.',
    image_url: undefined,
    avg_rating: 4.1,
    total_ratings: 35,
    requires_admin_approval: true,
    advance_booking_days: 30,
    min_advance_hours: 48,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'سالن سمینار الف',
    name_en: 'Seminar Hall A',
    space_type: 'seminar_hall',
    description: 'سالن مجهز برای برگزاری سمینارها، کارگاه‌ها و جلسات آموزشی. مجهز به پروژکتور و سیستم صوتی پیشرفته.',
    capacity: 80,
    location: 'ساختمان اداری، طبقه دوم',
    floor: 'طبقه دوم',
    building: 'ساختمان اداری',
    status: 'active',
    amenities: ['پروژکتور', 'سیستم صوتی', 'وایت‌برد', 'تهویه مطبوع', 'WiFi', 'میکروفن'],
    rules: 'حداکثر ۸۰ نفر. رزرو برای همایش‌های علمی و آموزشی.',
    image_url: undefined,
    avg_rating: 4.6,
    total_ratings: 54,
    requires_admin_approval: true,
    advance_booking_days: 30,
    min_advance_hours: 48,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    name: 'سالن سمینار ب',
    name_en: 'Seminar Hall B',
    space_type: 'seminar_hall',
    description: 'سالن سمینار کوچک‌تر مناسب برای جلسات، دفاعیه‌های پایان‌نامه و کلاس‌های آموزشی.',
    capacity: 40,
    location: 'ساختمان آموزشی، طبقه اول',
    floor: 'طبقه اول',
    building: 'ساختمان آموزشی',
    status: 'active',
    amenities: ['پروژکتور', 'وایت‌برد', 'تهویه مطبوع', 'WiFi'],
    rules: 'حداکثر ۴۰ نفر. اولویت با دفاعیه‌های پایان‌نامه.',
    image_url: undefined,
    avg_rating: 4.4,
    total_ratings: 31,
    requires_admin_approval: true,
    advance_booking_days: 30,
    min_advance_hours: 24,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    name: 'سالن کنفرانس بزرگ',
    name_en: 'Large Conference Hall',
    space_type: 'conference_hall',
    description: 'سالن همایش بزرگ با ظرفیت بالا، مناسب برای کنفرانس‌های بین‌المللی، مراسم فارغ‌التحصیلی و رویدادهای بزرگ دانشگاهی.',
    capacity: 300,
    location: 'ساختمان مرکزی، طبقه همکف',
    floor: 'همکف',
    building: 'ساختمان مرکزی',
    status: 'active',
    amenities: ['سیستم صوتی حرفه‌ای', 'پروژکتور بزرگ', 'تهویه مطبوع', 'WiFi', 'استیج', 'روشنایی حرفه‌ای'],
    rules: 'رزرو با حداقل ۷۲ ساعت قبل از برنامه. نیاز به تأیید معاونت دانشجویی.',
    image_url: undefined,
    avg_rating: 4.7,
    total_ratings: 22,
    requires_admin_approval: true,
    advance_booking_days: 60,
    min_advance_hours: 72,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 8,
    name: 'غرفه نمایشگاهی شماره ۱',
    name_en: 'Exhibition Booth 1',
    space_type: 'exhibition_booth',
    description: 'غرفه مستقل برای نمایشگاه‌های دانشجویی، جشنواره‌های فناوری و رویدادهای کارآفرینی.',
    capacity: 20,
    location: 'راهروی اصلی ساختمان مرکزی',
    floor: 'همکف',
    building: 'ساختمان مرکزی',
    status: 'active',
    amenities: ['میز', 'صندلی', 'برق', 'پوستر استند'],
    rules: 'رزرو برای رویدادهای فرهنگی و علمی. حداکثر ۳ روز متوالی.',
    image_url: undefined,
    avg_rating: 3.8,
    total_ratings: 15,
    requires_admin_approval: true,
    advance_booking_days: 30,
    min_advance_hours: 48,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 9,
    name: 'غرفه نمایشگاهی شماره ۲',
    name_en: 'Exhibition Booth 2',
    space_type: 'exhibition_booth',
    description: 'غرفه نمایشگاهی در محوطه خارجی، مناسب برای جشنواره‌های فصلی و رویدادهای محوطه.',
    capacity: 15,
    location: 'ورودی اصلی دانشگاه',
    floor: 'فضای باز',
    building: 'محوطه خارجی',
    status: 'active',
    amenities: ['سایبان', 'میز', 'صندلی', 'برق'],
    rules: 'رزرو برای رویدادهای عمومی دانشگاه.',
    image_url: undefined,
    avg_rating: 4.0,
    total_ratings: 12,
    requires_admin_approval: true,
    advance_booking_days: 14,
    min_advance_hours: 48,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 10,
    name: 'غرفه جشنواره علم و فناوری',
    name_en: 'Science & Technology Festival Booth',
    space_type: 'festival_booth',
    description: 'غرفه ویژه جشنواره علم و فناوری با امکانات ارائه پروژه و نمایش محصولات.',
    capacity: 25,
    location: 'سالن همایش، بخش نمایشگاهی',
    floor: 'همکف',
    building: 'ساختمان مرکزی',
    status: 'maintenance',
    amenities: ['میز نمایشگاهی', 'برق ۲۲۰ ولت', 'اینترنت', 'پانل نمایش', 'قفسه'],
    rules: 'ویژه جشنواره‌های رسمی دانشگاه.',
    image_url: undefined,
    avg_rating: 4.2,
    total_ratings: 8,
    requires_admin_approval: true,
    advance_booking_days: 30,
    min_advance_hours: 72,
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const mockReservations: Reservation[] = [
  {
    id: 1,
    user_id: 1,
    space_id: 2,
    reservation_date: '2026-06-05',
    start_time: '10:00:00',
    end_time: '12:00:00',
    activity_type: 'sports',
    activity_title: 'تمرین تیم فوتسال دانشکده',
    activity_description: 'جلسه تمرینی هفتگی تیم فوتسال دانشکده مهندسی کامپیوتر',
    expected_attendees: 10,
    organization_name: 'انجمن ورزشی دانشکده کامپیوتر',
    status: 'pending',
    admin_note: undefined,
    created_at: '2026-05-28T09:30:00Z',
    user: mockUsers[0],
    space: mockSpaces[1],
  },
  {
    id: 2,
    user_id: 1,
    space_id: 5,
    reservation_date: '2026-06-10',
    start_time: '14:00:00',
    end_time: '16:00:00',
    activity_type: 'educational',
    activity_title: 'کارگاه برنامه‌نویسی پایتون',
    activity_description: 'کارگاه آموزشی مقدماتی برنامه‌نویسی پایتون برای دانشجویان',
    expected_attendees: 60,
    organization_name: undefined,
    status: 'approved',
    admin_note: 'تأیید شد. لطفاً قبل از برنامه تجهیزات مورد نیاز را اطلاع دهید.',
    created_at: '2026-05-20T14:00:00Z',
    user: mockUsers[0],
    space: mockSpaces[4],
  },
  {
    id: 3,
    user_id: 1,
    space_id: 1,
    reservation_date: '2026-05-20',
    start_time: '16:00:00',
    end_time: '18:00:00',
    activity_type: 'sports',
    activity_title: 'بازی دوستانه فوتبال',
    activity_description: undefined,
    expected_attendees: 22,
    organization_name: undefined,
    status: 'completed',
    admin_note: 'تأیید شد.',
    created_at: '2026-05-15T11:00:00Z',
    user: mockUsers[0],
    space: mockSpaces[0],
  },
  {
    id: 4,
    user_id: 1,
    space_id: 4,
    reservation_date: '2026-05-10',
    start_time: '17:00:00',
    end_time: '20:00:00',
    activity_type: 'cultural',
    activity_title: 'اجرای موسیقی زنده',
    activity_description: 'اجرای موسیقی دانشجویی در فضای باز',
    expected_attendees: 150,
    organization_name: 'انجمن موسیقی دانشجویی',
    status: 'rejected',
    admin_note: 'به دلیل تداخل با برنامه دیگر امکان تأیید وجود ندارد. لطفاً تاریخ دیگری انتخاب کنید.',
    created_at: '2026-05-05T10:00:00Z',
    user: mockUsers[0],
    space: mockSpaces[3],
  },
  {
    id: 5,
    user_id: 3,
    space_id: 6,
    reservation_date: '2026-06-08',
    start_time: '09:00:00',
    end_time: '11:00:00',
    activity_type: 'educational',
    activity_title: 'دفاعیه پایان‌نامه ارشد',
    activity_description: 'دفاعیه پایان‌نامه کارشناسی ارشد - گروه ریاضی',
    expected_attendees: 25,
    organization_name: undefined,
    status: 'pending',
    admin_note: undefined,
    created_at: '2026-05-25T12:00:00Z',
    user: mockUsers[2],
    space: mockSpaces[5],
  },
  {
    id: 6,
    user_id: 4,
    space_id: 7,
    reservation_date: '2026-06-15',
    start_time: '09:00:00',
    end_time: '17:00:00',
    activity_type: 'conference',
    activity_title: 'همایش ملی نوآوری دانشجویی',
    activity_description: 'همایش یک‌روزه با حضور اساتید و دانشجویان سراسر کشور',
    expected_attendees: 250,
    organization_name: 'تشکل فرهنگی هنری دانشگاه',
    status: 'approved',
    admin_note: 'تأیید شد. لطفاً برنامه دقیق را ۳ روز قبل ارسال کنید.',
    created_at: '2026-05-10T08:00:00Z',
    user: mockUsers[3],
    space: mockSpaces[6],
  },
];

export const mockFeedbacks: Feedback[] = [
  {
    id: 1,
    space_id: 2,
    reservation_id: undefined,
    content: 'زمین فوتسال در وضعیت عالی بود. کفپوش تمیز و نور مناسب. پیشنهاد می‌کنم تعداد توپ‌های در اختیار بیشتر شود.',
    is_anonymous: false,
    sentiment: 'positive',
    sentiment_score: 0.85,
    keywords: 'کفپوش،نور،توپ',
    ai_summary: 'بازخورد مثبت با پیشنهاد برای بهبود تجهیزات',
    is_analyzed: true,
    created_at: '2026-05-25T16:00:00Z',
    user: mockUsers[0],
  },
  {
    id: 2,
    space_id: 5,
    reservation_id: undefined,
    content: 'سالن سمینار الف واقعاً عالی است. تجهیزات صوتی و تصویری بسیار باکیفیت. تنها مشکل کمبود پریز برق در سطح سالن است.',
    is_anonymous: false,
    sentiment: 'positive',
    sentiment_score: 0.75,
    keywords: 'تجهیزات،پریز برق',
    ai_summary: 'رضایت از کیفیت تجهیزات با اشاره به نیاز به پریز بیشتر',
    is_analyzed: true,
    created_at: '2026-05-22T11:00:00Z',
    user: mockUsers[2],
  },
];

export const mockRatings: Rating[] = [
  {
    id: 1,
    space_id: 2,
    overall_score: 4.5,
    cleanliness_score: 4.0,
    equipment_score: 4.5,
    management_score: 5.0,
    comment: 'عالی! همه چیز خوب بود.',
    sentiment: 'positive',
    ai_summary: 'رضایت بالا از کیفیت خدمات',
    created_at: '2026-05-23T18:00:00Z',
    user: mockUsers[0],
  },
  {
    id: 2,
    space_id: 5,
    overall_score: 5.0,
    cleanliness_score: 5.0,
    equipment_score: 4.5,
    management_score: 5.0,
    comment: 'بهترین سالن سمینار که تا به حال در اختیار داشتیم.',
    sentiment: 'positive',
    ai_summary: 'رضایت کامل از تمام جنبه‌ها',
    created_at: '2026-05-21T14:00:00Z',
    user: mockUsers[2],
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: 1,
    space_id: 1,
    reservation_id: undefined,
    category: 'noise',
    title: 'سروصدای بیش از حد در زمین فوتبال',
    description: 'در طول هفته گذشته، تیم‌های مستقر در زمین فوتبال صدای بسیار بلندی ایجاد کرده‌اند که مزاحم کلاس‌های مجاور شده است.',
    is_anonymous: false,
    status: 'open',
    priority: 2,
    admin_response: undefined,
    responded_at: undefined,
    sentiment: 'negative',
    ai_analysis: 'شکایت مشروع درباره آلودگی صوتی - نیاز به بررسی فوری',
    created_at: '2026-05-27T10:00:00Z',
    user: mockUsers[0],
  },
  {
    id: 2,
    space_id: 4,
    reservation_id: undefined,
    category: 'equipment',
    title: 'خرابی سیستم صوتی پلاتو',
    description: 'سیستم صوتی پلاتوی فرهنگی در طول اجرای برنامه دچار نقص فنی شد و باعث اختلال در برنامه شد.',
    is_anonymous: false,
    status: 'in_progress',
    priority: 3,
    admin_response: 'موضوع به تیم فنی اطلاع داده شد و تا ۳ روز آینده رفع می‌شود.',
    responded_at: '2026-05-26T15:00:00Z',
    sentiment: 'negative',
    ai_analysis: 'نقص تجهیزاتی نیازمند تعمیر فوری',
    created_at: '2026-05-24T19:00:00Z',
    user: mockUsers[3],
  },
  {
    id: 3,
    space_id: undefined,
    reservation_id: undefined,
    category: 'management',
    title: 'تأخیر در بررسی درخواست‌های رزرو',
    description: 'درخواست رزرو برای سالن سمینار ب بیش از ۵ روز بدون پاسخ مانده است. این امر برنامه‌ریزی برنامه را دشوار می‌کند.',
    is_anonymous: true,
    status: 'resolved',
    priority: 1,
    admin_response: 'با عرض پوزش، به دلیل تعطیلات تأخیر رخ داد. سیستم بهبود یافت.',
    responded_at: '2026-05-20T11:00:00Z',
    sentiment: 'negative',
    ai_analysis: 'مشکل فرآیندی در سرعت پاسخگویی',
    created_at: '2026-05-18T14:00:00Z',
    user: mockUsers[2],
  },
];

export const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    title: 'برگزاری کارگاه هوش مصنوعی در هفته پژوهش',
    description: 'پیشنهاد برگزاری یک دوره کارگاهی ۳ روزه درباره کاربردهای هوش مصنوعی در علوم پایه در قالب هفته پژوهش. این موضوع با توجه به اهمیت فعلی هوش مصنوعی می‌تواند جذاب باشد.',
    category: 'educational',
    upvotes: 47,
    status: 'under_review',
    ai_priority_score: 0.92,
    ai_summary: 'پیشنهاد با اولویت بالا - تقاضای زیاد برای محتوای هوش مصنوعی',
    created_at: '2026-05-20T10:00:00Z',
    user: mockUsers[0],
  },
  {
    id: 2,
    title: 'ایجاد فضای مطالعه باز در محوطه',
    description: 'با توجه به کمبود فضای مطالعه در فصل گرما، پیشنهاد می‌شود چند میز و صندلی در سایه‌های محوطه مرکزی نصب شود تا دانشجویان بتوانند در فضای باز مطالعه کنند.',
    category: 'facilities',
    upvotes: 82,
    status: 'approved',
    ai_priority_score: 0.88,
    ai_summary: 'پیشنهاد محبوب با پشتیبانی بالا از دانشجویان',
    created_at: '2026-05-15T11:00:00Z',
    user: mockUsers[2],
  },
  {
    id: 3,
    title: 'سمینار کارآفرینی و استارت‌آپ',
    description: 'پیشنهاد برگزاری سمینار ماهانه کارآفرینی با حضور کارآفرینان موفق ایرانی. این سمینارها می‌توانند انگیزه دانشجویان برای راه‌اندازی کسب‌وکار را افزایش دهند.',
    category: 'educational',
    upvotes: 63,
    status: 'pending',
    ai_priority_score: 0.79,
    ai_summary: 'پیشنهاد آموزشی با تمرکز بر کارآفرینی',
    created_at: '2026-05-22T14:00:00Z',
    user: mockUsers[3],
  },
  {
    id: 4,
    title: 'بهبود سیستم رزرو آنلاین',
    description: 'اضافه کردن قابلیت اطلاع‌رسانی پیامکی و ایمیلی به سامانه رزرو تا دانشجویان از تغییرات وضعیت درخواست‌هایشان مطلع شوند.',
    category: 'system',
    upvotes: 95,
    status: 'implemented',
    ai_priority_score: 0.95,
    ai_summary: 'پیشنهاد با بیشترین رأی - پیاده‌سازی شده',
    created_at: '2026-04-10T09:00:00Z',
    user: mockUsers[0],
  },
  {
    id: 5,
    title: 'نمایشگاه دائمی دستاوردهای دانشجویی',
    description: 'ایجاد یک فضای نمایشگاهی دائمی در راهروی اصلی برای نمایش پروژه‌های پایان‌نامه و دستاوردهای دانشجویی برجسته.',
    category: 'facilities',
    upvotes: 38,
    status: 'pending',
    ai_priority_score: 0.65,
    ai_summary: 'پیشنهاد مثبت برای ارتقای فضای دانشگاه',
    created_at: '2026-05-18T16:00:00Z',
    user: mockUsers[2],
  },
];

let _spaces = [...mockSpaces];
let _reservations = [...mockReservations];
let _complaints = [...mockComplaints];
let _suggestions = [...mockSuggestions];
let _ratings = [...mockRatings];
let _feedbacks = [...mockFeedbacks];
let _nextId = { reservations: 7, complaints: 4, suggestions: 6, feedbacks: 3, ratings: 3 };

export const db = {
  spaces: {
    getAll: (type?: string, status?: string) =>
      _spaces.filter(
        (s) => (!type || s.space_type === type) && (!status || s.status === status),
      ),
    getById: (id: number) => _spaces.find((s) => s.id === id),
    create: (data: Partial<Space>) => {
      const s = { ...data, id: _spaces.length + 1, avg_rating: 0, total_ratings: 0, created_at: new Date().toISOString() } as Space;
      _spaces.push(s);
      return s;
    },
    update: (id: number, data: Partial<Space>) => {
      const idx = _spaces.findIndex((s) => s.id === id);
      if (idx === -1) return null;
      _spaces[idx] = { ..._spaces[idx], ...data };
      return _spaces[idx];
    },
    delete: (id: number) => {
      _spaces = _spaces.filter((s) => s.id !== id);
    },
  },
  reservations: {
    getAll: (filters?: { status?: string; space_id?: number }) =>
      _reservations.filter(
        (r) =>
          (!filters?.status || r.status === filters.status) &&
          (!filters?.space_id || r.space_id === filters.space_id),
      ),
    getByUser: (userId: number, status?: string) =>
      _reservations.filter(
        (r) => r.user_id === userId && (!status || r.status === status),
      ),
    getById: (id: number) => _reservations.find((r) => r.id === id),
    create: (data: Partial<Reservation>) => {
      const r = {
        ...data,
        id: _nextId.reservations++,
        status: 'pending',
        created_at: new Date().toISOString(),
        space: _spaces.find((s) => s.id === data.space_id),
      } as Reservation;
      _reservations.push(r);
      return r;
    },
    review: (id: number, status: 'approved' | 'rejected', adminNote?: string) => {
      const idx = _reservations.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      _reservations[idx] = { ..._reservations[idx], status, admin_note: adminNote };
      return _reservations[idx];
    },
    cancel: (id: number) => {
      const idx = _reservations.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      _reservations[idx] = { ..._reservations[idx], status: 'cancelled' };
      return _reservations[idx];
    },
  },
  complaints: {
    getAll: (status?: string) =>
      _complaints.filter((c) => !status || c.status === status),
    getByUser: (userId: number) =>
      _complaints.filter((c) => (c as Complaint & { user_id?: number }).user_id === userId),
    create: (data: Partial<Complaint> & { user_id: number }) => {
      const c = {
        ...data,
        id: _nextId.complaints++,
        status: 'open',
        priority: 1,
        created_at: new Date().toISOString(),
        user: mockUsers.find((u) => u.id === data.user_id),
      } as Complaint & { user_id: number };
      _complaints.push(c as Complaint);
      return c;
    },
    respond: (id: number, response: string, status: string) => {
      const idx = _complaints.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      _complaints[idx] = {
        ..._complaints[idx],
        admin_response: response,
        status: status as Complaint['status'],
        responded_at: new Date().toISOString(),
      };
      return _complaints[idx];
    },
  },
  suggestions: {
    getAll: (status?: string) =>
      _suggestions
        .filter((s) => !status || s.status === status)
        .sort((a, b) => (b.ai_priority_score ?? 0) - (a.ai_priority_score ?? 0)),
    create: (data: Partial<Suggestion> & { user_id: number }) => {
      const s = {
        ...data,
        id: _nextId.suggestions++,
        upvotes: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        user: mockUsers.find((u) => u.id === data.user_id),
      } as Suggestion & { user_id: number };
      _suggestions.push(s as Suggestion);
      return s;
    },
    upvote: (id: number) => {
      const idx = _suggestions.findIndex((s) => s.id === id);
      if (idx === -1) return null;
      _suggestions[idx] = { ..._suggestions[idx], upvotes: _suggestions[idx].upvotes + 1 };
      return _suggestions[idx];
    },
  },
  ratings: {
    getBySpace: (spaceId: number) => _ratings.filter((r) => r.space_id === spaceId),
    create: (data: Partial<Rating> & { user_id: number }) => {
      const r = {
        ...data,
        id: _nextId.ratings++,
        created_at: new Date().toISOString(),
        user: mockUsers.find((u) => u.id === data.user_id),
      } as Rating & { user_id: number };
      _ratings.push(r as Rating);
      return r;
    },
  },
  feedbacks: {
    getBySpace: (spaceId: number) => _feedbacks.filter((f) => f.space_id === spaceId),
    getAll: () => _feedbacks,
    create: (data: Partial<Feedback> & { user_id: number }) => {
      const f = {
        ...data,
        id: _nextId.feedbacks++,
        is_analyzed: false,
        created_at: new Date().toISOString(),
        user: data.is_anonymous ? undefined : mockUsers.find((u) => u.id === data.user_id),
      } as Feedback & { user_id: number };
      _feedbacks.push(f as Feedback);
      return f;
    },
  },
};
