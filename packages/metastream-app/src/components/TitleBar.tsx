import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import cx from 'classnames'

import { PRODUCT_NAME } from 'constants/app'

import { IAppState } from 'reducers'
import { isUpdateAvailable } from 'reducers/ui'

import styles from './TitleBar.css'
import { IconButton } from 'components/common/button'
import { Icon } from './Icon'
import { IReactReduxProps } from 'types/redux-thunk'
import { updateService } from 'services/updater'

interface IProps {
  className?: string
  title?: string
}

interface IConnectedProps {
  updateAvailable?: boolean
  showBackButton: boolean
}

type PrivateProps = IProps & IConnectedProps & IReactReduxProps

class _TitleBar extends Component<PrivateProps> {
  render(): JSX.Element | null {
    const updateButton = this.props.updateAvailable && (
      <IconButton icon="download" className={styles.updateButton} onClick={updateService.update}>
        Update
      </IconButton>
    )

    return (
      <div className={cx(this.props.className, styles.container)}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <h2 className={styles.title}>{this.props.title || PRODUCT_NAME}</h2>
            <div className={styles.drag} />
          </header>
          {updateButton}
          {this.props.showBackButton && this.renderBack()}
          {this.renderFrameButtons()}
        </div>
      </div>
    )
  }

  private renderFrameButtons() {
    const isFullscreen = !!document.fullscreenElement

    return (
      <div className={styles.rightActions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => {
            if (isFullscreen) {
              try {
                document.exitFullscreen()
              } catch {}
            } else {
              document.documentElement.requestFullscreen()
            }
            setTimeout(() => this.forceUpdate(), 100)
          }}
        >
          <Icon name={isFullscreen ? 'minimize-2' : 'maximize-2'} />
        </button>
      </div>
    )
  }

  private renderBack() {
    return (
      <div className={styles.leftActions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => this.props.dispatch!(push('/'))}
        >
          <Icon name="arrow-left" />
        </button>
      </div>
    )
  }
}

export const TitleBar = connect(
  (state: IAppState): IConnectedProps => {
    const { location } = state.router
    return {
      updateAvailable: isUpdateAvailable(state),
      showBackButton: location ? location.pathname !== '/' : true
    }
  }
)(_TitleBar) as React.ComponentClass<IProps>
