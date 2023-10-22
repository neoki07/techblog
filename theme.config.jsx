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
        paddingTop: '2rem'
      }}
    >
      © {new Date().getFullYear()} ot07.
    </small>
  ),
  navs: [
    {
      name: 'GitHub',
      url: 'https://github.com/ot07/techblog'
    }
  ]
}
