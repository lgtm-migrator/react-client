/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react'
import { OnOffButtonGroup } from '../utils/on-off-button-group'
import { useApplicationState } from '../../../../hooks/common/use-application-state'
import { setEditorSmartPaste } from '../../../../redux/editor/methods'

export const SmartPasteSettingButtonGroup: React.FC = () => {
  const enabled = useApplicationState((state) => state.editorConfig.smartPaste)
  return <OnOffButtonGroup value={enabled} onSelect={setEditorSmartPaste} />
}
