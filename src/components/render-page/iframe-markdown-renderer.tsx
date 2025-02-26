/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ScrollState } from '../editor-page/synced-scroll/scroll-props'
import type { BaseConfiguration } from './window-post-message-communicator/rendering-message'
import { CommunicationMessageType, RendererType } from './window-post-message-communicator/rendering-message'
import { setDarkMode } from '../../redux/dark-mode/methods'
import { MarkdownDocument } from './markdown-document'
import { countWords } from './word-counter'
import { useRendererToEditorCommunicator } from '../editor-page/render-context/renderer-to-editor-communicator-context-provider'
import { useRendererReceiveHandler } from './window-post-message-communicator/hooks/use-renderer-receive-handler'
import { SlideshowMarkdownRenderer } from '../markdown-renderer/slideshow-markdown-renderer'
import type { SlideOptions } from '../../redux/note-details/types/slide-show-options'
import EventEmitter2 from 'eventemitter2'
import { eventEmitterContext } from '../markdown-renderer/hooks/use-extension-event-emitter'

/**
 * Wraps the markdown rendering in an iframe.
 */
export const IframeMarkdownRenderer: React.FC = () => {
  const [markdownContentLines, setMarkdownContentLines] = useState<string[]>([])
  const [scrollState, setScrollState] = useState<ScrollState>({ firstLineInView: 1, scrolledPercentage: 0 })
  const [baseConfiguration, setBaseConfiguration] = useState<BaseConfiguration | undefined>(undefined)
  const [slideOptions, setSlideOptions] = useState<SlideOptions>()

  const communicator = useRendererToEditorCommunicator()

  const sendScrolling = useRef<boolean>(false)

  useRendererReceiveHandler(
    CommunicationMessageType.SET_SLIDE_OPTIONS,
    useCallback((values) => setSlideOptions(values.slideOptions), [])
  )

  useRendererReceiveHandler(
    CommunicationMessageType.DISABLE_RENDERER_SCROLL_SOURCE,
    useCallback(() => {
      sendScrolling.current = false
    }, [])
  )

  useRendererReceiveHandler(
    CommunicationMessageType.SET_BASE_CONFIGURATION,
    useCallback((values) => setBaseConfiguration(values.baseConfiguration), [])
  )

  useRendererReceiveHandler(
    CommunicationMessageType.SET_MARKDOWN_CONTENT,
    useCallback((values) => setMarkdownContentLines(values.content), [])
  )

  useRendererReceiveHandler(
    CommunicationMessageType.SET_DARKMODE,
    useCallback((values) => setDarkMode(values.activated), [])
  )

  useRendererReceiveHandler(
    CommunicationMessageType.SET_SCROLL_STATE,
    useCallback((values) => setScrollState(values.scrollState), [])
  )

  useRendererReceiveHandler(
    CommunicationMessageType.GET_WORD_COUNT,
    useCallback(() => {
      const documentContainer = document.querySelector('[data-word-count-target]')
      communicator.sendMessageToOtherSide({
        type: CommunicationMessageType.ON_WORD_COUNT_CALCULATED,
        words: documentContainer ? countWords(documentContainer) : 0
      })
    }, [communicator])
  )

  const onFirstHeadingChange = useCallback(
    (firstHeading?: string) => {
      communicator.sendMessageToOtherSide({
        type: CommunicationMessageType.ON_FIRST_HEADING_CHANGE,
        firstHeading
      })
    },
    [communicator]
  )

  const onMakeScrollSource = useCallback(() => {
    sendScrolling.current = true
    communicator.sendMessageToOtherSide({
      type: CommunicationMessageType.ENABLE_RENDERER_SCROLL_SOURCE
    })
  }, [communicator])

  const onScroll = useCallback(
    (scrollState: ScrollState) => {
      if (!sendScrolling.current) {
        return
      }
      communicator.sendMessageToOtherSide({
        type: CommunicationMessageType.SET_SCROLL_STATE,
        scrollState
      })
    },
    [communicator]
  )

  const onHeightChange = useCallback(
    (height: number) => {
      communicator.sendMessageToOtherSide({
        type: CommunicationMessageType.ON_HEIGHT_CHANGE,
        height
      })
    },
    [communicator]
  )

  const renderer = useMemo(() => {
    if (!baseConfiguration) {
      return (
        <span>
          This is the render endpoint. If you can read this text then please check your HedgeDoc configuration.
        </span>
      )
    }

    switch (baseConfiguration.rendererType) {
      case RendererType.DOCUMENT:
        return (
          <MarkdownDocument
            additionalOuterContainerClasses={'vh-100 bg-light'}
            markdownContentLines={markdownContentLines}
            onFirstHeadingChange={onFirstHeadingChange}
            onMakeScrollSource={onMakeScrollSource}
            scrollState={scrollState}
            onScroll={onScroll}
            baseUrl={baseConfiguration.baseUrl}
            onHeightChange={onHeightChange}
          />
        )
      case RendererType.SLIDESHOW:
        return (
          <SlideshowMarkdownRenderer
            markdownContentLines={markdownContentLines}
            baseUrl={baseConfiguration.baseUrl}
            onFirstHeadingChange={onFirstHeadingChange}
            scrollState={scrollState}
            slideOptions={slideOptions}
          />
        )
      case RendererType.MOTD:
      case RendererType.INTRO:
        return (
          <MarkdownDocument
            additionalOuterContainerClasses={'vh-100 bg-light overflow-y-hidden'}
            markdownContentLines={markdownContentLines}
            baseUrl={baseConfiguration.baseUrl}
            disableToc={true}
            onHeightChange={onHeightChange}
          />
        )
      default:
        return null
    }
  }, [
    baseConfiguration,
    markdownContentLines,
    onFirstHeadingChange,
    onHeightChange,
    onMakeScrollSource,
    onScroll,
    scrollState,
    slideOptions
  ])

  const extensionEventEmitter = useMemo(() => new EventEmitter2({ wildcard: true }), [])

  useEffect(() => {
    extensionEventEmitter.onAny((event, values) => {
      communicator.sendMessageToOtherSide({
        type: CommunicationMessageType.EXTENSION_EVENT,
        eventName: typeof event === 'object' ? event.join('.') : event,
        payload: values
      })
    })
  }, [communicator, extensionEventEmitter])

  return <eventEmitterContext.Provider value={extensionEventEmitter}>{renderer}</eventEmitterContext.Provider>
}
