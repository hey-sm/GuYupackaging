export enum LayoutEvent {
  CHANGE_SIDER = 'layout.changeSider',
}

export declare type Handler = (e: Event) => void
export declare type Unlisten = () => void

const LayoutHooks = {
  /** 添加layout事件监听 */
  listen(eventName: LayoutEvent, handler: Handler): Unlisten {
    document.addEventListener(eventName, handler, false)
    return () => {
      document.removeEventListener(eventName, handler)
    }
  },
  /**
   * 切换Sider
   * @param v collapsed 状态： true-关闭，false-展开
   */
  changeSider(v: boolean) {
    const e = new CustomEvent<boolean>(LayoutEvent.CHANGE_SIDER, { detail: v, bubbles: false })
    document.dispatchEvent(e)
  },
}

const useLayout = () => {
  return LayoutHooks
}

export default useLayout
