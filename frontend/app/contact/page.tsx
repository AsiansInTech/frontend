const DISCORD_LINK = '#discord-link-temp'
const INSTAGRAM_LINK = '#instagram-link-temp'
const CONTACT_EMAIL = 'info@AiT.com'

export default function ContactPage() {
  return (
    <main className="section-shell space-y-12 md:space-y-16">
      <header className="space-y-4">
        <h1>Contact Us</h1>
        <p className="max-w-2xl text-gray-300">
          Have questions or want to get involved? Reach out to us directly or connect with our team.
        </p>
      </header>

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2>Get in Touch</h2>
          <p>
            If you have any questions or concerns, please feel free to reach out to us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-100 underline underline-offset-4 hover:text-gray-50 transition">
              {CONTACT_EMAIL}
            </a>{' '}
            or via this form.
          </p>
          <p>
            You can also join our{' '}
            <a href={DISCORD_LINK} className="text-gray-100 underline underline-offset-4 hover:text-gray-50 transition">
              Discord
            </a>
            , follow us on{' '}
            <a href={INSTAGRAM_LINK} className="text-gray-100 underline underline-offset-4 hover:text-gray-50 transition">
              Instagram
            </a>
            , or connect with us on{' '}
            <a href="#linkedin-link-temp" className="text-gray-100 underline underline-offset-4 hover:text-gray-50 transition">
              LinkedIn!
            </a>
          </p>
          <p>
            Want to meet the team? Check out our{' '}
            <a href="/officers" className="text-gray-100 underline underline-offset-4 hover:text-gray-50 transition">
              Officers page
            </a>
            .
          </p>
        </div>

        <div className="glass-panel p-6 md:p-7">
          <h2 className="mb-6">Send us a Message</h2>
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                placeholder="Cody"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                placeholder="info@AiT.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-2.5 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition resize-none"
                placeholder="Questions, comments, concerns, suggestions"
              />
            </div>

            <button type="submit" className="primary-cta w-full">
              Submit
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
