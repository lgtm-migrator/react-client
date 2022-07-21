/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { SettingLine } from '../utils/setting-line'
import { LigatureSettingButtonGroup } from './ligature-setting-button-group'
import { SmartPasteSettingButtonGroup } from './smart-paste-setting-button-group'

export const EditorSettingsTabContent: React.FC = () => {
  useTranslation()

  return (
    <ListGroup>
      <SettingLine i18nKey={'editor.ligatures'}>
        <LigatureSettingButtonGroup />
      </SettingLine>
      <SettingLine i18nKey={'editor.smartPaste'}>
        <SmartPasteSettingButtonGroup />
      </SettingLine>
    </ListGroup>
  )
}
