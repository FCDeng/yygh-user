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
import patientApi from '@/api/user/patient'
import { useForm, Controller } from 'react-hook-form'
const UserPage = ({ id, setShowUserIndex, patientId }) => {
    const [patient, setPatient] = useState({ param: {} })
    const navigate = useNavigate()
    useEffect(() => {
        init()
    },[])

    const init = () => {
        patientApi.getById(patientId).then(response => {
            setPatient(response.data)
        })
    }
    const remove = () => {
        patientApi.removeById(id).then(response => {
            message.success('删除成功')
            setShowUserIndex(2)
        })
    }
    const edit = () => {
        showAdd()
        // navigate('./patient/add', { state: { id } })
    }

    return <Stack className={classes.userListPage} spacing={4} sx={{ background: 'white', p: 2, boxSizing: 'border-box' }}>
        <Typography sx={{ fontWeight: 'bold' }}>就诊人详情</Typography>
        <Typography sx={{ pt: 1, pb: 1 }}>就诊人信息</Typography>

        <Stack spacing={2} sx={{ pl: 40 }}>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>姓名：</Typography><Typography>{patient.name}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>证件号码：</Typography><Typography>{patient.certificatesNo}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>性别：</Typography><Typography>{patient.sex == 1 ? '男' : '女'}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>出生日期：</Typography><Typography>{patient.birthdate}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>手机号码：</Typography><Typography>{patient.phone}</Typography></Stack>
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>婚姻状况：</Typography><Typography>{patient.isMarry == 1 ? '已婚' : '未婚'}</Typography></Stack>
            {/* <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>当前住址：</Typography><Typography>{`${patient.param.provinceString}/${patient.param.cityString}/${patient.param.districtString}`}</Typography></Stack> */}
            <Stack direction={'row'}><Typography spacing={1} sx={{ color: '#999' }}>详细地址：</Typography><Typography>{patient.address}</Typography></Stack>
        </Stack>
        <Stack direction={'row'} spacing={2}  sx={{ display: 'flex', justifyContent: 'center', pt: 15  }}>
            <Button onClick={remove} variant='contained'>删除</Button>
            <Button onClick={() => {setShowUserIndex(2)}} variant='contained'>编辑</Button>
            <Button onClick={() => setShowUserIndex(0)} variant='contained'>返回</Button>
        </Stack>
    </Stack >
}
export default UserPage