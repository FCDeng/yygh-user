import { Box, Stack, Typography, Avatar, Button, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
import patientApi from '@/api/user/patient'
import { useNavigate, NavLink, useParams } from 'react-router-dom'

import { useForm, Controller } from 'react-hook-form'
const UserListPage = ({ id, setShowUserIndex, setPatientId }) => {
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
    const [userIndex, setUserIndex] = useState(0)
    const navigate = useNavigate()
    useEffect(() => {
        findPatientList()
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

    const findPatientList = () => {
        patientApi.findList().then(response => {
            setPatientList(response.data)
        })
    }

    const goAddPatient = () => {
        navigate('./patient/add')
    }

    const goShow = () => {
        navigate('./patient/show', {})
    }

    const [selectedValue, setSelectedValue] = useState(-1);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const onFormSubmit = (data) => {
        console.log(data)
    }
    const goDetail = id => {
        setPatientId(id)
        setShowUserIndex(1)
    }
    const goAdd = () => {

    }

    return <Stack className={classes.userListPage} spacing={4} sx={{ background: 'white', p: 2, boxSizing: 'border-box' }}>
        <Typography sx={{ fontWeight: 'bold' }}>患者管理</Typography>
        <Stack spacing={2} sx={{ py: 3 }}>
            {patientList.map(item => (<Card
                variant="outlined"
                key={item.id}
                sx={{ width: '100%', height: 50 }}
            >
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Stack direction={'row'} spacing={1}>
                        <Typography>姓名：</Typography>
                        <Typography>{item.name}</Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={1}>
                        <Typography>证件号码：</Typography>
                        <Typography>{item.certificatesNo}</Typography>
                    </Stack>
                    <Stack direction={'row'} sx={{cursor:'pointer'}}>
                        <Typography onClick={() => goDetail(item.id)} sx={{ textAlign: 'center', color: '#3375C1' }}>查看详情</Typography>
                        <ChevronRightIcon sx={{ color: '#3375C1' }} />
                    </Stack>
                </CardContent>
            </Card>))}
        </Stack>

        <Card variant="outlined" sx={{ width: '100%', height: 50 }}>
            <CardContent >
                <Box sx={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', cursor:'pointer'
                }}
                    onClick={() => setShowUserIndex(2)}
                >
                    <AddIcon sx={{ color: '#3375C1' }} />
                    <Typography sx={{ color: '#3375C1', fontSize: 10 }} >添加患者：</Typography>
                </Box>
            </CardContent>
        </Card>
    </Stack >
}
export default UserListPage