import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Box, Stack, TextField, } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import cookie from 'js-cookie'
import userInfoApi from '@/api/user/userInfo'
import { useForm, Controller } from 'react-hook-form'
import { message } from '@/components'

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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};


const LoginDialog = ({ open = false, onClose }) => {
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        getValues,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: { phone: '', code: '' },
    })
    const [userInfo, setUserInfo] = useState({
        phone: '',
        code: '',
    });
    const timeRef = useRef(null)
    const [codeText, setCodeText] = useState('发送验证码');
    const [dialogData, setDialogData] = useState(defaultDialogData);
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        return () => {
            reset()
            clearTimeout(timeRef.current)
        }
    }, [])
    // 获取验证码按钮
    const btnClick = (data) => {
        if (!(/^1[34578]\d{9}$/.test(data.phone))) {
            message.error('手机号码不正确')
            return;
        }
        login(data)
    }
    const sendCode = () => {
        if (timeRef.current) {
            clearTimeout(timeRef.current)
        }
        let second = 300;
        let clearSmsTime = setInterval(() => {
            --second;
            setCodeText(`倒计时${second}`)
            if (second < 1) {
                clearInterval(clearSmsTime);
                second = 0;
                setCodeText(`发送验证码`)
            }
        }, 1000);
        timeRef.current = clearSmsTime
    }

    // 登录
    const login = (data) => {
        setUserInfo(pre => ({ ...pre, code: data.code, phone: data.phone }))
        let userInfoObj = { ...userInfo }
        if (data.code == '') {
            message.error('验证码必须输入')
            return;
        }
        if (data.code.length != 6) {
            message.error('验证码格式不正确')
            return;
        }
        userInfoApi.login({ code: data.code, phone: data.phone, openid: '' }).then(response => {
            // 登录成功 设置cookie
            setCookies(response.data.name, response.data.token)
            onClose()
        }).catch(e => {
            console.log(222);
        })
    }
    const setCookies = (name, token) => {
        cookie.set('token', token, { domain: 'localhost' })
        cookie.set('name', name, { domain: 'localhost' })
        window.location.reload()
        navigate('/', { replace: true })
    }
    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}

            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
                    登录/注册
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box width={400} height={200} component="form" className="form-page" onSubmit={handleSubmit(btnClick)}>
                        <Stack>
                            <Stack spacing={1} direction='row' sx={{ display: 'flex', alignItems: 'center', mb: 2 }} >
                                <TextField
                                    error={Boolean(errors.phone)}
                                    type="text"
                                    name="phone"
                                    label={'请输入手机号码'}
                                    fullWidth
                                    {...register('phone')}
                                    helperText={errors.phone ? '请输入手机号码' : ''}
                                />

                                <Button onClick={sendCode} sx={{ width: 180 }} color="primary">{codeText}</Button>
                            </Stack>
                            <TextField
                                error={Boolean(errors.code)}
                                type="text"
                                name="code"
                                label={'请输入验证码'}
                                disabled={codeText == '发送验证码' ? true : false}
                                fullWidth
                                {...register('code')}
                                helperText={errors.code ? '请输入验证码' : ''}
                            />
                            <Button fullWidth sx={{ mt: 2 }} type='submit' variant="contained" color="primary">登录</Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default LoginDialog