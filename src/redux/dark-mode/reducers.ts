/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Reducer } from 'redux'
import type { DarkModeConfig, DarkModeConfigActions } from './types'
import { DarkModeConfigActionType } from './types'

const initialState: DarkModeConfig = {
  forcedToDark: undefined,
  browserIsDark: false
}

export const DarkModeConfigReducer: Reducer<DarkModeConfig, DarkModeConfigActions> = (
  state: DarkModeConfig = initialState,
  action: DarkModeConfigActions
) => {
  switch (action.type) {
    case DarkModeConfigActionType.SET_FORCED_DARK_MODE:
      return {
        ...state,
        forcedToDark: action.forcedToDark
      }
    case DarkModeConfigActionType.SET_DARK_MODE:
      return {
        forcedToDark: action.forcedToDark,
        browserIsDark: action.browserIsDark
      }
    default:
      return state
  }
}
