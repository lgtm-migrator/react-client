/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { render } from '@testing-library/react'
import { YouTubeFrame } from './youtube-frame'
import React from 'react'
import * as ClickShieldModule from '../../../components/markdown-renderer/replace-components/click-shield/click-shield'
import type { ClickShieldProps } from '../../../components/markdown-renderer/replace-components/click-shield/click-shield'

jest.mock('../../../components/markdown-renderer/replace-components/click-shield/click-shield')

describe('YoutubeFrame', () => {
  beforeEach(() => {
    jest.spyOn(ClickShieldModule, 'ClickShield').mockImplementation((({ children }) => {
      return <span>This is a click shield for {children}</span>
    }) as React.FC<ClickShieldProps>)
  })

  it('renders a click shield', () => {
    const view = render(<YouTubeFrame id={'valid youtube id'} />)
    expect(view.container).toMatchSnapshot()
  })
})
