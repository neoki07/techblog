/* eslint sort-keys: error */
export default {
  darkMode: true,
  dateFormatter: date => `Last updated at ${date.toDateString()}`,
  footer: (
    <small
      style={{
        borderWidth: '1px 0 0 0',
        display: 'block',
        marginTop: '3rem',
        paddingTop: '2rem',
        textAlign: 'center',
      }}
    >
      © {new Date().getFullYear()} ot07. Built using <a href="https://nextra.site" target="_blank" rel="noopener noreferrer">Nextra</a>, hosted on <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">Vercel</a>.
    </small>
  ),
  navs: [
    {
      url: "/feed.xml",
      name: "RSS",
    },
    {
      name: 'GitHub',
      url: 'https://github.com/ot07/techblog'
    }
  ]
}
