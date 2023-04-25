import { useSnackbar } from 'notistack'
import React from 'react'

const InnerSnackbarUtilsConfigurator = (props) => {
  props.setUseSnackbarRef(useSnackbar())
  return null
}

let useSnackbarRef
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
}

export const NotiStackHepler = {
  success(msg) {
    return this.toast(msg, 'success')
  },
  warning(msg) {
    return this.toast(msg, 'warning')
  },
  info(msg) {
    return this.toast(msg, 'info')
  },
  error(msg) {
    return this.toast(msg, 'error')
  },
  toast(msg, variant = 'default') {
    return useSnackbarRef.enqueueSnackbar(msg, { variant })
  },
  close(key) {
    key ? useSnackbarRef.closeSnackbar(key) : useSnackbarRef.closeSnackbar()
  },
}
