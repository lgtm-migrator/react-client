/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from 'react'
import { useApplicationState } from './use-application-state'
import { isClientSideRendering } from '../../utils/is-client-side-rendering'
import { Logger } from '../../utils/logger'

const logger = new Logger('useApplyDarkMode')

export const useApplyDarkMode = (): void => {
  const { forcedToDark, browserIsDark } = useApplicationState((state) => state.darkMode)

  useEffect(() => saveToLocalStorage(forcedToDark), [forcedToDark])
  useEffect(() => {
    if (forcedToDark ?? browserIsDark) {
      window.document.body.classList.add('dark')
    } else {
      window.document.body.classList.remove('dark')
    }
  }, [browserIsDark, forcedToDark])

  useEffect(() => () => window.document.body.classList.remove('dark'), [])
}

export const saveToLocalStorage = (active: boolean | undefined): void => {
  if (!isClientSideRendering()) {
    return
  }
  try {
    if (active === undefined) {
      window.localStorage.removeItem('forcedDarkMode')
    } else {
      window.localStorage.setItem('forcedDarkMode', String(active))
    }
  } catch (error) {
    logger.error('Saving to local storage failed', error)
  }
}
