/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback } from 'react'
import { ToggleButtonGroup } from 'react-bootstrap'
import { useApplicationState } from '../../../../hooks/common/use-application-state'
import { setForcedDarkMode } from '../../../../redux/dark-mode/methods'
import { SettingsToggleButton } from '../utils/settings-toggle-button'

export enum DarkModeState {
  DARK,
  LIGHT,
  BROWSER
}

const DarkModeSettingButtonGroup: React.FC = () => {
  const darkModeState = useApplicationState((state) => {
    if (state.darkMode.forcedToDark === undefined) {
      return DarkModeState.BROWSER
    } else if (state.darkMode.forcedToDark) {
      return DarkModeState.DARK
    } else {
      return DarkModeState.LIGHT
    }
  })

  const onSelect = useCallback((value: number | string) => {
    switch (value) {
      case DarkModeState.DARK:
        setForcedDarkMode(true)
        break
      case DarkModeState.LIGHT:
        setForcedDarkMode(false)
        break
      case DarkModeState.BROWSER:
        setForcedDarkMode(undefined)
        break
    }
  }, [])

  return (
    <ToggleButtonGroup type='radio' name='dark-mode' value={darkModeState}>
      <SettingsToggleButton onSelect={onSelect} value={DarkModeState.DARK} i18nKey={'global.darkMode.dark'} />
      <SettingsToggleButton onSelect={onSelect} value={DarkModeState.LIGHT} i18nKey={'global.darkMode.light'} />
      <SettingsToggleButton onSelect={onSelect} value={DarkModeState.BROWSER} i18nKey={'global.darkMode.browser'} />
    </ToggleButtonGroup>
  )
}

export { DarkModeSettingButtonGroup }
