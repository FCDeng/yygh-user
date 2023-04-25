import { SnackbarProvider } from 'notistack'
import { SnackbarUtilsConfigurator } from './SnackbarUtils'

/**
* 显示的消息条的最大数量，如果超过，会关掉最先打开的然后再显示新的，是一个队列
* 如果只想显示1个，设置为1，3是默认值
*/
const MAX_SNACKBAR = 3
//设置自动隐藏时间，默认值是3秒，也就是3000毫秒
const AUTO_HIDE_DURATION = 3000
//设置消息条位置，默认值为上中
const POSITION = {
    vertical: 'top',
    horizontal: 'center'
}

function NotistackWrapper({children}) {
  return (
    <SnackbarProvider
      maxSnack={MAX_SNACKBAR}
      autoHideDuration={AUTO_HIDE_DURATION}
      anchorOrigin={POSITION}
    >
      <SnackbarUtilsConfigurator />
      {children}
    </SnackbarProvider>
  )
}

export default NotistackWrapper