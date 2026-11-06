import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  Compass,
  FileText,
  MessageCircleMore,
  Sparkles,
  Video,
} from "lucide-react";
import "./home.css";

const tools = [
  {
    number: "01",
    icon: FileText,
    title: "Make your experience clear",
    text: "Shape a resume around your projects, strengths and the role you want next.",
    href: "/dashboard/ai-resume",
    link: "Build a resume",
    color: "sage",
  },
  {
    number: "02",
    icon: Compass,
    title: "Find a direction that fits",
    text: "Explore roles and learning paths, then choose a next step that feels doable.",
    href: "/opportunities",
    link: "Explore opportunities",
    color: "peach",
  },
  {
    number: "03",
    icon: Video,
    title: "Get comfortable talking about you",
    text: "Practice interview questions at your own pace and work on your answers.",
    href: "/dashboard/ai-interview",
    link: "Practice an interview",
    color: "lavender",
  },
  {
    number: "04",
    icon: MessageCircleMore,
    title: "Talk through the tricky bits",
    text: "Use the career coach to think through applications, goals and what comes next.",
    href: "/dashboard/ai-coach",
    link: "Open career coach",
    color: "blue",
  },
];

const steps = [
  [
    "Start where you are",
    "Add your background, interests and the work you’ve done.",
  ],
  [
    "Choose one useful next step",
    "Build a resume, explore openings or practice a conversation.",
  ],
  [
    "Keep moving at your pace",
    "Use your workspace to come back to your applications and plans.",
  ],
];

export default function HomePage() {
  return (
    <div className="nh-home">
      <section className="nh-hero">
        <div className="nh-hero-grid" aria-hidden="true" />
        <div className="nh-hero-inner">
          <div className="nh-hero-copy">
            <p className="nh-kicker">
              <span className="nh-kicker-mark" /> A career toolkit for your next
              chapter
            </p>
            <h1>
              Make your next move
              <br />
              <em>feel more like yours.</em>
            </h1>
            <p className="nh-lede">
              A calmer place to work on your resume, explore opportunities and
              get ready for the conversations ahead.
            </p>
            <div className="nh-actions">
              <Link className="nh-button nh-button-dark" href="/signup/student">
                Start with your profile <ArrowRight size={17} />
              </Link>
              <Link className="nh-text-link" href="/opportunities">
                Explore opportunities <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="nh-note">
              <Sparkles size={14} /> Built for students, freshers and
              early-career explorers.
            </div>
          </div>

          <div
            className="nh-hero-art"
            aria-label="Illustration of a career workspace"
          >
            <div className="nh-orbit nh-orbit-one" />
            <div className="nh-orbit nh-orbit-two" />
            <div className="nh-sun" />
            <div className="nh-floating-note nh-note-top">
              <span className="nh-note-icon">
                <FileText size={17} />
              </span>
              <span>
                <b>Your story</b>
                <small>Projects · skills · goals</small>
              </span>
              <Check className="nh-check" size={16} />
            </div>
            <div className="nh-workspace-card">
              <div className="nh-workspace-head">
                <span className="nh-window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>YOUR NEXT STEP</span>
                <ArrowDownRight size={17} />
              </div>
              <div className="nh-workspace-body">
                <div className="nh-portrait" aria-hidden="true">
                  <span>✳</span>
                </div>
                <div className="nh-person-copy">
                  <span className="nh-skeleton nh-skeleton-wide" />
                  <span className="nh-skeleton nh-skeleton-short" />
                  <span className="nh-person-tag">
                    EARLY CAREER · OPEN TO GROW
                  </span>
                </div>
              </div>
              <div className="nh-workspace-rule" />
              <div className="nh-workspace-links">
                <span>
                  <FileText size={15} /> Resume
                </span>
                <span>
                  <BriefcaseBusiness size={15} /> Roles
                </span>
                <span>
                  <Video size={15} /> Practice
                </span>
              </div>
              <div className="nh-workspace-footer">
                <span className="nh-status-dot" /> A little progress, one step
                at a time <ArrowRight size={14} />
              </div>
            </div>
            <div className="nh-floating-note nh-note-bottom">
              <span className="nh-sparkle-badge">
                <Sparkles size={17} />
              </span>
              <span>
                <b>Small steps count.</b>
                <small>Pick up where you left off.</small>
              </span>
            </div>
            <div className="nh-art-caption">
              A workspace that grows with you <span>✳</span>
            </div>
          </div>
        </div>
        <div className="nh-hero-bottom">
          <span>LESS GUESSWORK, MORE GOOD NEXT STEPS</span>
          <span>01 / 03</span>
        </div>
      </section>

      <section className="nh-tools section-wrap" id="toolkit">
        <div className="nh-section-heading">
          <div>
            <p className="nh-eyebrow">A LITTLE HELP, RIGHT WHEN YOU NEED IT</p>
            <h2>
              Good work deserves
              <br />
              <em>a good place to grow.</em>
            </h2>
          </div>
          <p className="nh-section-intro">
            Career plans aren’t always a straight line. Use the tools that help
            today, and leave the rest for later.
          </p>
        </div>
        <div className="nh-tool-grid">
          {tools.map(
            ({ number, icon: Icon, title, text, href, link, color }) => (
              <article className={`nh-tool-card ${color}`} key={number}>
                <div className="nh-card-top">
                  <span>{number} / TOOL</span>
                  <span className="nh-tool-icon">
                    <Icon size={19} />
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link href={href} className="nh-card-link">
                  {link}
                  <ArrowUpRight size={16} />
                </Link>
              </article>
            )
          )}
        </div>
      </section>

      <section className="nh-path-section">
        <div className="section-wrap nh-path-inner">
          <div className="nh-path-title">
            <p className="nh-eyebrow">NO PERFECT TIMELINE REQUIRED</p>
            <h2>
              One step is
              <br />
              <em>still a start.</em>
            </h2>
            <p>
              Come back to your plans when you’re ready. You don’t have to
              figure out the whole career at once.
            </p>
            <Link className="nh-path-link" href="/dashboard/applications">
              Go to your workspace <ArrowRight size={16} />
            </Link>
          </div>
          <div className="nh-steps">
            {steps.map(([title, text], index) => (
              <div className="nh-step" key={title}>
                <span className="nh-step-number">0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <span className="nh-step-check">
                  <Check size={15} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nh-bottom-cta">
        <div className="section-wrap nh-cta-inner">
          <div className="nh-cta-flower" aria-hidden="true">
            ✳
          </div>
          <div>
            <p className="nh-eyebrow">YOUR NEXT CHAPTER STARTS SOMEWHERE</p>
            <h2>It can start right here.</h2>
            <p>Pick one thing you’d like to make easier today.</p>
          </div>
          <Link className="nh-button nh-button-cream" href="/dashboard">
            Open your workspace <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <div className="nh-footnote">
        <span>NextHire AI</span>
        <span>Tools to help you move forward, at your own pace.</span>
        <span>
          <BookOpenCheck size={14} /> Learn · Prepare · Explore
        </span>
      </div>
    </div>
  );
}
