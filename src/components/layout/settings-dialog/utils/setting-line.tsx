/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { PropsWithChildren } from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { Trans } from 'react-i18next'
import { SmartPasteSettingButtonGroup } from '../editor/smart-paste-setting-button-group'

export interface SettingLineProps {
  i18nKey: string
}

export const SettingLine: React.FC<PropsWithChildren<SettingLineProps>> = ({ i18nKey, children }) => {
  return (
    <ListGroup.Item>
      <Row>
        <Col md={3}>
          <Trans i18nKey={`settings.${i18nKey}.label`} />
        </Col>
        <Col md={9}>{children}</Col>
      </Row>
    </ListGroup.Item>
  )
}
