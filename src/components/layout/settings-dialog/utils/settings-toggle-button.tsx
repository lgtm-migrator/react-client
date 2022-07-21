/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo } from 'react'
import { ToggleButton } from 'react-bootstrap'
import { Trans, useTranslation } from 'react-i18next'
import type { ToggleButtonProps } from 'react-bootstrap/ToggleButton'

interface DarkModeToggleButtonProps extends Omit<ToggleButtonProps, 'onSelect'> {
  i18nKey: string
  onSelect: (value: number | string) => void
  value: number | string
}

export const SettingsToggleButton: React.FC<DarkModeToggleButtonProps> = ({ i18nKey, onSelect, ...props }) => {
  const { t } = useTranslation()

  const title = useMemo(() => t(`settings.${i18nKey}.tooltip`), [i18nKey, t])

  const onChange = useCallback(() => {
    onSelect(props.value)
  }, [onSelect, props.value])

  return (
    <ToggleButton {...props} variant='outline-secondary' title={title} onChange={onChange}>
      <Trans i18nKey={`settings.${i18nKey}.label`} />
    </ToggleButton>
  )
}
