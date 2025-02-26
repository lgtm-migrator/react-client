/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isTestMode } from '../../../utils/test-modes'
import type { RendererProps } from '../../render-page/markdown-document'
import type {
  ExtensionEvent,
  OnFirstHeadingChangeMessage,
  OnHeightChangeMessage,
  RendererType,
  SetScrollStateMessage
} from '../../render-page/window-post-message-communicator/rendering-message'
import { CommunicationMessageType } from '../../render-page/window-post-message-communicator/rendering-message'
import { useEditorToRendererCommunicator } from '../render-context/editor-to-renderer-communicator-context-provider'
import { useForceRenderPageUrlOnIframeLoadCallback } from './hooks/use-force-render-page-url-on-iframe-load-callback'
import { useEditorReceiveHandler } from '../../render-page/window-post-message-communicator/hooks/use-editor-receive-handler'
import { useSendDarkModeStatusToRenderer } from './hooks/use-send-dark-mode-status-to-renderer'
import { useSendMarkdownToRenderer } from './hooks/use-send-markdown-to-renderer'
import { useSendScrollState } from './hooks/use-send-scroll-state'
import { Logger } from '../../../utils/logger'
import { useEffectOnRenderTypeChange } from './hooks/use-effect-on-render-type-change'
import { cypressAttribute, cypressId } from '../../../utils/cypress-attribute'
import { ORIGIN, useBaseUrl } from '../../../hooks/common/use-base-url'
import { ShowIf } from '../../common/show-if/show-if'
import { WaitSpinner } from '../../common/wait-spinner/wait-spinner'
import { useExtensionEventEmitter } from '../../markdown-renderer/hooks/use-extension-event-emitter'

export interface RenderIframeProps extends RendererProps {
  rendererType: RendererType
  forcedDarkMode?: boolean
  frameClasses?: string
  onRendererStatusChange?: undefined | ((rendererReady: boolean) => void)
  adaptFrameHeightToContent?: boolean
}

const log = new Logger('RenderIframe')

/**
 * Renders the iframe for the HTML-rendering of the markdown content.
 * The iframe is enhanced by the {@link useEditorToRendererCommunicator iframe communicator} which is used for
 * passing data from the parent frame into the iframe as well as receiving status messages and data from the iframe.
 *
 * @param markdownContentLines Array of lines of the markdown content
 * @param onTaskCheckedChange Callback that is fired when a task-list item in the iframe is checked
 * @param scrollState The current {@link ScrollState}
 * @param onFirstHeadingChange Callback that is fired when the first heading of the note changes
 * @param onScroll Callback that is fired when the user scrolls in the iframe
 * @param onMakeScrollSource Callback that is fired when the renderer requests to be set as the current scroll source
 * @param frameClasses CSS classes that should be applied to the iframe
 * @param rendererType The {@link RendererType type} of the renderer to use.
 * @param forcedDarkMode If set, the dark mode will be set to the given value. Otherwise, the dark mode won't be changed.
 * @param adaptFrameHeightToContent If set, the iframe height will be adjusted to the content height
 * @param onRendererStatusChange Callback that is fired when the renderer in the iframe is ready
 */
