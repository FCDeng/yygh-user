import { Box, Stack, Typography, Avatar, Button, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import classes from './index.scss'
import cookie from 'js-cookie'
import LoginDialog from '@/components/LoginDialog';
import LabelIcon from '@mui/icons-material/Label';
import hospitalApi from '@/api/hosp/hospital'
import userInfoApi from '@/api/user/userInfo'
import Radio from '@mui/material/Radio';
import dictApi from '@/api/cmn/dict'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { message } from '@/components'
import Checkbox from '@mui/material/Checkbox';
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { useForm, Controller } from 'react-hook-form'
const UserPage = () => {
    const { scheduleId } = useParams()
    const [hoscode, setHoscode] = useState(null)
    const [hospital, setHospital] = useState({ param: {} })
    const [bookingRule, setBookingRule] = useState({})
    const [schedule, setSchedule] = useState({ param: {} })
    const [patientList, setPatientList] = useState([])
    const [patient, setPatient] = useState({})
    const [index, setIndex] = useState(-1)
    const [form, setForm] = useState({})

    const [name, setName] = useState('')
    const [certificatesNo, setCertificatesNo] = useState('')
    const [certificatesTypeList, setCertificatesTypeList] = useState([])
    const [userInfo, setUserInfo] = useState({ param: {} })
    const [submitBnt, setSubmitBnt] = useState('提交')
    const navigate = useNavigate()
    useEffect(() => {
        init()
    }, [])
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: { name: '', certificatesNo: '' },
    })

    const init = () => {
        getUserInfo()
    }
    const getUserInfo = () => {
        userInfoApi.getUserInfo().then(response => {
            setUserInfo(response.data)
        })
    }
   
    const goAddPatient = () => {
        navigate('./patient/add')
    }
    const [selectedValue, setSelectedValue] = useState(-1);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const onFormSubmit = (data) => {
        userInfoApi.saveUserAuth({ ...data, certificatesType: "身份证" }).then(response => {
            message.success("提交成功")
            navigate(-1)
            // window.location.reload()
        })
    }

    return <Stack className={classes.userPage} spacing={4} sx={{ background: 'white', p: 2, boxSizing: 'border-box' }}>
        <Typography sx={{ fontWeight: 'bold', pb: 2 }}>实名认证</Typography>
        <Stack direction={'row'} spacing={1} sx={{ display: 'flex', alignItems: 'center', background: '#f4f9ff', width: '100%', height: 80, p: 2, boxSizing: 'border-box' }} >
            <HealthAndSafetyIcon sx={{ color: '#3375C1' }} />
            {/* <Typography sx={{ fontWeight: 'bold', color: '#3375C1' }}>认证成功</Typography> */}
            <Typography sx={{ fontWeight: 'bold', color: '#3375C1' }}>完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证。</Typography>
        </Stack>
        {userInfo.authStatus === 0 ? <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }} component="form" onSubmit={handleSubmit(onFormSubmit)}>
            <Stack spacing={3} sx={{ pt: 5, width: 400 }}>
                <TextField
                    type="text"
                    name="name"
                    label={'请输入联系人姓名全称'}
                    {...register('name')}
                />
                <TextField
                    type="text"
                    name="certificatesNo"
                    label={'身份证号码：'}
                    {...register('certificatesNo')}
                />
                <Button sx={{ pl: 2 }} type='submit' variant="contained" color="primary">认证</Button>
            </Stack>
        </Box> :
            <Stack spacing={4} sx={{ pl: 40, pt: 4, }}>
                <Stack direction={'row'} spacing={1}>
                    <Typography>姓名：</Typography>
                    <Typography>{userInfo.name}</Typography>
                </Stack>
                <Stack direction={'row'} spacing={1}>
                    <Typography>证件号码：</Typography>
                    <Typography>{userInfo.certificatesNo}</Typography>
                </Stack>
            </Stack>}
    </Stack >
}
export default UserPage