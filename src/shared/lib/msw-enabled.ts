/** The SPA has no external API. MSW stays on unless explicitly disabled. */
export const MSW_ENABLED = import.meta.env.VITE_ENABLE_MSW !== 'false'
