import { Box, Stack, Typography, Avatar, Button, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import classes from './index.scss'
import cookie from 'js-cookie'
import LoginDialog from '@/components/LoginDialog';
import LabelIcon from '@mui/icons-material/Label';
import hospitalApi from '@/api/hosp/hospital'
import userInfoApi from '@/api/user/userInfo'
import orderInfoApi from '@/api/order/orderInfo'
import Radio from '@mui/material/Radio';
import dictApi from '@/api/cmn/dict'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { message, DialogView } from '@/components'
import Checkbox from '@mui/material/Checkbox';
import weixinApi from '@/api/order/weixin'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import patientApi from '@/api/user/patient'
import { useForm, Controller } from 'react-hook-form'
const OrderShow = ({ orderId, setShowUserIndex }) => {
    const [patient, setPatient] = useState({ param: {} })
    const [orderInfo, setOrderInfo] = useState({ param: {} })
    const timerRef = useRef(null)
    const [dialogPayVisible, setDialogPayVisible] = useState(false);
    const [payObj, setPayObj] = useState({});
    const navigate = useNavigate()
    useEffect(() => {
        init()
        return () => timerRef.current = null
    }, [])

    const init = () => {
        orderInfoApi.getOrders(orderId).then(response => {
            setOrderInfo(response.data)
        })
    }

    // 生成微信二维码
    const pay = () => {
        setDialogPayVisible(true)
        weixinApi.createNative(orderId).then(response => {
            setPayObj(response.data)
            if (payObj.codeUrl == '') {
                setDialogPayVisible(false)
                message.error("支付错误")
            } else {
                timerRef = setInterval(() => {
                    queryPayStatus(orderId)
                }, 3000);
            }
        })
    }
    // 每隔3秒调用查询订单状态
    const queryPayStatus = (orderId) => {
        weixinApi.queryPayStatus(orderId).then(response => {
            if (response.message == '支付中') {
                return
            }
            timerRef.current = null
            window.location.reload()
        })
    }
    // 关闭微信二维码窗口
    const closeDialog = () => {
        timerRef.current = null
    }

    return <Stack spacing={4} sx={{ background: 'white', p: 2, boxSizing: 'border-box', width: 990 }}>
        <Stack direction={'row'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 'bold' }}>订单详情</Typography>
            <Button variant="contained" onClick={() => navigate('/patient/index?paramValueIndex=1&paramOrderIndex=0', { replace: true })} sx={{ width: 60 }}>返回</Button>

        </Stack>
        <Typography sx={{ fontWeight: 'bold' }}>{`订单状态：${orderInfo.param.orderStatusString}`}</Typography>
        <Typography sx={{ pt: 0.2, pb: 0.2 }}>挂号信息</Typography>

        <Stack spacing={1} sx={{ pl: 50 }}>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>患者信息：</Typography><Typography>{orderInfo.patientName}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>就诊日期：</Typography><Typography>{orderInfo.reserveDate}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>就诊医院：</Typography><Typography>{orderInfo.hosname}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>就诊科室：</Typography><Typography>{orderInfo.depname}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>医生职称：</Typography><Typography>{orderInfo.title}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>医事服务费：</Typography><Typography>{orderInfo.amount}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>挂号单号：</Typography><Typography>{orderInfo.outTradeNo}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>挂号时间：</Typography><Typography>{orderInfo.createTime}</Typography></Stack>
        </Stack>
        <Stack direction={'row'} justifyContent='center' alignItems={'center'} spacing={2} sx={{ pl: 5, pt: 1 }}>
            {/* <Button onClick={remove} variant='contained'>删除</Button> */}
            {orderInfo.orderStatus == 0 ? <Button onClick={() => pay()} variant='contained'>支付</Button> : null}
        </Stack>
        <DialogView open={dialogPayVisible} handleClose={closeDialog} title={'微信支付'} >
            {payObj.codeUrl ? <Box width={260} height={240} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <QRCode
                    id="qrCode"
                    value={payObj.codeUrl || 'payObj.codeUrl'}
                    size={180} // 二维码的大小
                    fgColor="#000000" // 二维码的颜色
                    style={{ margin: 'auto' }}
                />
                <Typography>  请使用微信扫一扫  </Typography>
                <Typography>   扫描二维码支付  </Typography>
            </Box>
                : <Typography>  支付错误  </Typography>}
        </DialogView>
    </Stack >
}
export default OrderShow