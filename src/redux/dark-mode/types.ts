/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Action } from 'redux'

export enum DarkModeConfigActionType {
  SET_DARK_MODE = 'dark-mode/set',
  SET_FORCED_DARK_MODE = 'dark-mode/set-forced'
}

export interface ForcedDarkModeConfig {
  forcedToDark?: boolean
}

export interface DarkModeConfig extends ForcedDarkModeConfig{
  browserIsDark: boolean
}

export type DarkModeConfigActions = SetDarkModeConfigAction | SetForcedDarkModeConfigAction

export type SetDarkModeConfigAction = Action<DarkModeConfigActionType.SET_DARK_MODE> & DarkModeConfig
export type SetForcedDarkModeConfigAction = Action<DarkModeConfigActionType.SET_FORCED_DARK_MODE> & ForcedDarkModeConfig
