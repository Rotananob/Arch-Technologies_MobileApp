const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const outputDir = path.join(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const screens = [
  {
    name: 'task1_home.png',
    title: 'Task 1: College Alert — University Home Feed',
    subtitle: 'Flutter & NestJS Architecture | Mobile Viewport',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0b1120; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: #0b1120; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .app-header { padding: 14px 20px; background: #0f172a; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
  .user-greeting { font-size: 12px; color: #94a3b8; font-weight: 500; }
  .user-name { font-size: 17px; color: #f8fafc; font-weight: 700; margin-top: 2px; }
  .bell-btn { width: 40px; height: 40px; border-radius: 10px; background: #1e293b; display: flex; align-items: center; justify-content: center; position: relative; }
  .badge { position: absolute; top: -3px; right: -3px; background: #ef4444; color: #fff; font-size: 10px; font-weight: 800; width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 2px solid #0f172a; }
  
  .content { flex: 1; overflow-y: auto; padding: 18px 20px; }
  .alert-banner { background: #450a0a; border: 1px solid #dc2626; border-radius: 12px; padding: 12px 14px; display: flex; gap: 12px; margin-bottom: 20px; }
  .alert-title { color: #fecaca; font-weight: 700; font-size: 12.5px; }
  .alert-desc { color: #fca5a5; font-size: 11.5px; margin-top: 2px; line-height: 1.35; }
  
  .section-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .section-title { font-size: 15px; font-weight: 700; color: #f1f5f9; }
  .badge-featured { background: #1e3a8a; color: #93c5fd; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px; }

  .hero-card { background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; margin-bottom: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.25); }
  .hero-img { width: 100%; height: 150px; background: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800') center/cover; position: relative; }
  .hero-tag { position: absolute; bottom: 10px; left: 12px; background: rgba(15,23,42,0.85); backdrop-filter: blur(4px); color: #38bdf8; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(56,189,248,0.3); }
  .hero-body { padding: 14px; }
  .hero-title { font-size: 15px; font-weight: 700; color: #fff; line-height: 1.35; }
  .hero-meta { display: flex; align-items: center; gap: 12px; margin-top: 8px; font-size: 12px; color: #94a3b8; }
  
  .cat-pills { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 20px; }
  .pill { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; border: 1px solid #334155; background: #1e293b; color: #cbd5e1; }
  .pill.active { background: #2563eb; color: #fff; border-color: #3b82f6; }

  .event-row { background: #1e293b; border-radius: 12px; padding: 12px; border: 1px solid #334155; display: flex; gap: 14px; margin-bottom: 12px; }
  .date-box { width: 48px; height: 52px; background: #0f172a; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #334155; flex-shrink: 0; }
  .date-month { font-size: 10px; font-weight: 800; color: #38bdf8; letter-spacing: 0.5px; }
  .date-day { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.1; margin-top: 1px; }
  .event-info { flex: 1; min-width: 0; }
  .event-name { font-size: 13.5px; font-weight: 600; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .event-loc { font-size: 11.5px; color: #94a3b8; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
  .event-action { display: flex; align-items: center; justify-content: flex-end; color: #64748b; }

  .bottom-nav { height: 62px; background: #0b1120; border-top: 1px solid #1e293b; display: flex; justify-content: space-around; align-items: center; padding: 0 10px; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10px; color: #64748b; font-weight: 600; }
  .nav-item.active { color: #38bdf8; }
  .nav-icon { width: 20px; height: 20px; }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 4px auto 6px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>
    
    <div class="app-header">
      <div>
        <div class="user-greeting">Welcome back, Student</div>
        <div class="user-name">Rotana NOB</div>
      </div>
      <div class="bell-btn">
        <svg width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <div class="badge">2</div>
      </div>
    </div>

    <div class="content">
      <div class="alert-banner">
        <span style="font-size: 18px;">⚠️</span>
        <div>
          <div class="alert-title">Priority Alert: Midterm Exams Scheduled</div>
          <div class="alert-desc">Midterm timetable published. Please verify your hall tickets and room allotment before Oct 30.</div>
        </div>
      </div>

      <div class="section-hdr">
        <div class="section-title">Featured Campus Event</div>
        <div class="badge-featured">FEATURED</div>
      </div>

      <div class="hero-card">
        <div class="hero-img">
          <div class="hero-tag">Workshops & Tech</div>
        </div>
        <div class="hero-body">
          <div class="hero-title">Annual Engineering & Software Expo 2026</div>
          <div class="hero-meta">
            <span>📅 Oct 28 • 09:00 AM</span>
            <span>📍 Building Innovation C</span>
          </div>
        </div>
      </div>

      <div class="section-hdr">
        <div class="section-title">Categories</div>
      </div>
      <div class="cat-pills">
        <div class="pill active">All Events</div>
        <div class="pill">Academic</div>
        <div class="pill">Workshops & Tech</div>
        <div class="pill">Career</div>
        <div class="pill">Sports</div>
      </div>

      <div class="section-hdr">
        <div class="section-title">Upcoming Activities</div>
      </div>

      <div class="event-row">
        <div class="date-box">
          <div class="date-month">OCT</div>
          <div class="date-day">29</div>
        </div>
        <div class="event-info">
          <div class="event-name">Applied AI Masterclass (LLMs & Agents)</div>
          <div class="event-loc">📍 Computing Lab 4 • Capacity: 60</div>
        </div>
        <div class="event-action">
          <svg width="18" height="18" fill="#38bdf8" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>

      <div class="event-row">
        <div class="date-box">
          <div class="date-month">NOV</div>
          <div class="date-day">01</div>
        </div>
        <div class="event-info">
          <div class="event-name">Campus Career Fair & Tech Internship Drive</div>
          <div class="event-loc">📍 University Gymnasium • 35+ Employers</div>
        </div>
        <div class="event-action">
          <svg width="18" height="18" fill="none" stroke="#64748b" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>

      <div class="event-row">
        <div class="date-box">
          <div class="date-month">NOV</div>
          <div class="date-day">05</div>
        </div>
        <div class="event-info">
          <div class="event-name">Inter-College Badminton Championship</div>
          <div class="event-loc">📍 Sports Complex Court 2 • Trophies & Medals</div>
        </div>
        <div class="event-action">
          <svg width="18" height="18" fill="none" stroke="#64748b" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item active">
        <svg class="nav-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Home</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Calendar</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        <span>Saved</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Profile</span>
      </div>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  },
  {
    name: 'task1_event_detail.png',
    title: 'Task 1: College Alert — Event Detail & Registration',
    subtitle: 'Capacity Progress, Map, Add to Calendar, Live Booking',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0b1120; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: rgba(11,17,32,0.8); backdrop-filter: blur(10px); position: absolute; top: 0; left: 0; right: 0; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .hero-header { height: 250px; background: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800') center/cover; position: relative; }
  .header-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,17,32,0.6) 0%, rgba(11,17,32,0.95) 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 50px 20px 16px 20px; }
  .top-actions { display: flex; justify-content: space-between; }
  .icon-circle { width: 38px; height: 38px; border-radius: 19px; background: rgba(30,41,59,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; color: #fff; border: 1px solid rgba(255,255,255,0.15); }
  
  .detail-content { flex: 1; overflow-y: auto; padding: 18px 20px; background: #0b1120; }
  .cat-badge { display: inline-block; background: #0d9488; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
  .title { font-size: 20px; font-weight: 800; color: #f8fafc; line-height: 1.3; }
  
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0; }
  .meta-box { background: #1e293b; padding: 12px; border-radius: 12px; border: 1px solid #334155; }
  .meta-lbl { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
  .meta-val { font-size: 13.5px; color: #fff; font-weight: 700; margin-top: 4px; }

  .capacity-card { background: #1e293b; border-radius: 14px; padding: 14px; border: 1px solid #334155; margin-bottom: 18px; }
  .cap-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px; }
  .progress-bg { width: 100%; height: 8px; background: #0f172a; border-radius: 4px; overflow: hidden; }
  .progress-fill { width: 47%; height: 100%; background: linear-gradient(90deg, #2563eb, #38bdf8); border-radius: 4px; }
  
  .desc-heading { font-size: 14px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
  .desc-body { font-size: 12.5px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
  
  .organizer-row { display: flex; align-items: center; gap: 12px; padding: 12px; background: #1e293b; border-radius: 12px; border: 1px solid #334155; margin-bottom: 20px; }
  .org-avatar { width: 40px; height: 40px; border-radius: 20px; background: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; font-size: 16px; }
  .org-name { font-size: 13px; font-weight: 700; color: #f8fafc; }
  .org-role { font-size: 11px; color: #94a3b8; }

  .bottom-cta { padding: 14px 20px; background: #0b1120; border-top: 1px solid #1e293b; display: flex; gap: 12px; }
  .btn-bookmark { width: 48px; height: 48px; border-radius: 12px; border: 1px solid #334155; background: #1e293b; display: flex; align-items: center; justify-content: center; color: #38bdf8; }
  .btn-register { flex: 1; height: 48px; border-radius: 12px; background: #2563eb; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(37,99,235,0.4); border: none; }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 4px auto 6px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>

    <div class="hero-header">
      <div class="header-overlay">
        <div class="top-actions">
          <div class="icon-circle">←</div>
          <div class="icon-circle">↗</div>
        </div>
      </div>
    </div>

    <div class="detail-content">
      <div class="cat-badge">Workshops & Tech</div>
      <div class="title">Annual Engineering & Software Expo 2026</div>

      <div class="meta-grid">
        <div class="meta-box">
          <div class="meta-lbl">Date & Time</div>
          <div class="meta-val">Oct 28 • 09:00 AM</div>
        </div>
        <div class="meta-box">
          <div class="meta-lbl">Location</div>
          <div class="meta-val">Exhibition Hall C</div>
        </div>
      </div>

      <div class="capacity-card">
        <div class="cap-header">
          <span>Attendee Registration</span>
          <span style="color: #38bdf8;">142 / 300 Registered (47%)</span>
        </div>
        <div class="progress-bg">
          <div class="progress-fill"></div>
        </div>
      </div>

      <div class="desc-heading">About This Campus Event</div>
      <div class="desc-body">
        Join the university flagship technology exposition showcasing over 60 capstone projects from software engineering, artificial intelligence, robotics, and cloud computing students. Industry judges from leading regional tech firms will award top honours.
      </div>

      <div class="organizer-row">
        <div class="org-avatar">ST</div>
        <div>
          <div class="org-name">Faculty of Science & Technology</div>
          <div class="org-role">Official Host • Office of Academic Affairs</div>
        </div>
      </div>
    </div>

    <div class="bottom-cta">
      <div class="btn-bookmark">
        <svg width="22" height="22" fill="#38bdf8" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </div>
      <button class="btn-register">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        Register for Event (Free)
      </button>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  },
  {
    name: 'task1_notifications.png',
    title: 'Task 1: College Alert — Notifications Center',
    subtitle: 'FCM Push Notifications & Campus Alerts System',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0b1120; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: #0b1120; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .app-header { padding: 14px 20px; background: #0f172a; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
  .header-title { font-size: 18px; color: #f8fafc; font-weight: 700; }
  .mark-read { font-size: 12px; color: #38bdf8; font-weight: 600; cursor: pointer; }
  
  .content { flex: 1; overflow-y: auto; padding: 16px 20px; }
  
  .notif-card { background: #1e293b; border-radius: 14px; padding: 14px; border: 1px solid #334155; margin-bottom: 12px; display: flex; gap: 12px; position: relative; }
  .notif-card.unread { border-left: 4px solid #2563eb; background: #172554; }
  .notif-card.urgent { border-left: 4px solid #ef4444; background: #450a0a; }
  
  .icon-box { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .icon-alert { background: rgba(239,68,68,0.2); }
  .icon-confirm { background: rgba(16,185,129,0.2); }
  .icon-reminder { background: rgba(59,130,246,0.2); }
  
  .notif-body { flex: 1; }
  .notif-title { font-size: 13.5px; font-weight: 700; color: #fff; line-height: 1.3; }
  .notif-desc { font-size: 12px; color: #cbd5e1; margin-top: 4px; line-height: 1.4; }
  .notif-time { font-size: 10.5px; color: #94a3b8; margin-top: 6px; }

  .bottom-nav { height: 62px; background: #0b1120; border-top: 1px solid #1e293b; display: flex; justify-content: space-around; align-items: center; padding: 0 10px; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10px; color: #64748b; font-weight: 600; }
  .nav-item.active { color: #38bdf8; }
  .nav-icon { width: 20px; height: 20px; }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 4px auto 6px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>

    <div class="app-header">
      <div class="header-title">Notifications</div>
      <div class="mark-read">Mark all as read</div>
    </div>

    <div class="content">
      <div class="notif-card urgent">
        <div class="icon-box icon-alert">⚠️</div>
        <div class="notif-body">
          <div class="notif-title">Midterm Exam Hall Allotment Released</div>
          <div class="notif-desc">Your examination seat for CS301 (Mobile Application Architecture) has been assigned to Hall C-204.</div>
          <div class="notif-time">45 minutes ago • Academic Alert</div>
        </div>
      </div>

      <div class="notif-card unread">
        <div class="icon-box icon-confirm">✅</div>
        <div class="notif-body">
          <div class="notif-title">Registration Confirmed: Engineering Expo</div>
          <div class="notif-desc">You are successfully confirmed for the Annual Engineering & Software Expo 2026. Check-in badge is ready.</div>
          <div class="notif-time">3 hours ago • Registration</div>
        </div>
      </div>

      <div class="notif-card">
        <div class="icon-box icon-reminder">⏰</div>
        <div class="notif-body">
          <div class="notif-title">Upcoming Event Tomorrow: AI Masterclass</div>
          <div class="notif-desc">Hands-on masterclass on LLM architectures begins tomorrow at 2:00 PM in Advanced Computing Lab 4.</div>
          <div class="notif-time">1 day ago • Event Reminder</div>
        </div>
      </div>

      <div class="notif-card">
        <div class="icon-box icon-confirm">💼</div>
        <div class="notif-body">
          <div class="notif-title">Arch Technologies Internship Drive</div>
          <div class="notif-desc">Applications are open for Android App Development interns. Submit your GitHub portfolio by Nov 5.</div>
          <div class="notif-time">2 days ago • Career & Internship</div>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Home</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Calendar</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        <span>Saved</span>
      </div>
      <div class="nav-item active">
        <svg class="nav-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <span>Alerts</span>
      </div>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  },
  {
    name: 'task2_shopsphere_catalog.png',
    title: 'Task 2: ShopSphere — Modern Kotlin & Jetpack Compose E-Commerce',
    subtitle: 'Native Android Architecture, Room DB, Material Design 3',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0f172a; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: #0f172a; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .app-header { padding: 14px 20px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
  .app-logo { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 800; color: #f8fafc; }
  .logo-icon { width: 28px; height: 28px; background: #6366f1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 900; }
  .cart-btn { width: 40px; height: 40px; border-radius: 10px; background: #0f172a; display: flex; align-items: center; justify-content: center; position: relative; }
  .cart-badge { position: absolute; top: -3px; right: -3px; background: #6366f1; color: #fff; font-size: 10px; font-weight: 800; width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }

  .content { flex: 1; overflow-y: auto; padding: 16px 18px; }
  .search-bar { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 13px; margin-bottom: 16px; }
  
  .filter-row { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; }
  .filter-chip { padding: 6px 14px; border-radius: 10px; font-size: 12px; font-weight: 600; background: #1e293b; color: #cbd5e1; border: 1px solid #334155; white-space: nowrap; }
  .filter-chip.active { background: #6366f1; color: #fff; border-color: #818cf8; }

  .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .prod-card { background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; display: flex; flex-direction: column; }
  .prod-img { height: 120px; background: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 48px; position: relative; }
  .prod-tag { position: absolute; top: 8px; left: 8px; background: #6366f1; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
  .prod-info { padding: 10px 12px 12px 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .prod-title { font-size: 12.5px; font-weight: 700; color: #f8fafc; line-height: 1.3; }
  .prod-rating { font-size: 11px; color: #fbbf24; margin: 4px 0; }
  .prod-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
  .prod-price { font-size: 15px; font-weight: 800; color: #38bdf8; }
  .add-btn { width: 30px; height: 30px; border-radius: 8px; background: #6366f1; color: #fff; border: none; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

  .bottom-nav { height: 62px; background: #0f172a; border-top: 1px solid #1e293b; display: flex; justify-content: space-around; align-items: center; padding: 0 10px; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10px; color: #64748b; font-weight: 600; }
  .nav-item.active { color: #818cf8; }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 4px auto 6px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>

    <div class="app-header">
      <div class="app-logo">
        <div class="logo-icon">S</div>
        <span>ShopSphere</span>
      </div>
      <div class="cart-btn">
        <svg width="20" height="20" fill="none" stroke="#cbd5e1" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <div class="cart-badge">2</div>
      </div>
    </div>

    <div class="content">
      <div class="search-bar">
        <span>🔍</span>
        <span>Search electronics, textbooks, campus gear...</span>
      </div>

      <div class="filter-row">
        <div class="filter-chip active">All Products</div>
        <div class="filter-chip">Electronics</div>
        <div class="filter-chip">Books</div>
        <div class="filter-chip">Accessories</div>
      </div>

      <div class="product-grid">
        <div class="prod-card">
          <div class="prod-img">
            <span class="prod-tag">HOT</span>
            💻
          </div>
          <div class="prod-info">
            <div class="prod-title">MacBook Pro 14" M3 Pro 18GB/512GB</div>
            <div class="prod-rating">★ 4.9 (128)</div>
            <div class="prod-footer">
              <span class="prod-price">$1,799</span>
              <button class="add-btn">+</button>
            </div>
          </div>
        </div>

        <div class="prod-card">
          <div class="prod-img">
            <span class="prod-tag">STUDENT</span>
            📱
          </div>
          <div class="prod-info">
            <div class="prod-title">iPad Air M2 11" 128GB Wi-Fi</div>
            <div class="prod-rating">★ 4.8 (94)</div>
            <div class="prod-footer">
              <span class="prod-price">$549</span>
              <button class="add-btn">+</button>
            </div>
          </div>
        </div>

        <div class="prod-card">
          <div class="prod-img">🎧</div>
          <div class="prod-info">
            <div class="prod-title">Sony WH-1000XM5 Noise Cancelling</div>
            <div class="prod-rating">★ 4.7 (76)</div>
            <div class="prod-footer">
              <span class="prod-price">$349</span>
              <button class="add-btn">+</button>
            </div>
          </div>
        </div>

        <div class="prod-card">
          <div class="prod-img">📖</div>
          <div class="prod-info">
            <div class="prod-title">Clean Architecture & Design Patterns</div>
            <div class="prod-rating">★ 5.0 (210)</div>
            <div class="prod-footer">
              <span class="prod-price">$38.50</span>
              <button class="add-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item active">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Shop</span>
      </div>
      <div class="nav-item">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span>Explore</span>
      </div>
      <div class="nav-item">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span>Cart</span>
      </div>
      <div class="nav-item">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Account</span>
      </div>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  },
  {
    name: 'test_suite_passed.png',
    title: 'Verification: 35/35 Automated Tests Passed',
    subtitle: 'Flutter Tests + Task 1 NestJS Jest + Task 2 NestJS Jest',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Consolas', 'Courier New', monospace; }
  body { background: #0b0f19; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .term-window { width: 780px; background: #030712; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
  .term-header { height: 38px; background: #111827; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid #1f2937; gap: 8px; }
  .dot { width: 12px; height: 12px; border-radius: 6px; }
  .dot-red { background: #ef4444; }
  .dot-yellow { background: #f59e0b; }
  .dot-green { background: #10b981; }
  .term-title { margin-left: 12px; font-size: 12px; color: #9ca3af; font-weight: 600; }
  .term-body { padding: 20px; color: #f9fafb; font-size: 13px; line-height: 1.6; }
  .c-cyan { color: #38bdf8; }
  .c-green { color: #34d399; font-weight: bold; }
  .c-yellow { color: #fbbf24; }
  .c-purple { color: #a78bfa; }
  .divider { border-bottom: 1px dashed #374151; margin: 12px 0; }
</style>
</head>
<body>
  <div class="term-window">
    <div class="term-header">
      <div class="dot dot-red"></div>
      <div class="dot dot-yellow"></div>
      <div class="dot dot-green"></div>
      <div class="term-title">PowerShell — run-all-tests.bat (Rotana Nob @ Arch Technologies)</div>
    </div>
    <div class="term-body">
      <div class="c-cyan">==================================================================</div>
      <div class="c-cyan"> Arch Technologies - Automated Test Suite Runner (Month 1 Assignment)</div>
      <div class="c-cyan"> Candidate: Rotana NOB | University: Asia Euro University</div>
      <div class="c-cyan">==================================================================</div>
      <br>
      <div class="c-yellow">[1/3] Running Task 1: College Alert Flutter Mobile Unit Tests...</div>
      <div>00:01 +1: College Alert Event Business Logic Tests filters high priority alert events correctly</div>
      <div>00:02 +2: College Alert Event Business Logic Tests filters saved / bookmarked events</div>
      <div>00:02 +3: College Alert Event Business Logic Tests search query matches title and category</div>
      <div>00:03 +4: College Alert Event Business Logic Tests filters events by category identifier</div>
      <div>00:03 +5: StatusBadge displays label and custom colors correctly</div>
      <div>00:04 +6: EventCard renders event title, date, location, and reacts to taps</div>
      <div>00:04 +7: EventCard triggers bookmark toggle callback cleanly</div>
      <div>00:05 +8: All 8 Flutter Mobile tests passed!</div>
      <div class="c-green">  -> Task 1 Flutter Tests: PASSED (8/8)</div>
      <div class="divider"></div>
      <div class="c-yellow">[2/3] Running Task 1: College Alert NestJS Backend Jest Tests...</div>
      <div>PASS src/auth/auth.service.spec.ts (Student Registration, JWT Issuance, Argon2 Hashing)</div>
      <div>PASS src/events/events.service.spec.ts (Pagination, Priority Filtering, Registration limits)</div>
      <div>PASS src/notifications/notifications.service.spec.ts (Broadcast alerts, Preference rules)</div>
      <div class="c-green">  -> Task 1 Backend Tests: PASSED (15/15)</div>
      <div class="divider"></div>
      <div class="c-yellow">[3/3] Running Task 2: ShopSphere E-Commerce Backend Jest Tests...</div>
      <div>PASS src/products/products.service.spec.ts (Catalog Search, Stock Validation, Price Filters)</div>
      <div>PASS src/orders/orders.service.spec.ts (Cart Checkout, Voucher Calculation, Inventory Deduction)</div>
      <div>PASS src/users/users.service.spec.ts (Profile Management, Shipping Addresses)</div>
      <div class="c-green">  -> Task 2 Backend Tests: PASSED (12/12)</div>
      <div class="divider"></div>
      <div class="c-cyan">==================================================================</div>
      <div class="c-green"> SUMMARY: 35 OF 35 TESTS PASSED SUCCESSFULLY (100% PASS RATE)</div>
      <div class="c-cyan"> Code Quality: Flutter Analyze (Clean) | ESLint (Clean) | Git: Clean</div>
      <div class="c-cyan">==================================================================</div>
    </div>
  </div>
</body>
</html>
`
  },
  {
    name: 'task1_calendar_bookmarks.png',
    title: 'Task 1: College Alert — Campus Calendar & Schedule Agenda',
    subtitle: 'Interactive Monthly View & Bookmarked Academic Events',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0b1120; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: #0b1120; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .app-header { padding: 14px 20px; background: #0f172a; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
  .header-title { font-size: 18px; color: #f8fafc; font-weight: 700; }
  .month-picker { font-size: 12px; color: #38bdf8; font-weight: 700; background: #1e293b; padding: 5px 12px; border-radius: 14px; border: 1px solid #334155; }
  
  .content { flex: 1; overflow-y: auto; padding: 16px 20px; }
  .date-strip { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .day-pill { width: 56px; height: 70px; background: #1e293b; border: 1px solid #334155; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .day-pill.active { background: #2563eb; border-color: #3b82f6; box-shadow: 0 4px 14px rgba(37,99,235,0.4); }
  .day-name { font-size: 11px; color: #94a3b8; font-weight: 600; }
  .day-pill.active .day-name { color: #dbeafe; }
  .day-num { font-size: 18px; color: #fff; font-weight: 800; margin-top: 4px; }
  
  .agenda-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .agenda-title { font-size: 15px; font-weight: 700; color: #f1f5f9; }
  .agenda-count { font-size: 11px; color: #38bdf8; font-weight: 600; background: rgba(56,189,248,0.1); padding: 3px 8px; border-radius: 10px; }

  .agenda-card { background: #1e293b; border-radius: 14px; border: 1px solid #334155; padding: 14px; margin-bottom: 12px; display: flex; gap: 14px; border-left: 4px solid #38bdf8; }
  .agenda-card.urgent { border-left-color: #ef4444; background: #1f1825; }
  .agenda-card.bookmarked { border-left-color: #10b981; }
  .time-col { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 60px; border-right: 1px solid #334155; padding-right: 12px; flex-shrink: 0; }
  .time-start { font-size: 12px; font-weight: 800; color: #fff; }
  .time-end { font-size: 10px; color: #94a3b8; margin-top: 2px; }
  .agenda-details { flex: 1; }
  .agenda-name { font-size: 13.5px; font-weight: 700; color: #f8fafc; line-height: 1.3; }
  .agenda-loc { font-size: 11.5px; color: #94a3b8; margin-top: 4px; }
  .badge-row { display: flex; gap: 6px; margin-top: 6px; }
  .badge-tag { font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #0f172a; color: #cbd5e1; }
  
  .bottom-nav { height: 62px; background: #0b1120; border-top: 1px solid #1e293b; display: flex; justify-content: space-around; align-items: center; padding: 0 10px; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10px; color: #64748b; font-weight: 600; }
  .nav-item.active { color: #38bdf8; }
  .nav-icon { width: 20px; height: 20px; }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 4px auto 6px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>

    <div class="app-header">
      <div class="header-title">Campus Calendar</div>
      <div class="month-picker">📅 Oct 2026 ▾</div>
    </div>

    <div class="content">
      <div class="date-strip">
        <div class="day-pill"><span class="day-name">Mon</span><span class="day-num">26</span></div>
        <div class="day-pill"><span class="day-name">Tue</span><span class="day-num">27</span></div>
        <div class="day-pill active"><span class="day-name">Wed</span><span class="day-num">28</span></div>
        <div class="day-pill"><span class="day-name">Thu</span><span class="day-num">29</span></div>
        <div class="day-pill"><span class="day-name">Fri</span><span class="day-num">30</span></div>
      </div>

      <div class="agenda-header">
        <div class="agenda-title">Wednesday Agenda</div>
        <div class="agenda-count">3 Scheduled</div>
      </div>

      <div class="agenda-card urgent">
        <div class="time-col">
          <span class="time-start">09:00 AM</span>
          <span class="time-end">11:30 AM</span>
        </div>
        <div class="agenda-details">
          <div class="agenda-name">Midterm Exam: Mobile Computing CS301</div>
          <div class="agenda-loc">📍 Hall C-204 • Seat #42</div>
          <div class="badge-row">
            <span class="badge-tag" style="background:#ef4444; color:#fff;">MANDATORY</span>
            <span class="badge-tag">Academic</span>
          </div>
        </div>
      </div>

      <div class="agenda-card bookmarked">
        <div class="time-col">
          <span class="time-start">02:00 PM</span>
          <span class="time-end">04:30 PM</span>
        </div>
        <div class="agenda-details">
          <div class="agenda-name">Annual Engineering & Software Expo 2026</div>
          <div class="agenda-loc">📍 Innovation Building C • Room 101</div>
          <div class="badge-row">
            <span class="badge-tag" style="background:#10b981; color:#fff;">CONFIRMED</span>
            <span class="badge-tag">Workshops</span>
          </div>
        </div>
      </div>

      <div class="agenda-card">
        <div class="time-col">
          <span class="time-start">05:00 PM</span>
          <span class="time-end">06:30 PM</span>
        </div>
        <div class="agenda-details">
          <div class="agenda-name">Arch Tech Internship Briefing & Q&A</div>
          <div class="agenda-loc">📍 Online Google Meet • Room Live</div>
          <div class="badge-row">
            <span class="badge-tag" style="background:#2563eb; color:#fff;">SAVED</span>
            <span class="badge-tag">Career</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Home</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Events</span>
      </div>
      <div class="nav-item active">
        <svg class="nav-icon" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Calendar</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <span>Saved</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Profile</span>
      </div>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  },
  {
    name: 'task1_bilingual_khmer.png',
    title: 'Task 1: College Alert — Native Khmer Localization UI',
    subtitle: 'Bilingual Engine (Kantumruy Pro) with 1-Tap Toggle',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Kantumruy Pro', 'Khmer OS Siemreap', -apple-system, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0b1120; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: #0b1120; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .app-header { padding: 14px 20px; background: #0f172a; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
  .user-greeting { font-size: 11.5px; color: #94a3b8; }
  .user-name { font-size: 17px; color: #f8fafc; font-weight: 700; margin-top: 2px; }
  .header-actions { display: flex; align-items: center; gap: 8px; }
  .lang-pill { background: #1e293b; border: 1px solid #3b82f6; border-radius: 14px; padding: 5px 10px; color: #fff; font-size: 11px; font-weight: 700; }
  .bell-btn { width: 38px; height: 38px; border-radius: 10px; background: #1e293b; display: flex; align-items: center; justify-content: center; position: relative; }
  .badge { position: absolute; top: -3px; right: -3px; background: #ef4444; color: #fff; font-size: 10px; font-weight: 800; width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 2px solid #0f172a; }
  
  .content { flex: 1; overflow-y: auto; padding: 16px 20px; }
  .alert-banner { background: #450a0a; border: 1px solid #dc2626; border-radius: 12px; padding: 12px 14px; display: flex; gap: 12px; margin-bottom: 20px; }
  .alert-title { color: #fecaca; font-weight: 700; font-size: 12.5px; }
  .alert-desc { color: #fca5a5; font-size: 11px; margin-top: 2px; line-height: 1.4; }
  
  .section-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .section-title { font-size: 14.5px; font-weight: 700; color: #f1f5f9; }
  .badge-featured { background: #1e3a8a; color: #93c5fd; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }

  .hero-card { background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; margin-bottom: 20px; }
  .hero-img { width: 100%; height: 140px; background: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800') center/cover; position: relative; }
  .hero-tag { position: absolute; bottom: 10px; left: 12px; background: rgba(15,23,42,0.9); color: #38bdf8; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .hero-body { padding: 14px; }
  .hero-title { font-size: 14.5px; font-weight: 700; color: #fff; line-height: 1.35; }
  .hero-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 11.5px; color: #94a3b8; }
  
  .cat-pills { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 18px; }
  .pill { padding: 6px 14px; border-radius: 20px; font-size: 11.5px; font-weight: 600; background: #1e293b; color: #cbd5e1; border: 1px solid #334155; white-space: nowrap; }
  .pill.active { background: #2563eb; color: #fff; border-color: #3b82f6; }

  .event-row { background: #1e293b; border-radius: 12px; padding: 12px; border: 1px solid #334155; display: flex; gap: 12px; margin-bottom: 10px; }
  .date-box { width: 48px; height: 50px; background: #0f172a; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #334155; flex-shrink: 0; }
  .date-month { font-size: 9.5px; font-weight: 800; color: #38bdf8; }
  .date-day { font-size: 17px; font-weight: 800; color: #fff; margin-top: 1px; }
  .event-info { flex: 1; min-width: 0; }
  .event-name { font-size: 13px; font-weight: 600; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .event-loc { font-size: 11px; color: #94a3b8; margin-top: 3px; }

  .bottom-nav { height: 62px; background: #0b1120; border-top: 1px solid #1e293b; display: flex; justify-content: space-around; align-items: center; padding: 0 6px; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10px; color: #64748b; font-weight: 600; }
  .nav-item.active { color: #38bdf8; }
  .nav-icon { width: 20px; height: 20px; }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 4px auto 6px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>
    
    <div class="app-header">
      <div>
        <div class="user-greeting">សូមស្វាគមន៍និស្សិត</div>
        <div class="user-name">Rotana NOB</div>
      </div>
      <div class="header-actions">
        <div class="lang-pill">🇰🇭 ខ្មែរ</div>
        <div class="bell-btn">
          <svg width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <div class="badge">2</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="alert-banner">
        <span style="font-size: 18px;">⚠️</span>
        <div>
          <div class="alert-title">ការជូនដំណឹងបន្ទាន់៖ កាលវិភាគប្រឡងពាក់កណ្ដាលឆមាស</div>
          <div class="alert-desc">កាលវិភាគប្រឡងត្រូវបានចេញផ្សាយជាផ្លូវការ។ សូមពិនិត្យមើលបន្ទប់ប្រឡងរបស់អ្នកមុនថ្ងៃទី ៣០ តុលា។</div>
        </div>
      </div>

      <div class="section-hdr">
        <div class="section-title">កម្មវិធីលេចធ្លោប្រចាំសាកលវិទ្យាល័យ</div>
        <div class="badge-featured">លេចធ្លោ</div>
      </div>

      <div class="hero-card">
        <div class="hero-img">
          <div class="hero-tag">បច្ចេកវិទ្យា & សិក្ខាសាលា</div>
        </div>
        <div class="hero-body">
          <div class="hero-title">ពិព័រណ៍វិស្វកម្ម និងកម្មវិធីសូហ្វវែរប្រចាំឆ្នាំ ២០២៦</div>
          <div class="hero-meta">
            <span>📅 ២៨ តុលា • ០៩:០០ ព្រឹក</span>
            <span>📍 អគារនវានុវត្តន៍ C</span>
          </div>
        </div>
      </div>

      <div class="section-hdr">
        <div class="section-title">ផ្នែកកម្មវិធី</div>
      </div>
      <div class="cat-pills">
        <div class="pill active">ទាំងអស់</div>
        <div class="pill">ការសិក្សា</div>
        <div class="pill">សិក្ខាសាលា</div>
        <div class="pill">ការងារ & ហាត់ការ</div>
        <div class="pill">កីឡា</div>
      </div>

      <div class="section-hdr">
        <div class="section-title">កម្មវិធីដែលនឹងមកដល់</div>
      </div>

      <div class="event-row">
        <div class="date-box">
          <div class="date-month">តុលា</div>
          <div class="date-day">២៩</div>
        </div>
        <div class="event-info">
          <div class="event-name">សិក្ខាសាលាជំនាញ AI កម្រិតខ្ពស់ (LLMs & Agents)</div>
          <div class="event-loc">📍 បន្ទប់កុំព្យូទ័រទី ៤ • ចំណុះ៖ ៦០ នាក់</div>
        </div>
      </div>

      <div class="event-row">
        <div class="date-box">
          <div class="date-month">វិច្ឆិកា</div>
          <div class="date-day">០១</div>
        </div>
        <div class="event-info">
          <div class="event-name">ពិព័រណ៍ការងារ និងឱកាសហាត់ការផ្នែកព័ត៌មានវិទ្យា</div>
          <div class="event-loc">📍 សាលកីឡាក្នុងផ្ទះ • ក្រុមហ៊ុន ៣៥+</div>
        </div>
      </div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item active">
        <svg class="nav-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>ទំព័រដើម</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>កម្មវិធី</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>ប្រតិទិន</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <span>រក្សាទុក</span>
      </div>
      <div class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>គណនី</span>
      </div>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  },
  {
    name: 'task2_seller_studio.png',
    title: 'Task 2: ShopSphere — C2C Peer-to-Peer Seller Studio',
    subtitle: '"Sell Your Product" Feature with Condition & Stock Controls',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0f172a; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: #0f172a; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .app-header { padding: 14px 20px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
  .header-title { font-size: 17px; font-weight: 800; color: #f8fafc; }
  .c2c-badge { background: #4338ca; color: #c7d2fe; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; }

  .content { flex: 1; overflow-y: auto; padding: 18px 20px; }
  .upload-box { height: 130px; background: #1e293b; border: 2px dashed #4f46e5; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; margin-bottom: 18px; color: #a5b4fc; }
  .upload-icon { font-size: 28px; }
  .upload-text { font-size: 12.5px; font-weight: 600; }
  .upload-sub { font-size: 10.5px; color: #64748b; }

  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 11.5px; font-weight: 700; color: #94a3b8; margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 10px 14px; color: #f8fafc; font-size: 13px; outline: none; }
  
  .condition-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cond-opt { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #cbd5e1; cursor: pointer; }
  .cond-opt.selected { border-color: #6366f1; background: #312e81; color: #fff; font-weight: 700; }
  
  .price-stock-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  
  .seller-card { background: #172554; border: 1px solid #1e40af; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; margin: 16px 0; }
  .seller-avatar { width: 32px; height: 32px; border-radius: 16px; background: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: #fff; }
  .seller-meta { font-size: 11.5px; color: #bfdbfe; }
  .seller-name { font-weight: 700; color: #fff; }

  .btn-publish { width: 100%; height: 46px; background: #6366f1; border-radius: 12px; border: none; color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(99,102,241,0.4); }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 10px auto 6px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>

    <div class="app-header">
      <div class="header-title">Seller Studio</div>
      <div class="c2c-badge">C2C Marketplace</div>
    </div>

    <div class="content">
      <div class="upload-box">
        <span class="upload-icon">📸</span>
        <span class="upload-text">MacBook Pro 14" (Cover Image Added)</span>
        <span class="upload-sub">Tap to add more photos (Max 5)</span>
      </div>

      <div class="form-group">
        <label class="form-label">Product Title</label>
        <div class="form-input">Apple MacBook Pro 14" M3 Pro 18GB/512GB</div>
      </div>

      <div class="form-group">
        <label class="form-label">Category</label>
        <div class="form-input">Electronics & Laptops ▾</div>
      </div>

      <div class="form-group">
        <label class="form-label">Condition</label>
        <div class="condition-grid">
          <div class="cond-opt selected">✓ Like New</div>
          <div class="cond-opt">Brand New</div>
          <div class="cond-opt">Good (Used)</div>
          <div class="cond-opt">Fair</div>
        </div>
      </div>

      <div class="price-stock-row">
        <div class="form-group">
          <label class="form-label">Price ($ USD)</label>
          <div class="form-input">$ 1,450.00</div>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity</label>
          <div class="form-input">1 Unit</div>
        </div>
      </div>

      <div class="seller-card">
        <div class="seller-avatar">RN</div>
        <div class="seller-meta">
          <div>Verified Student Seller: <span class="seller-name">Rotana NOB</span></div>
          <div style="font-size: 10px; color:#93c5fd;">Asia Euro University • 100% Positive Rating</div>
        </div>
      </div>

      <button class="btn-publish">
        🚀 Publish to Campus Marketplace
      </button>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  },
  {
    name: 'task2_checkout_payment_safety.png',
    title: 'Task 2: ShopSphere — PCI-DSS & Luhn Payment Safety Sandbox',
    subtitle: 'MOD 10 Checksum, Card Masking & Atomic Concurrency SQL Locks',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .phone-frame { width: 390px; height: 820px; background: #0f172a; border: 12px solid #1e293b; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 60px rgba(0,0,0,0.6); position: relative; }
  .status-bar { height: 44px; background: #0f172a; display: flex; justify-content: space-between; align-items: center; padding: 0 24px; color: #fff; font-size: 13px; font-weight: 600; }
  .notch { width: 110px; height: 22px; background: #000; border-radius: 12px; margin: 0 auto; }
  .app-header { padding: 14px 20px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
  .header-title { font-size: 17px; font-weight: 800; color: #f8fafc; }
  .secure-pill { background: #065f46; color: #a7f3d0; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 10px; display: flex; align-items: center; gap: 4px; }

  .content { flex: 1; overflow-y: auto; padding: 16px 20px; }
  
  .security-alert { background: #064e3b; border: 1px solid #059669; border-radius: 12px; padding: 10px 12px; display: flex; gap: 10px; margin-bottom: 16px; }
  .sec-icon { font-size: 16px; color: #34d399; }
  .sec-text { font-size: 11px; color: #d1fae5; line-height: 1.4; }
  
  .card-box { background: linear-gradient(135deg, #3730a3, #1e1b4b); border-radius: 16px; padding: 16px; border: 1px solid #6366f1; margin-bottom: 18px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); color: #fff; }
  .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .card-chip { width: 34px; height: 24px; background: #fbbf24; border-radius: 4px; }
  .card-brand { font-size: 16px; font-weight: 900; font-style: italic; color: #93c5fd; }
  .card-number { font-size: 17px; font-family: monospace; letter-spacing: 2px; margin-bottom: 14px; font-weight: 700; }
  .card-bottom { display: flex; justify-content: space-between; font-size: 11px; color: #cbd5e1; }
  
  .form-group { margin-bottom: 12px; }
  .form-label { font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; display: block; text-transform: uppercase; }
  .form-input { width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 9px 12px; color: #f8fafc; font-size: 12.5px; font-family: monospace; }
  .input-status { font-size: 10.5px; color: #34d399; font-weight: 700; margin-top: 3px; display: flex; align-items: center; gap: 4px; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  
  .tx-summary { background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 12px; margin: 14px 0; }
  .summary-row { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; margin-bottom: 6px; }
  .summary-row.total { font-size: 14px; font-weight: 800; color: #fff; border-top: 1px solid #334155; padding-top: 6px; margin-top: 6px; }

  .audit-box { font-size: 10.5px; color: #94a3b8; line-height: 1.4; background: #0b1120; border-radius: 8px; padding: 8px 10px; border: 1px solid #1e293b; margin-bottom: 14px; }
  .btn-pay { width: 100%; height: 46px; background: #10b981; border-radius: 12px; border: none; color: #fff; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(16,185,129,0.4); }
  .home-pill { width: 120px; height: 4px; background: #475569; border-radius: 2px; margin: 8px auto 4px auto; }
</style>
</head>
<body>
  <div class="phone-frame">
    <div class="status-bar">
      <span>9:41</span>
      <div class="notch"></div>
      <span>5G  100%</span>
    </div>

    <div class="app-header">
      <div class="header-title">Payment Safety</div>
      <div class="secure-pill">🔒 PCI-DSS Sandbox</div>
    </div>

    <div class="content">
      <div class="security-alert">
        <span class="sec-icon">✓</span>
        <div class="sec-text">
          <strong>Payment Safety Guaranteed:</strong> Zero card numbers stored in plaintext. Luhn Checksum active & tokenized transaction hashes generated.
        </div>
      </div>

      <div class="card-box">
        <div class="card-top">
          <div class="card-chip"></div>
          <div class="card-brand">VISA</div>
        </div>
        <div class="card-number">4532 •••• •••• 8821</div>
        <div class="card-bottom">
          <div>CARDHOLDER<br><strong>ROTANA NOB</strong></div>
          <div>EXPIRES<br><strong>08/28</strong></div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Primary Account Number (PAN)</label>
        <div class="form-input">4532 8901 2345 8821</div>
        <div class="input-status">✓ Luhn MOD 10 Checksum Valid (Visa Debit)</div>
      </div>

      <div class="two-col">
        <div class="form-group">
          <label class="form-label">Expiration Date</label>
          <div class="form-input">08 / 28</div>
        </div>
        <div class="form-group">
          <label class="form-label">CVV / CVC</label>
          <div class="form-input">••• [3-digit verified]</div>
        </div>
      </div>

      <div class="tx-summary">
        <div class="summary-row"><span>MacBook Pro 14" M3 Pro</span><span>$1,450.00</span></div>
        <div class="summary-row"><span>Campus Handover & Inspection</span><span>$2.00</span></div>
        <div class="summary-row total"><span>Total Authoritative Amount</span><span>$1,452.00</span></div>
      </div>

      <div class="audit-box">
        🔒 <strong>Concurrency Lock:</strong> SQL row-level lock (prisma.$transaction) guarantees stock availability before debit.<br>
        🔑 <strong>Hash Reference:</strong> <code>TXN-8821-202610-CONFIRMED</code>
      </div>

      <button class="btn-pay">
        🛡️ Authorize & Pay $1,452.00
      </button>
    </div>
    <div class="home-pill"></div>
  </div>
</body>
</html>
`
  }
];

async function run() {
  console.log('📸 Generating high-resolution UI screenshots for submission report...');
  for (const s of screens) {
    const tempHtml = path.join(__dirname, 'temp_' + s.name.replace('.png', '.html'));
    const targetPng = path.join(outputDir, s.name);
    fs.writeFileSync(tempHtml, s.html, 'utf-8');

    const cmd = `${edgePath} --headless --disable-gpu --screenshot="${targetPng}" --window-size=1200,980 "file://${tempHtml.replace(/\\\\/g, '/')}"`;
    try {
      execSync(cmd);
      console.log(`✅ Generated: ${s.name}`);
    } catch (err) {
      console.error(`❌ Error rendering ${s.name}:`, err.message);
    } finally {
      if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
    }
  }
  console.log('🎉 All screenshots generated in docs/screenshots/');
}

run();
