/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GistMarkdownExtension } from './gist-markdown-extension'
import type { RegexOptions } from '../../../external-types/markdown-it-regex/interface'

const protocolRegex = /(?:http(?:s)?:\/\/)?/
const domainRegex = /(?:gist\.github\.com\/)/
const idRegex = /(\w+\/\w+)/
const tailRegex = /(?:[./?#].*)?/
const gistUrlRegex = new RegExp(`(?:${protocolRegex.source}${domainRegex.source}${idRegex.source}${tailRegex.source})`)
const linkRegex = new RegExp(`^${gistUrlRegex.source}$`, 'i')

/**
 * Replacer for gist links.
 */
export const replaceGistLink: RegexOptions = {
  name: 'gist-link',
  regex: linkRegex,
  replace: (match) => {
    // ESLint wants to collapse this tag, but then the tag won't be valid html anymore.
    // noinspection CheckTagEmptyBody
    return `<${GistMarkdownExtension.tagName} id='${match}'></${GistMarkdownExtension.tagName}>`
  }
}
