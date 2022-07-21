/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { Fragment } from 'react'
import { CommonModal } from '../../common/modals/common-modal'
import { useBooleanState } from '../../../hooks/common/use-boolean-state'
import { Container, Modal, Nav, Tab } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { GlobalSettingsTabContent } from './global/global-settings-tab-content'
import { IconButton } from '../../common/icon-button/icon-button'
import { EditorSettingsTabContent } from './editor/editor-settings-tab-content'

export enum SettingsTab {
  app = 'app'
}

export const SettingsDialog: React.FC = () => {
  const [show, showModal, hideModal] = useBooleanState(false)
  useTranslation()

  return (
    <Fragment>
      <IconButton onClick={showModal} icon={'cog'} className={'p-1 mx-2 '} variant={'outline-dark'} />
      <CommonModal
        show={show}
        modalSize={'lg'}
        onHide={hideModal}
        titleIcon={'cog'}
        title={'settings.title'}
        showCloseButton={true}>
        <Modal.Body>
          <Tab.Container defaultActiveKey={'global'}>
            <Container>
              <Nav variant='pills' className={'flex-row'}>
                <Nav.Item>
                  <Nav.Link eventKey='global' className={'mb-2 mr-2 p-2'}>
                    <Trans i18nKey={'settings.global.label'} />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='editor' className={'mb-2 mr-2 p-2'}>
                    <Trans i18nKey={'settings.editor.label'} />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey={'global'}>
                  <GlobalSettingsTabContent />
                </Tab.Pane>
                <Tab.Pane eventKey={'editor'}>
                  <EditorSettingsTabContent />
                </Tab.Pane>
              </Tab.Content>
            </Container>
          </Tab.Container>
        </Modal.Body>
      </CommonModal>
    </Fragment>
  )
}
