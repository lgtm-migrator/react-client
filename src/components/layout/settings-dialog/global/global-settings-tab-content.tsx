/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react'
import { DarkModeSettingButtonGroup } from './dark-mode-setting-button-group'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { LanguagePicker } from './language-picker'
import { SettingLine } from '../utils/setting-line'

export const GlobalSettingsTabContent: React.FC = () => {
  useTranslation()

  return (
    <ListGroup>
      <SettingLine i18nKey={'global.darkMode'}>
        <DarkModeSettingButtonGroup />
      </SettingLine>
      <SettingLine i18nKey={'global.language'}>
        <LanguagePicker />
      </SettingLine>
    </ListGroup>
  )
}
