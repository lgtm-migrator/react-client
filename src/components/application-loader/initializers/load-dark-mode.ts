/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { setDarkMode } from '../../../redux/dark-mode/methods'
import { Logger } from '../../../utils/logger'
import { isClientSideRendering } from '../../../utils/is-client-side-rendering'

const logger = new Logger('Dark mode initializer')

/**
 * Loads the saved dark mode setting or tries to derive it from the browser settings.
 * The result is saved in the global application state.
 *
 * @return A promise that resolves as soon as the dark mode has been loaded.
 */
export const loadDarkMode = (): void => {
  const forcedMode = fetchDarkModeFromLocalStorage()
  const browserMode = determineDarkModeBrowserSettings()
  setDarkMode(forcedMode, browserMode)
}

/**
 * Tries to read the saved dark mode settings from the browser local storage.
 *
 * @return {@code true} if the local storage has saved that the user prefers dark mode. {@code false} if the user doesn't or if the value could be read from local storage.
 */
const fetchDarkModeFromLocalStorage = (): boolean | undefined => {
  if (!isClientSideRendering()) {
    return false
  }
  try {
    const colorScheme = window.localStorage.getItem('forcedColorScheme')
    if (colorScheme === 'dark') {
      return true
    } else if (colorScheme === 'light') {
      return false
    } else {
      return undefined
    }
  } catch (error) {
    logger.error('Loading from local storage failed', error)
    return false
  }
}

/**
 * Tries to read the preferred dark mode setting from the browser settings.
 *
 * @return {@code true} if the browser has reported that the user prefers dark mode. {@code false} if the user doesn't or if the browser doesn't support the `prefers-color-scheme` media query.
 */
const determineDarkModeBrowserSettings = (): boolean => {
  if (!isClientSideRendering()) {
    return false
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch (error) {
    logger.error('Can not determine setting from browser', error)
    return false
  }
}
