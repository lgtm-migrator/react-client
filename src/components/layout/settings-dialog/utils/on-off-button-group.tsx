/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo } from 'react'
import { ToggleButtonGroup } from 'react-bootstrap'
import { SettingsToggleButton } from './settings-toggle-button'
import { DarkModeState } from '../global/dark-mode-setting-button-group'

enum OnOffState {
  ON,
  OFF
}

export interface OnOffButtonGroupProps {
  value: boolean
  onSelect: (value: boolean) => void
}

export const OnOffButtonGroup: React.FC<OnOffButtonGroupProps> = ({ onSelect, value }) => {
  const buttonGroupValue = useMemo(() => (value ? OnOffState.ON : OnOffState.OFF), [value])
  const onButtonSelect = useCallback(
    (value: number | string) => {
      onSelect(value === OnOffState.ON)
    },
    [onSelect]
  )

  return (
    <ToggleButtonGroup type='radio' name='dark-mode' value={buttonGroupValue}>
      <SettingsToggleButton onSelect={onButtonSelect} value={OnOffState.ON} i18nKey={'util.onoff.on'} />
      <SettingsToggleButton onSelect={onButtonSelect} value={OnOffState.OFF} i18nKey={'util.onoff.off'} />
    </ToggleButtonGroup>
  )
}
