import { useState } from 'react'
import communityImage from './assets/images/community.jpeg'
import connectionImage from './assets/images/connect.jpeg'
import developmentImage from './assets/images/develop.jpeg'
// To swap the About image, drop a new file in src/assets/images/ and update this import.
import aboutImage from './assets/images/about.jpeg'
import gemMark from './assets/images/gem-mark.png'
import gemPromoVideo from './assets/videos/GEM promo video.mov'
import './App.css'

// To swap a panel's image, replace the import path above and reference it here.
const HERO_PANELS = [
  {
    title: 'Community',
    description:
      'A curated circle of members brought together through shared ambition, taste, and real-world experiences.',
    href: '#about',
    cta: 'Our mission',
    image: communityImage,
  },
  {
    title: 'Connection',
    description:
      'Intentional introductions, private gatherings, and moments designed to make meaningful relationships feel natural.',
    href: '#experiences',
    cta: 'View experiences',
    image: connectionImage,
  },
  {
    title: 'Development',
    description:
      'A space for members to grow socially, creatively, and professionally through access, collaboration, and opportunity.',
    href: '#membership',
    cta: 'Become a member',
    image: developmentImage,
  },
]

const EXPERIENCES = [
  {
    eyebrow: 'Access',
    title: 'Private Gatherings',
    role: 'Member Access',
    date: 'Year-round programming',
    description:
      'Small-format dinners, socials, and evenings built around real conversation, strong chemistry, and the kind of atmosphere that makes showing up feel effortless.',
    primaryAction: { label: 'Become a member', href: '#membership' },
    secondaryAction: { label: 'Our mission', href: '#about' },
    video: `${gemPromoVideo}#private-gatherings`,
  },
  {
    eyebrow: 'Introductions',
    title: 'Curated Introductions',
    role: 'Relationship Design',
    date: 'Personal and ongoing',
    description:
      'Intentional introductions between members with shared interests, complementary goals, and real potential for friendship, collaboration, or long-term alignment.',
    primaryAction: { label: 'Become a member', href: '#membership' },
    secondaryAction: { label: 'View experiences', href: '#experiences' },
    video: `${gemPromoVideo}#curated-introductions`,
  },
  {
    eyebrow: 'Events',
    title: 'Member Events',
    role: 'Cultural Programming',
    date: 'Seasonal calendar',
    description:
      'Access to invite-only experiences, cultural nights, launches, and community moments designed to feel elevated, social, and genuinely worth remembering.',
    primaryAction: { label: 'View experiences', href: '#experiences' },
    secondaryAction: { label: 'Become a member', href: '#membership' },
    video: `${gemPromoVideo}#member-events`,
  },
  {
    eyebrow: 'Community',
    title: 'The Social Layer',
    role: 'Private Network',
    date: 'Always on',
    description:
      'A private layer for discovering who is gathering, what is happening next, and how the wider community is moving between in-person moments.',
    primaryAction: { label: 'Our mission', href: '#about' },
    secondaryAction: { label: 'Become a member', href: '#membership' },
    video: `${gemPromoVideo}#social-layer`,
  },
]

