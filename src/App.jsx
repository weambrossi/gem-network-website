import { useEffect, useRef, useState } from 'react'
import communityImage from './assets/images/community.jpeg'
import connectionImage from './assets/images/connect.jpeg'
import developmentImage from './assets/images/develop.jpeg'
// To swap the About image, drop a new file in src/assets/images/ and update this import.
import aboutImage from './assets/images/about.jpeg'
import gemMark from './assets/images/gem-mark.png'
import gemPromoVideo from './assets/videos/GEM promo video.mov'
import { supabase } from './lib/supabase'
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

const ABOUT_SLIDES = [
  { src: communityImage, caption: 'Private gatherings, with purpose.' },
  { src: connectionImage, caption: 'Introductions made with intention.' },
  { src: developmentImage, caption: 'Rooms built for personal growth.' },
  { src: aboutImage, caption: 'Every person, a Gem.' },
]

const MEMBERSHIP_INTERESTS = [
  'Community',
  'Connection',
  'Development',
  'Events',
  'Leadership',
  'Other',
]

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  interest: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function App() {
  const [cardIndex, setCardIndex] = useState(0)
  const [isMembershipVisible, setIsMembershipVisible] = useState(false)
  const [aboutSlide, setAboutSlide] = useState(0)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitState, setSubmitState] = useState({
    status: 'idle',
    message: '',
  })
  const membershipRef = useRef(null)
  const aboutRef = useRef(null)
  const aboutSlideCount = ABOUT_SLIDES.length
  const cardCount = EXPERIENCES.length
  const nextCard = () => setCardIndex((i) => (i + 1) % cardCount)
  const prevCard = () =>
    setCardIndex((i) => (i - 1 + cardCount) % cardCount)
  const activeExperience = EXPERIENCES[cardIndex]

  useEffect(() => {
    const node = membershipRef.current

    if (!node) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMembershipVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = aboutRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mql =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null
    if (mql && mql.matches) return undefined

    const id = setInterval(() => {
      setAboutSlide((i) => (i + 1) % aboutSlideCount)
    }, 6500)
    return () => clearInterval(id)
  }, [aboutSlideCount])

  const validateForm = (values) => {
    const errors = {}

    if (!values.firstName.trim()) {
      errors.firstName = 'First name is required.'
    }

    if (!values.lastName.trim()) {
      errors.lastName = 'Last name is required.'
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!values.interest) {
      errors.interest = 'Please select an interest.'
    }

    return errors
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setFieldErrors((current) => {
      if (!current[name]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })

    if (submitState.status !== 'idle') {
      setSubmitState({
        status: 'idle',
        message: '',
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const normalizedFormData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      interest: formData.interest,
    }

    const errors = validateForm(normalizedFormData)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setSubmitState({
        status: 'error',
        message: 'Please review the highlighted fields and try again.',
      })
      return
    }

    if (!supabase) {
      setSubmitState({
        status: 'error',
        message:
          'The application form is not configured yet. Add your Supabase URL and anon key to continue.',
      })
      return
    }

    setFieldErrors({})
    setSubmitState({
      status: 'loading',
      message: '',
    })

    const { error } = await supabase.from('member_signups').insert({
      first_name: normalizedFormData.firstName,
      last_name: normalizedFormData.lastName,
      email: normalizedFormData.email,
      interest: normalizedFormData.interest,
      source: 'landing_page',
    })

    if (error) {
      const message =
        error.code === '23505'
          ? 'That email has already been submitted. If this is you, we already have your application.'
          : 'Something went wrong while sending your application. Please try again in a moment.'

      setSubmitState({
        status: 'error',
        message,
      })
      return
    }

    setFormData(INITIAL_FORM_DATA)
    setSubmitState({
      status: 'success',
      message:
        'Application received. Thank you for your interest in joining GEM.',
    })
  }

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

      <section
        className={`about${isAboutVisible ? ' about--visible' : ''}`}
        id="about"
        ref={aboutRef}
      >
        <div className="about__inner">
          <header className="about__header">
            <p className="about__eyebrow">About</p>
            <span className="about__rule" aria-hidden="true" />
          </header>

          <div className="about__grid">
            <figure className="about__media">
              <div className="about__frame">
                {ABOUT_SLIDES.map((slide, i) => (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt=""
                    loading="lazy"
                    className={`about__slide${
                      i === aboutSlide ? ' about__slide--active' : ''
                    }`}
                  />
                ))}
                <div className="about__frame-overlay" aria-hidden="true" />
                <figcaption className="about__caption">
                  {ABOUT_SLIDES[aboutSlide].caption}
                </figcaption>
              </div>
              <div
                className="about__indicators"
                role="tablist"
                aria-label="About slides"
              >
                {ABOUT_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === aboutSlide}
                    aria-label={`Show slide ${i + 1}`}
                    className={`about__indicator${
                      i === aboutSlide ? ' about__indicator--active' : ''
                    }`}
                    onClick={() => setAboutSlide(i)}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </figure>

            <div className="about__copy">
              <h2 className="about__heading">
                A community that shines
                <br />
                brighter together.
              </h2>
              <p className="about__sub">Every person is a Gem.</p>
              <p className="about__body-text">
                The Gem Network creates intentional spaces for people to
                connect, grow, and be seen. Through private gatherings,
                curated introductions, and shared experiences, we bring
                together people who value meaningful relationships over
                surface-level networking.
              </p>
              <p className="about__emphasis">
                Less networking. More belonging.
              </p>
            </div>
          </div>

          <ul className="about__pillars">
            <li className="about__pillar">
              <span className="about__pillar-num">01</span>
              <h3 className="about__pillar-title">Community</h3>
              <p className="about__pillar-body">
                Private gatherings with purpose.
              </p>
            </li>
            <li className="about__pillar">
              <span className="about__pillar-num">02</span>
              <h3 className="about__pillar-title">Connection</h3>
              <p className="about__pillar-body">
                Introductions that feel intentional.
              </p>
            </li>
            <li className="about__pillar">
              <span className="about__pillar-num">03</span>
              <h3 className="about__pillar-title">Development</h3>
              <p className="about__pillar-body">
                Spaces built for personal growth.
              </p>
            </li>
          </ul>
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

      <section
        ref={membershipRef}
        className={`membership ${isMembershipVisible ? 'membership--visible' : ''}`}
        id="membership"
      >
        <div className="membership__inner">
          <p className="membership__eyebrow">Membership</p>
          <div className="membership__content">
            <h2 className="membership__heading">Apply to be a GEM</h2>
            <form className="membership-form" onSubmit={handleSubmit} noValidate>
              <div className="membership-form__grid">
                <label className="membership-form__field">
                  <span className="sr-only">First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    placeholder="First Name"
                    aria-invalid={Boolean(fieldErrors.firstName)}
                    aria-describedby={
                      fieldErrors.firstName ? 'first-name-error' : undefined
                    }
                    required
                  />
                  {fieldErrors.firstName ? (
                    <span
                      className="membership-form__error"
                      id="first-name-error"
                    >
                      {fieldErrors.firstName}
                    </span>
                  ) : null}
                </label>

                <label className="membership-form__field">
                  <span className="sr-only">Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    placeholder="Last Name"
                    aria-invalid={Boolean(fieldErrors.lastName)}
                    aria-describedby={
                      fieldErrors.lastName ? 'last-name-error' : undefined
                    }
                    required
                  />
                  {fieldErrors.lastName ? (
                    <span
                      className="membership-form__error"
                      id="last-name-error"
                    >
                      {fieldErrors.lastName}
                    </span>
                  ) : null}
                </label>

                <label className="membership-form__field membership-form__field--full">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? 'email-error' : undefined
                    }
                    required
                  />
                  {fieldErrors.email ? (
                    <span className="membership-form__error" id="email-error">
                      {fieldErrors.email}
                    </span>
                  ) : null}
                </label>

                <label className="membership-form__field membership-form__field--full">
                  <span className="sr-only">Interest</span>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.interest)}
                    aria-describedby={
                      fieldErrors.interest ? 'interest-error' : undefined
                    }
                    required
                  >
                    <option value="">Interest</option>
                    {MEMBERSHIP_INTERESTS.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.interest ? (
                    <span
                      className="membership-form__error"
                      id="interest-error"
                    >
                      {fieldErrors.interest}
                    </span>
                  ) : null}
                </label>
              </div>

              <div className="membership-form__footer">
                <button
                  type="submit"
                  className="membership-form__submit"
                  disabled={submitState.status === 'loading'}
                >
                  {submitState.status === 'loading' ? 'Applying...' : 'Apply'}
                </button>
                {submitState.message ? (
                  <p
                    className={`membership-form__message membership-form__message--${submitState.status}`}
                    role={submitState.status === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                  >
                    {submitState.message}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