export const RenderIframe: React.FC<RenderIframeProps> = ({
  markdownContentLines,
  scrollState,
  onFirstHeadingChange,
  onScroll,
  onMakeScrollSource,
  frameClasses,
  rendererType,
  forcedDarkMode,
  adaptFrameHeightToContent,
  onRendererStatusChange
}) => {
  const [rendererReady, setRendererReady] = useState<boolean>(false)
  const frameReference = useRef<HTMLIFrameElement>(null)
  const rendererBaseUrl = useBaseUrl(ORIGIN.RENDERER)
  const iframeCommunicator = useEditorToRendererCommunicator()
  const resetRendererReady = useCallback(() => {
    log.debug('Reset render status')
    setRendererReady(false)
  }, [])
  const onIframeLoad = useForceRenderPageUrlOnIframeLoadCallback(frameReference, resetRendererReady)
  const [frameHeight, setFrameHeight] = useState<number>(0)

  useEffect(() => {
    onRendererStatusChange?.(rendererReady)
  }, [onRendererStatusChange, rendererReady])

  useEffect(() => () => setRendererReady(false), [iframeCommunicator])

  useEffect(() => {
    if (!rendererReady) {
      iframeCommunicator.unsetMessageTarget()
    }
  }, [iframeCommunicator, rendererReady])

  useEffect(() => {
    onRendererStatusChange?.(rendererReady)
  }, [onRendererStatusChange, rendererReady])

  useEditorReceiveHandler(
    CommunicationMessageType.ON_FIRST_HEADING_CHANGE,
    useCallback(
      (values: OnFirstHeadingChangeMessage) => onFirstHeadingChange?.(values.firstHeading),
      [onFirstHeadingChange]
    )
  )

  useEditorReceiveHandler(
    CommunicationMessageType.ENABLE_RENDERER_SCROLL_SOURCE,
    useCallback(() => onMakeScrollSource?.(), [onMakeScrollSource])
  )

  const eventEmitter = useExtensionEventEmitter()

  useEditorReceiveHandler(
    CommunicationMessageType.EXTENSION_EVENT,
    useMemo(() => {
      return eventEmitter === undefined
        ? undefined
        : (values: ExtensionEvent) => eventEmitter.emit(values.eventName, values.payload)
    }, [eventEmitter])
  )

  useEditorReceiveHandler(
    CommunicationMessageType.ON_HEIGHT_CHANGE,
    useCallback(
      (values: OnHeightChangeMessage) => {
        if (adaptFrameHeightToContent) {
          setFrameHeight?.(values.height)
        }
      },
      [adaptFrameHeightToContent]
    )
  )

  useEditorReceiveHandler(
    CommunicationMessageType.RENDERER_READY,
    useCallback(() => {
      const frame = frameReference.current
      if (!frame) {
        log.error('Load triggered without frame in ref')
        return
      }
      const otherWindow = frame.contentWindow
      if (!otherWindow) {
        log.error('Load triggered without content window')
        return
      }
      const origin = new URL(rendererBaseUrl).origin
      log.debug(`Set iframecommunicator window with origin ${origin ?? 'undefined'}`)
      iframeCommunicator.setMessageTarget(otherWindow, origin)
      iframeCommunicator.enableCommunication()
      iframeCommunicator.sendMessageToOtherSide({
        type: CommunicationMessageType.SET_BASE_CONFIGURATION,
        baseConfiguration: {
          baseUrl: window.location.toString(),
          rendererType
        }
      })
      setRendererReady(true)
    }, [iframeCommunicator, rendererBaseUrl, rendererType])
  )

  useEffectOnRenderTypeChange(rendererType, onIframeLoad)
  useSendDarkModeStatusToRenderer(forcedDarkMode, rendererReady)
  useSendMarkdownToRenderer(markdownContentLines, rendererReady)

  useSendScrollState(scrollState)

  useEditorReceiveHandler(
    CommunicationMessageType.SET_SCROLL_STATE,
    useCallback((values: SetScrollStateMessage) => onScroll?.(values.scrollState), [onScroll])
  )

  return (
    <Fragment>
      <ShowIf condition={!rendererReady}>
        <WaitSpinner />
      </ShowIf>
      <iframe
        style={{ height: `${frameHeight}px` }}
        {...cypressId('documentIframe')}
        onLoad={onIframeLoad}
        title='render'
        {...(isTestMode ? {} : { sandbox: 'allow-downloads allow-same-origin allow-scripts allow-popups' })}
        allowFullScreen={true}
        ref={frameReference}
        referrerPolicy={'no-referrer'}
        className={`border-0 ${frameClasses ?? ''}`}
        allow={'clipboard-write'}
        {...cypressAttribute('renderer-ready', rendererReady ? 'true' : 'false')}
        {...cypressAttribute('renderer-type', rendererType)}
      />
    </Fragment>
  )
}
