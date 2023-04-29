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
const DoctorOrder = ({ orderId, setShowUserIndex }) => {
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

    return <Stack spacing={4} sx={{ background: 'white', p: 2, boxSizing: 'border-box', width: 990 }}>
        <Stack direction={'row'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 'bold' }}>医嘱详情</Typography>
            <Button variant="contained" onClick={() => navigate('/patient/index?paramValueIndex=1&paramOrderIndex=0', { replace: true })} sx={{ width: 60 }}>返回</Button>
        </Stack>
        <Stack spacing={1} sx={{ pl: 45 }}>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>诊断结果：</Typography><Typography>{orderInfo.diagnosis}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>常规护理：</Typography><Typography>{orderInfo.routine}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>护理级别: </Typography><Typography>{orderInfo.nursingLevel}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>饮食: </Typography><Typography>{orderInfo.diet}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>卧位: </Typography><Typography>{orderInfo.recumbentPosition}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>特殊处理: </Typography><Typography>{orderInfo.specialTreatment}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>药物: </Typography><Typography>{orderInfo.drug}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>备注: </Typography><Typography>{orderInfo.remark}</Typography></Stack>
        </Stack>
    </Stack >
}
export default DoctorOrder