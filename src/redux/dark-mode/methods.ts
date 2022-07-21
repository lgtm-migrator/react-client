/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { store } from '..'
import type { SetDarkModeConfigAction, SetForcedDarkModeConfigAction } from './types'
import { DarkModeConfigActionType } from './types'

export const setDarkMode = (forced: boolean | undefined, browser: boolean): void => {
  store.dispatch({
    type: DarkModeConfigActionType.SET_DARK_MODE,
    forcedToDark: forced,
    browserIsDark: browser
  } as SetDarkModeConfigAction)
}

export const setForcedDarkMode = (forced: boolean | undefined): void => {
  store.dispatch({
    type: DarkModeConfigActionType.SET_FORCED_DARK_MODE,
    forcedToDark: forced
  } as SetForcedDarkModeConfigAction)
}
