import { Box, Stack, Typography, Avatar, Button, colors } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import classes from './Registration.scss'
import cookie from 'js-cookie'
import LoginDialog from '@/components/LoginDialog';
import LabelIcon from '@mui/icons-material/Label';
import hospitalApi from '@/api/hosp/hospital'
import userInfoApi from '@/api/user/userInfo'
import Radio from '@mui/material/Radio';
import patientApi from '@/api/user/patient'
import orderInfoApi from '@/api/order/orderInfo'
import { SET_PatientStateValue, SET_PatientStateIndex, SET_UserStateValue, SET_Code } from '@/store/user'
import { message } from '@/components'
import { useDispatch, useSelector } from "react-redux";
import Checkbox from '@mui/material/Checkbox';
import { useNavigate, useLocation, useParams } from 'react-router-dom'
const HospitalLogo = require('@/static/images/hospitalLogo.png')
const Registration = ({ scheduleId, setShowHospIndex, hoscode }) => {
    const [hospital, setHospital] = useState({ param: {} })
    const [bookingRule, setBookingRule] = useState({})
    const [schedule, setSchedule] = useState({ param: {} })
    const [patientList, setPatientList] = useState([])
    const [patient, setPatient] = useState({})
    const [patientId, setPatientId] = useState({})
    const [actIndex, setActIndex] = useState(0)
    const [submitBnt, setSubmitBnt] = useState('确认挂号')
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state) => {
        return state.user
    })
    useEffect(() => {
        init()
    }, [])

    const init = () => {
        getSchedule()
        findPatientList()
    }
    // 根据id获取排班信息
    const getSchedule = () => {
        hospitalApi.getSchedule(scheduleId).then(response => {
            setSchedule(response.data)
        })
    }
    // 获取患者信息
    const findPatientList = () => {
        patientApi.findList().then(response => {
            setPatientList(response.data)
            if (response.data.length > 0) {
                setPatient(response.data[0])
                setPatientId(response.data[0].id)
            }
        })
    }
    const selectPatient = (index) => {
        setIndex(index)
        setPatient(patientList[index])
    }
    const submitOrder = () => {
        if (patientId == null) {
            message.error('请选择患者')
            return
        }
        // navigate(`/patient/index?paramOrderIndex=1&orderId=${1}`, { replace: true })
        // return
        orderInfoApi.submitOrder(scheduleId, patientId).then(response => {
            dispatch(SET_PatientStateValue({ patientStateValue: 1 }))
            let orderId = response.data
            message.success('保存成功')
            navigate(`/patient/index?paramOrderIndex=1&orderId=${orderId}`, { replace: true })
        }).catch(e => {
        })
    }

    const goAddPatient = () => {
        // navigate('/patient/index', { state: { patientIndex: 2, userIndexDefault: 2 }, replace: true })
        dispatch(SET_PatientStateValue({ patientStateValue: 2 }))
        dispatch(SET_PatientStateIndex({ patientStateIndex: 2 }))
        dispatch(SET_Code({ code: hoscode }))
        navigate('/patient/index', { replace: true })
    }
    const [selectedValue, setSelectedValue] = useState(-1);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const changePatient = (index, patientId) => {
        setActIndex(index)
        setPatientId(patientId)
    }

    return <Stack className={classes.registration} spacing={2} sx={{ py: 2, px: 2 }}>
        <Typography sx={{ fontWeight: 'bold', mt: 1, mb: 1 }} >挂号信息</Typography>
        <Stack direction={'row'} sx={{ py: 2 }}>
            <LabelIcon sx={{ color: '#3375C1' }} />
            <Typography>选择患者：</Typography>
        </Stack>
        <Stack direction={'row'} spacing={4} sx={{ pb: 4 }}>
            {patientList.map((item, index) => (<Card
                variant="outlined"
                key={item.id}
                sx={{ width: 250, height: 100, background: actIndex == index ? '#3375C1' : 'white' }}
                onClick={() => changePatient(index, item.id)}
            >
                <CardContent>
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}  >
                        <Typography sx={{ fontWeight: 'bold', color: actIndex == index ? 'white' : '#333', textAlign: 'center', pt: 1.5 }}>{item.name}</Typography>
                        <Typography sx={{ color: actIndex == index ? 'white' : '#333', textAlign: 'center' }}>{item.certificatesNo}</Typography>
                    </Box>
                </CardContent>
            </Card>))}
            <Card variant="outlined" sx={{ width: 250, height: 100 }} onClick={goAddPatient}>
                <CardContent >
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 65
                    }}  >
                        <AddIcon sx={{ color: '#3375C1' }} />
                        <Typography sx={{ color: '#3375C1', fontSize: 10 }}>添加患者：</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Stack>
        <Stack direction={'row'}>
            <LabelIcon sx={{ color: '#3375C1' }} />
            <Typography>挂号信息</Typography>
        </Stack>
        <Stack spacing={2} sx={{ pl: 40, pt: 4 }}>
            <Stack direction={'row'}>
                <Typography>就诊日期：</Typography>
                <Typography>{schedule.workDate} </Typography>
            </Stack>
            <Stack direction={'row'}> <Typography>就诊医院：</Typography> <Typography>{schedule.param.hosname}</Typography></Stack>
            <Stack direction={'row'}> <Typography>就诊科室：</Typography> <Typography>{schedule.param.depname}</Typography></Stack>
            <Stack direction={'row'}> <Typography>医生职称：</Typography> <Typography>{schedule.docname}</Typography></Stack>
            <Stack direction={'row'}> <Typography>医生专长：</Typography> <Typography>{schedule.title}</Typography></Stack>
            <Stack direction={'row'}> <Typography>医事服务费：</Typography> <Typography>{schedule.amount}</Typography></Stack>
        </Stack>
        {/* <Box sx={{ pl: 40, pt: 4 }}><Button variant='contained' onClick={submitOrder}>{submitBnt}</Button></Box> */}
        <Stack direction={'row'} spacing={2} sx={{ display: 'flex', justifyContent: 'center', pt: 15 }}>
            <Button onClick={() => setShowHospIndex(1)} variant='contained'>返回</Button>
            <Button variant='contained' onClick={submitOrder}>{submitBnt}</Button>
        </Stack>
    </Stack >
}
export default Registration