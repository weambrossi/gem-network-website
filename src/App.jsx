import { useEffect, useRef, useState } from 'react'
import communityImage from './assets/images/community.jpeg'
import connectionImage from './assets/images/connect.jpeg'
import developmentImage from './assets/images/develop.jpeg'
import gemMark from './assets/images/gem-mark.png'
import workHardImage from './assets/images/workhard1.jpeg'
import gemPromoVideo from './assets/videos/GEM promo video.mov'
import { supabase, supabaseConfigError } from './lib/supabase'
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

const EXPERIENCE_MEDIA = [
  {
    src: workHardImage,
    alt: 'Members gathered for a GEM work hard experience.',
  },
  {
    src: developmentImage,
    alt: 'Members participating in a GEM development experience.',
  },
]

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_DIGIT_PATTERN = /\D/g

function App() {
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isMembershipVisible, setIsMembershipVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(true)
  const [revealedHeroPanels, setRevealedHeroPanels] = useState([])
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitState, setSubmitState] = useState({
    status: 'idle',
    message: '',
  })
  const membershipRef = useRef(null)
  const aboutRef = useRef(null)
  const activeExperienceImage = EXPERIENCE_MEDIA[carouselIndex]

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
      { threshold: 0.25, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const revealHeroPanel = (panelTitle) => {
    setRevealedHeroPanels((currentPanels) => {
      if (currentPanels.includes(panelTitle)) {
        return currentPanels
      }

      return [...currentPanels, panelTitle]
    })
  }

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

    const phoneDigits = values.phone.replace(PHONE_DIGIT_PATTERN, '')

    if (!values.phone.trim()) {
      errors.phone = 'Phone number is required.'
    } else if (phoneDigits.length < 10) {
      errors.phone = 'Please enter a valid phone number.'
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
      phone: formData.phone.trim(),
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
          supabaseConfigError ||
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
      phone_number: normalizedFormData.phone,
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
              className={`hero-panel${
                revealedHeroPanels.includes(panel.title)
                  ? ' hero-panel--revealed'
                  : ''
              }`}
              href={panel.href}
              aria-label={`${panel.title}. ${panel.description}`}
              onMouseEnter={() => revealHeroPanel(panel.title)}
              onFocus={() => revealHeroPanel(panel.title)}
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
          <h2 className="sr-only">Our Mission</h2>
          <p className="about__statement">
            <span className="about__statement-line">Everyone is a Gem.</span>
            <span className="about__statement-line about__statement-line--accent">
              Let it shine.
            </span>
          </p>
          <div className="about__content">
            <p className="about__body">
              A community where ambition meets authenticity — built for
              people who value real connection over surface-level
              networking.
            </p>
            <div className="about__actions">
              <a className="about__cta" href="#about-divider">
                <span>Read More</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a className="about__cta" href="#membership">
                <span>Meet the Founder</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div
            className="about__divider"
            id="about-divider"
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="experiences" id="experiences">
        <div className="experiences__content">
          <div className="experiences__media-grid">
            <article className="experiences__panel experiences__panel--carousel">
              <div
                className="experiences__pagination"
                aria-label="Experience image carousel"
              >
                {EXPERIENCE_MEDIA.map((item, index) => (
                  <button
                    key={item.src}
                    type="button"
                    aria-pressed={carouselIndex === index}
                    aria-label={`Show experience image ${index + 1}`}
                    className={`experiences__pagination-button ${
                      carouselIndex === index
                        ? 'experiences__pagination-button--active'
                        : ''
                    }`}
                    onClick={() => setCarouselIndex(index)}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
              <img
                key={activeExperienceImage.src}
                className="experiences__image"
                src={activeExperienceImage.src}
                alt={activeExperienceImage.alt}
                loading="lazy"
              />
              <div className="experiences__panel-overlay" aria-hidden="true" />
              <p className="experiences__panel-label">Work hard.</p>
            </article>

            <article className="experiences__panel experiences__panel--video">
              <video
                className="experiences__video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={gemPromoVideo} />
              </video>
              <div className="experiences__panel-overlay" aria-hidden="true" />
              <p className="experiences__panel-label">Play hard.</p>
            </article>
          </div>

          <div className="experiences__editorial">
            <p className="experiences__kicker">Experiences</p>
            <p className="experiences__body">
              GEM is built on the belief that professional growth should feel
              personal, social, and energizing.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={membershipRef}
        className={`membership ${isMembershipVisible ? 'membership--visible' : ''}`}
        id="membership"
      >
        <div className="membership__inner">
          <div className="membership__content">
            <span
              className="membership__mark"
              style={{ '--brand-icon': `url(${gemMark})` }}
              aria-hidden="true"
            />
            <h2 className="membership__heading">Stay in Touch</h2>
            <p className="membership__subheading">
              Signup for our newsletters and upcoming GEM events
            </p>
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
                  <span className="sr-only">Phone Number</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Phone Number"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={
                      fieldErrors.phone ? 'phone-error' : undefined
                    }
                    required
                  />
                  {fieldErrors.phone ? (
                    <span
                      className="membership-form__error"
                      id="phone-error"
                    >
                      {fieldErrors.phone}
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
                  {submitState.status === 'loading' ? 'Submitting...' : 'Get started'}
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
