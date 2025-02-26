/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ChangeEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, ModalFooter } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import { ForkAwesomeIcon } from '../../../../common/fork-awesome/fork-awesome-icon'
import { CommonModal } from '../../../../common/modals/common-modal'
import type { TableSize } from './table-size-picker-popover'
import { cypressId } from '../../../../../utils/cypress-attribute'

export interface CustomTableSizeModalProps {
  showModal: boolean
  onDismiss: () => void
  onSizeSelect: (row: number, cols: number) => void
}

const initialTableSize: TableSize = {
  rows: 0,
  columns: 0
}

/**
 * A modal that lets the user select a custom table size.
 *
 * @param showModal defines if the modal should be visible or not
 * @param onDismiss is called if the modal should be hidden without a selection
 * @param onSizeSelect is called if the user entered and confirmed a custom table size
 */
export const CustomTableSizeModal: React.FC<CustomTableSizeModalProps> = ({ showModal, onDismiss, onSizeSelect }) => {
  const { t } = useTranslation()
  const [tableSize, setTableSize] = useState<TableSize>(() => initialTableSize)

  useEffect(() => {
    if (showModal) {
      setTableSize(initialTableSize)
    }
  }, [showModal])

  const onClick = useCallback(() => {
    onSizeSelect(tableSize.rows, tableSize.columns)
    onDismiss()
  }, [onDismiss, tableSize, onSizeSelect])

  const onColChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.currentTarget.value)
    setTableSize((old) => ({
      rows: old.rows,
      columns: isNaN(value) ? 0 : value
    }))
  }, [])

  const onRowChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.currentTarget.value)
    setTableSize((old) => ({
      rows: isNaN(value) ? 0 : value,
      columns: old.columns
    }))
  }, [])

  return (
    <CommonModal
      show={showModal}
      onHide={onDismiss}
      title={'editor.editorToolbar.table.customSize'}
      showCloseButton={true}
      titleIcon={'table'}
      {...cypressId('custom-table-size-modal')}>
      <div className={'col-lg-10 d-flex flex-row p-3 align-items-center'}>
        <Form.Control
          type={'number'}
          min={1}
          placeholder={t('editor.editorToolbar.table.cols')}
          isInvalid={tableSize.columns <= 0}
          onChange={onColChange}
        />
        <ForkAwesomeIcon icon='times' className='mx-2' fixedWidth={true} />
        <Form.Control
          type={'number'}
          min={1}
          placeholder={t('editor.editorToolbar.table.rows')}
          isInvalid={tableSize.rows <= 0}
          onChange={onRowChange}
        />
      </div>
      <ModalFooter>
        <Button onClick={onClick} disabled={tableSize.rows <= 0 || tableSize.columns <= 0}>
          <Trans i18nKey={'editor.editorToolbar.table.create'} />
        </Button>
      </ModalFooter>
    </CommonModal>
  )
}
