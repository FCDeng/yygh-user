import {
    Box, Stack, Typography, Avatar, Button, TextField, FormControl, FormControlLabel, InputLabel, RadioGroup,
    Radio, Grid,
    Select,
    MenuItem,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import classes from './index.scss'
import cookie from 'js-cookie'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'
import hospitalApi from '@/api/hosp/hospital'
import userInfoApi from '@/api/user/userInfo'
import patientApi from '@/api/user/patient'
import dictApi from '@/api/cmn/dict'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { message } from '@/components'
import Checkbox from '@mui/material/Checkbox';
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { SET_PatientStateValue, SET_PatientStateIndex, SET_UserStateValue, SET_UserStateIndex, SET_Code } from '@/store/user'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
const defaultForm = {
    name: '',
    certificatesType: '',
    certificates_no: '',
    sex: 1,
    birthdate: dayjs(),
    phone: '',
    isMarry: 0,
    isInsure: 0,
    provinceCode: '',
    cityCode: '',
    districtCode: '',
    addressSelected: null,
    address: '',
    contactsName: '',
    contactsCertificatesType: '',
    contactscertificates_no: '',
    contactsPhone: '',
    param: {}
}
const UserAdd = ({ id, setPatientIndex, setShowUserIndex, patientId }) => {
    const user = useSelector((state) => {
        return state.user
    })
    const dispatch = useDispatch();
    const [patientList, setPatientList] = useState([])
    const [patient, setPatient] = useState(defaultForm)
    const [certificates_no, setcertificates_no] = useState('')
    const [submitBnt, setSubmitBnt] = useState('提交')
    const navigate = useNavigate()
    useEffect(() => {
        if (patientId) {
            // fetchDataById()
        }
    }, [patientId])
    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: patient,
    })


    const fetchDataById = () => {
        patientApi.getById(patientId).then(response => {
            setPatient(response.data)

        })
    }

    // 新增
    const saveData = () => {
        if (submitBnt == '正在提交...') {
            message.info('重复提交')
            return
        }
        setSubmitBnt('正在提交...')
        patientApi.save(patient).then(response => {
            message.success("提交成功")
            //    window.location.reload()
            setPatientIndex(2)
            setShowUserIndex(0)
        }).catch(e => {
            setSubmitBnt('保存')
        })
    }
    const onFormSubmit = (data) => {
        const params = {
            ...data,
            addressSelected: [110000, 110100, 110101],
            certificatesType: "身份证",
            cityCode: 110100,
            certificatesNo: data.certificates_no,
            contactsCertificatesType: "10",
            contactsCertificatesNo: data.certificates_no,
            contactsName: "测试",
            contactsPhone: "13535255222",
            districtCode: 110101,
            isInsure: 0,
            isMarry: 0,
            param: {
                phone: "13535255222",
                provinceCode: 110000,
                sex: data.sex || 1
            },
            certificates_url: '',
            phone: data.phone || "13535255222",
            provinceCode: 110000,
            sex: data.sex || 1
        }
        if (!id) {
            patientApi.save(params).then(response => {
                message.success("提交成功")
                setShowUserIndex(0)
            })
        } else {
            patientApi.updateById(params).then(response => {
                message.success("提交成功")
                //    window.location.reload()
                setPatientIndex(2)
                setShowUserIndex(0)
            })
        }
    }
    const handleChange = (birthdate) => {
        setPatient(pre => ({ ...pre, birthdate }))
    }
    const goBack = () => {
        setShowUserIndex(0)
    }

    return <Stack className={classes.userListPage} spacing={4} sx={{ background: 'white', p: 2, boxSizing: 'border-box' }}>
        <Typography sx={{ fontWeight: 'bold' }}>添加就诊人</Typography>
        <Typography sx={{ pt: 4, pb: 1 }}>就诊人信息</Typography>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
            <Grid container sx={{ py: 1 }} >
                <Stack spacing={2} direction={'row'}>
                    <Grid item xs={6} sx={{ width: 450 }}>
                        <TextField
                            type="text"
                            fullWidth
                            name="name"
                            label={'请输入姓名全称'}
                            {...register('name')}
                        /></Grid>
                    <Grid item xs={6} sx={{ pl: 2, width: 450 }}>
                        <TextField
                            fullWidth
                            type="text"
                            name="certificates_no"
                            label={'身份证号码：'}
                            {...register('certificates_no')}
                        />
                    </Grid>
                </Stack>
            </Grid>
            <Grid container sx={{ pt: 2 }}>
                <Stack spacing={2} direction={'row'}>
                    <Grid item xs={6} sx={{ width: 450 }}>
                        <TextField
                            name="phone"
                            fullWidth
                            inputProps={{ length: 11 }}
                            label={'请输入电话号码'}
                            {...register('phone')}
                        /></Grid>

                    <Grid item xs={6} sx={{ pl: 1 }} >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    sx={{ width: 440 }}
                                    label="出生日期"
                                    value={patient.birthdate}
                                    onChange={handleChange} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                </Stack>
            </Grid>
            <Grid container sx={{ pt: 2, pl: 1, width: 450 }}>
                <Stack direction={'row'}>
                    <Typography component={'span'} sx={{ mt: 1 }}> 性别： </Typography>
                    <Stack spacing={2} direction={'row'}>
                        <Grid item xs={6}>
                            <FormControl>
                                <Controller
                                    name="sex"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <RadioGroup name="sex" row {...field}>
                                                <Stack direction={'row'}>
                                                    <FormControlLabel
                                                        key="Sponsor"
                                                        value={1}
                                                        control={<Radio size="small" />}
                                                        label={'男'}
                                                    />
                                                    <FormControlLabel
                                                        key="Venue"
                                                        value={0}
                                                        control={<Radio size="small" />}
                                                        label={'女'}
                                                    />
                                                </Stack>
                                            </RadioGroup>
                                        )
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Stack>
                    <Grid item xs={8} sx={{ pl: 5 }} >
                        <TextField
                            // fullWidth
                            sx={{ width: 700 }}
                            type="text"
                            name="address"
                            label={'详细地址：'}
                            {...register('address')}
                        />
                    </Grid>
                </Stack>

            </Grid>
            <Stack direction={'row'} spacing={2} sx={{ display: 'flex', justifyContent: 'center', pt: 15 }}>
                <Button onClick={goBack} variant='contained'>返回</Button>
                <Button type='submit' variant='contained'>{submitBnt}</Button>
            </Stack>
        </Box>
    </Stack >
}
export default UserAdd