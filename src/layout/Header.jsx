

import { Box, Typography, Button, Stack, Avatar } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect, useRef } from 'react'
import cookie from 'js-cookie'
import LoginDialog from '@/components/LoginDialog';
import classes from './Header.scss'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import userInfoApi from '@/api/user/userInfo'
const LogoIcon = require('@/static/images/logo.jpg')
const defaultDialogData = {
    showLoginType: 'phone', // 控制手机登录与微信登录切换
    labelTips: '手机号码', // 输入框提示
    inputValue: '', // 输入框绑定对象
    placeholder: '请输入您的手机号', // 输入框placeholder
    maxlength: 11, // 输入框长度控制
    loginBtn: '获取验证码', // 登录按钮或获取验证码按钮文本
    sending: true,      // 是否可以发送验证码
    second: -1,        // 倒计时间  second>0 : 显示倒计时 second=0 ：重新发送 second=-1 ：什么都不显示
    clearSmsTime: null  // 倒计时定时任务引用 关闭登录层清除定时任务
}
const Header = () => {

    useEffect(() => {
        getUserInfo()
        showInfo()
        return () => {
            clearTimeout(timeRef.current)
        }
    }, [])
    const timeRef = useRef(null)
    const navigate = useNavigate()
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [name, setName] = useState('游客');

    const [authStatus, setAuthStatus] = useState(2);
    const [timer, setTimer] = useState(null);
    const [dialogData, setDialogData] = useState({});
    const open = Boolean(anchorEl);
    const getUserInfo = () => {
        userInfoApi.getUserInfo().then(response => {
            setAuthStatus(response.data.authStatus)
        })
    }
    const userHandleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const goCertification = () => {
        navigate('patient/index?paramValueIndex=0', { replace: true })
    }
    // const goOrder = () => {
    //     navigate('./patient/index', {state: { patientIndex: 1 }}) 
    // }
    // const goPatient = () => {
    //     navigate('./patient/index', {state: { patientIndex: 2 }})
    // }
    const logoutHandle = () => {
        cookie.set('token', '')
        cookie.set('name', '')
        navigate('./home')
        window.location.reload()
    }

    const showInfo = () => {
        let token = cookie.get('token')
        if (token) {
            setName(cookie.get('name'))
        }
    }

    // 绑定登录或获取验证码按钮
    const btnClick = () => {
        login()
        // 判断是获取验证码还是登录
        if (dialogData.loginBtn == '获取验证码') {
            userInfo.phone = dialogData.inputValue
            // 获取验证码
            getCodeFun()
        } else {
            // 登录
            login()
        }
    }
    // 绑定登录，点击显示登录层
    const showLogin = () => {
        dialogUserFormVisible = true
        // 初始化登录层相关参数
        dialogData = { ...defaultDialogData }
    }

    // 获取验证码
    const getCodeFun = () => {
        if (!(/^1[34578]\d{9}$/.test(userInfo.phone))) {
            $message.error('手机号码不正确')
            return;
        }
        // 初始化验证码相关属性
        dialogData.inputValue = ''
        dialogData.placeholder = '请输入验证码'
        dialogData.maxlength = 6
        dialogData.loginBtn = '马上登录'

        // 控制重复发送
        if (!dialogData.sending) return;

        // 发送短信验证码
        // timeDown();
        // dialogData.sending = false;
        // smsApi.sendCode(userInfo.phone).then(response => {
        //   timeDown();
        // }).catch(e => {
        //   $message.error('发送失败，重新发送')
        //   // 发送失败，回到重新获取验证码界面
        //   showLogin()
        // })
    }
    // 倒计时
    const timeDown = () => {
        if (timeRef.current) {
            clearTimeout(timeRef.current)
        }
        dialogData.second = 60;

        dialogData.labelTips = '验证码已发送至' + userInfo.phone
        let clearSmsTime = setInterval(() => {
            --dialogData.second;
            if (dialogData.second < 1) {
                clearInterval(clearSmsTime);
                dialogData.sending = true;
                dialogData.second = 0;
            }
        }, 1000);
        timeRef.current = clearSmsTime
    }
    // 关闭登录层
    const closeDialog = () => {
        if (timeRef.current) {
            clearTimeout(timeRef.current)
        }
    }
    const loginMenu = (command) => {
        if ('/logout' == command) {
            cookie.set('name', '', { domain: 'localhost' })
            cookie.set('token', '', { domain: 'localhost' })
            //跳转页面
            window.location.href = '/'
        } else {
            window.location.href = command
        }
    }
    const handleSelect = (item) => {
        window.location.href = '/hospital/' + item.hoscode
    }
    const phoneLogin = () => {
        dialogData.showLoginType = 'phone'
        showLogin()
    }
    const goCode = () => {
        if (authStatus != 2) return
        navigate('patient/index?paramValueIndex=1', { replace: true })
    }
    const goPatient = () => {
        if (authStatus != 2) return
        navigate('patient/index?paramValueIndex=2', { replace: true })
    }


    return <Box className={classes.use} >
        <Stack className={classes.header} sx={{ bg: 'white', width: '100%', height: 50, alignItems: 'center', justifyContent: 'space-between' }} direction="row" spacing={2}>
            <Stack height='100%' direction="row" spacing={2} alignItems={'center'}>
                <Box className={classes.logoBox}>
                    <img className={classes.LogoIcon} src={LogoIcon} />
                </Box>
                <Typography sx={{ cursor: 'pointer' }} onClick={() => { navigate('home') }}>用户预约挂号平台</Typography>
            </Stack>
            <Stack direction="row">
                <Button sx={{ color: '#333' }} onClick={userHandleClick} endIcon={<ArrowDropDownIcon />}>{name}</Button>
                {name == '游客' ? <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={() => setOpenLoginDialog(true)}
                    sx={{ color: '#333', fontWeight: 'bold' }}
                >登录/注册</Button> : null}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={goCertification}>实名认证</MenuItem>
                    <MenuItem onClick={goCode}>挂号订单</MenuItem>
                    <MenuItem onClick={goPatient}>患者管理</MenuItem>
                    <MenuItem onClick={logoutHandle}>退出登录</MenuItem>
                </Menu>
            </Stack>
        </Stack>
        <LoginDialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)} />
    </Box>
}



export default Header