import i18n from '@/libs/i18n'
import { useLocaleStore } from '@/store/localeStore'
import { nextTick } from 'vue'

const localeStore = useLocaleStore()

const Trans = {
  get defaultLocale() {
    return localeStore.getLocale
  },

  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(',')
  },

  get currentLocale() {
    return i18n.global.locale.value
  },

  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale
  },

  async switchLanguage(newLocale) {
    await Trans.loadLocaleMessages(newLocale)
    Trans.currentLocale = newLocale
    document.querySelector('html').setAttribute('lang', newLocale)
    localeStore.setLocale(newLocale)
  },

  async loadLocaleMessages(locale) {
    if (!i18n.global.availableLocales.includes(locale)) {
      const messages = await import(`@/libs/i18n/locales/${locale}.json`)
      i18n.global.setLocaleMessage(locale, messages.default)
    }

    return nextTick()
  },

  isLocaleSupported(locale) {
    return Trans.supportedLocales.includes(locale)
  },

  getUserLocale() {
    const locale = window.navigator.language || window.navigator.userLanguage || Trans.defaultLocale

    return {
      locale: locale,
      localeNoRegion: locale.split('-')[0]
    }
  },

  getPersistedLocale() {
    console.log(localeStore.getLocale)
    const persistedLocale = localeStore.getLocale

    if (Trans.isLocaleSupported(persistedLocale)) {
      return persistedLocale
    } else {
      return null
    }
  },

  guessDefaultLocale() {
    const userPersistedLocale = Trans.getPersistedLocale()
    if (userPersistedLocale) {
      return userPersistedLocale
    }

    const userPreferredLocale = Trans.getUserLocale()

    if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale
    }

    if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion
    }

    return Trans.defaultLocale
  },

  async routeMiddleware(to, _from, next) {
    const paramLocale = to.params.locale

    if (!Trans.isLocaleSupported(paramLocale)) {
      return next(Trans.guessDefaultLocale())
    }

    await Trans.switchLanguage(paramLocale)

    return next()
  },

  i18nRoute(to) {
    return {
      ...to,
      params: {
        locale: Trans.currentLocale,
        ...to.params
      }
    }
  }
}

export default Trans
