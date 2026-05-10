import { useState } from 'react'
import communityImage from './assets/images/community.jpeg'
import connectionImage from './assets/images/connect.jpeg'
import developmentImage from './assets/images/develop.jpeg'
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

const MEMBERSHIP_CARDS = [
  {
    eyebrow: 'Access',
    title: 'Private Gatherings',
    body: 'Small-format dinners, socials, and events built around real conversation.',
  },
  {
    eyebrow: 'Introductions',
    title: 'Curated Introductions',
    body: 'Intentional connections between members with shared interests, goals, or circles.',
  },
  {
    eyebrow: 'Events',
    title: 'Member Events',
    body: 'Access to invite-only experiences, cultural nights, launches, and community meetups.',
  },
  {
    eyebrow: 'Community',
    title: 'The Social Layer',
    body: 'A private space to discover who is going, what is happening, and where the community is gathering.',
  },
]

function App() {
  const [cardIndex, setCardIndex] = useState(0)
  const cardCount = MEMBERSHIP_CARDS.length
  const nextCard = () => setCardIndex((i) => (i + 1) % cardCount)
  const prevCard = () =>
    setCardIndex((i) => (i - 1 + cardCount) % cardCount)
  const card = MEMBERSHIP_CARDS[cardIndex]

  return (
    <div className="page">
      <header className="nav">
        <a className="brand" href="#hero" aria-label="GEM Social Club">
          <span className="brand__name">GEM</span>
          <span className="brand__tag">Social Club</span>
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
          <p className="about__eyebrow">About</p>
          <h2 className="about__heading">
            A members-only social club for builders, thinkers, and quiet
            tastemakers.
          </h2>
          <div className="about__body">
            <p>
              GEM is an invite-only network for people who care about the craft
              of what they make and the company they keep. We host intimate
              dinners, salons, and quiet rooms — online and off — where ideas
              move faster because trust is already there.
            </p>
            <p>
              Membership is curated, not sold. If we know you, we&rsquo;ll find
              you.
            </p>
          </div>
        </div>
      </section>

      <section className="experiences" id="experiences">
        <header className="experiences__intro">
          <h2 className="experiences__heading">Experiences</h2>
          <p className="experiences__lede">
            Membership is more than access to a network. It is entry into
            curated rooms, thoughtful introductions, and shared moments
            designed to make connection feel natural again.
          </p>
        </header>

        <div className="experiences__stage">
          <article key={cardIndex} className="slide">
            <p className="slide__eyebrow">{card.eyebrow}</p>
            <h3 className="slide__title">{card.title}</h3>
            <p className="slide__body">{card.body}</p>
          </article>
        </div>

        <footer className="experiences__footer">
          <button
            type="button"
            className="experiences__nav"
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
            className="experiences__nav"
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
        </footer>
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
