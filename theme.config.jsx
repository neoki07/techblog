/** @type {import('nextra-theme-docs').DocsThemeConfig} */
const themeConfig = {
  logo:  () => {
    const title = "ot07's Tech Blog";
    return (
      <span
        className="mx-2 font-extrabold hidden md:inline select-none"
        title={title}
      >
        {title}
      </span>
    );
  },
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  footer: {
    component: null,
  },
  gitTimestamp: null,
  nextThemes: {
    forcedTheme: 'light',
  },
  project: {
    link: "https://github.com/ot07",
  }
}

export default themeConfig
