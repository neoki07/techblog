import { formatDate } from 'utils/format'

export default {
  darkMode: true,
  dateFormatter: date => `最終更新日 - ${formatDate(date)}`,
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
      © {new Date().getFullYear()} neoki. Built using <a href="https://nextra.site" target="_blank" rel="noopener noreferrer">Nextra</a>, hosted on <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">Vercel</a>.
    </small>
  ),
  navs: [
    {
      url: "/feed.xml",
      name: "RSS",
    },
    {
      name: 'GitHub',
      url: 'https://github.com/neoki07/techblog'
    }
  ]
}