function App() {
  const [cardIndex, setCardIndex] = useState(0)
  const cardCount = EXPERIENCES.length
  const nextCard = () => setCardIndex((i) => (i + 1) % cardCount)
  const prevCard = () =>
    setCardIndex((i) => (i - 1 + cardCount) % cardCount)
  const activeExperience = EXPERIENCES[cardIndex]

  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="#hero" aria-label="GEM Social Club">
          <span className="brand__copy">
            <span className="brand__name">GEM</span>
            <span className="brand__tag">Social Club</span>
          </span>
          <span
            className="brand__icon"
            style={{ '--brand-icon': `url(${gemMark})` }}
            aria-hidden="true"
          />
        </a>
      </header>

      <main className="hero" id="hero">
        <h1 className="sr-only">Gem Network</h1>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
        <div className="hero__panels">
          {HERO_PANELS.map((panel) => (
            <a
              key={panel.title}
              className="hero-panel"
              href={panel.href}
              aria-label={`${panel.title}. ${panel.description}`}
            >
              <div
                className="hero-panel__image"
                style={{ backgroundImage: `url(${panel.image})` }}
                aria-hidden="true"
              />
              <div className="hero-panel__overlay" aria-hidden="true" />
              <div className="hero-panel__content">
                <div className="hero-panel__body">
                  <span className="hero-panel__title">{panel.title}</span>
                  <span className="hero-panel__description">
                    {panel.description}
                  </span>
                </div>
                {panel.cta ? (
                  <span className="hero-panel__cta" aria-hidden="true">
                    <span>{panel.cta}</span>
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      </main>

      <section className="about" id="about">
        <div className="about__inner">
          <div className="about__media">
            <p className="about__eyebrow">About</p>
            <img
              className="about__image"
              src={aboutImage}
              alt=""
              loading="lazy"
            />
          </div>
          <div className="about__copy">
            <h2 className="about__heading">
              A community that shines brighter together.
            </h2>
            <div className="about__body">
              <p>
                <span className="about__lead">Everyone is a GEM.</span>
                At The Gem Network, we believe every person is a gem, shaped
                by unique experiences, full of value, and deserving of spaces
                where they can connect, grow, and let their shine be seen.
              </p>
              <p className="about__closing">
                We host private gatherings, facilitate thoughtful
                introductions, and create moments designed to foster meaningful
                relationships and personal growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="experiences" id="experiences">
        <video
          key={activeExperience.video}
          className="experiences__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={activeExperience.video} />
        </video>
        <div className="experiences__overlay" aria-hidden="true" />
        <div className="experiences__grain" aria-hidden="true" />

        <div className="experiences__content">
          <header className="experiences__intro">
            <p className="experiences__kicker">Experiences</p>
            <h2 className="experiences__heading">{activeExperience.title}</h2>
            <div className="experiences__meta">
              <span>{activeExperience.eyebrow}</span>
              <span className="experiences__meta-dot" aria-hidden="true" />
              <span>{activeExperience.role}</span>
              <span className="experiences__meta-dot" aria-hidden="true" />
              <span>{activeExperience.date}</span>
            </div>
          </header>

          <div className="experiences__stage">
            <article key={cardIndex} className="slide">
              <p className="slide__body">{activeExperience.description}</p>
              <div className="experiences__actions">
                <a
                  className="experiences__action experiences__action--primary"
                  href={activeExperience.primaryAction.href}
                >
                  {activeExperience.primaryAction.label}
                </a>
                <a
                  className="experiences__action experiences__action--secondary"
                  href={activeExperience.secondaryAction.href}
                >
                  {activeExperience.secondaryAction.label}
                </a>
              </div>
            </article>
          </div>

          <button
            type="button"
            className="experiences__nav experiences__nav--prev"
            onClick={prevCard}
            aria-label="Previous experience"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p
            className="experiences__counter"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>{String(cardIndex + 1).padStart(2, '0')}</span>
            <span className="experiences__counter-slash" aria-hidden="true">
              /
            </span>
            <span>{String(cardCount).padStart(2, '0')}</span>
          </p>
          <button
            type="button"
            className="experiences__nav experiences__nav--next"
            onClick={nextCard}
            aria-label="Next experience"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      <section className="membership" id="membership">
        <div className="membership__inner">
          <p className="membership__eyebrow">Membership</p>
          <div className="membership__content">
            <h2 className="membership__heading">
              An intentionally small membership shaped by chemistry,
              contribution, and presence.
            </h2>
            <div className="membership__body">
              <p>
                Applications are reviewed with an eye for generosity,
                discretion, and the kind of energy that strengthens the room
                for everyone already inside it.
              </p>
              <p>
                Access remains limited by design so introductions stay personal,
                gatherings stay thoughtful, and every opportunity feels
                genuinely curated rather than mass-produced.
              </p>
            </div>
            <p className="membership__note">
              Applications are reviewed on a rolling basis.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
