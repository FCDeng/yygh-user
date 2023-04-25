import { Box, Stack, Typography, Avatar } from '@mui/material';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import { useState, useEffect } from 'react';
import classes from './HospitalCode.scss'
import cookie from 'js-cookie'
import LoginDialog from '@/components/LoginDialog';
import LabelIcon from '@mui/icons-material/Label';
import hospitalApi from '@/api/hosp/hospital'
import userInfoApi from '@/api/user/userInfo'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useLocation } from 'react-router-dom'
const HospitalLogo = require('@/static/images/hospitalLogo.png')
const HospitalDetail = ({hoscode}) => { 
    const [hospital, setHospital] = useState({ param: {} })
    useEffect(() => {
        init()
    },[])
    const init = () => {
        hospitalApi.findHospDetail(hoscode).then(response => {
            setHospital(response.data.hospital)
            // setBookingRule(response.data.bookingRule)
        })
    }
    return <Box className={classes.hospitalDetail}>
        <Stack sx={{ mb: 2 }} direction={'row'} spacing={2}>
            <Typography sx={{ fontWeight: 'bold' }} >{hospital.hosname || '香港玛丽'}</Typography>
            <Stack direction={'row'} spacing={1}>
                <AlignVerticalBottomIcon className={classes.m0} />
                <Typography>{hospital.param.hostypeString}</Typography>
            </Stack>
        </Stack>
        <Stack direction="row" spacing={2}>
            <Avatar src={HospitalLogo} sx={{ width: 80, height: 80 }}>{hospital.hosname}</Avatar>
            <Stack direction={'row'} spacing={2}>
                <LocationOnIcon />
                <Typography >{hospital.route || `公交路线:乘1、4、52、120、126、420、802、728路在东单路口西下车。`}</Typography>
            </Stack>
        </Stack>
        <Stack spacing={4}>
            <Typography sx={{ fontWeight: 'bold', pt: 4 }} >医院介绍</Typography>
            <Typography>
                {hospital.intro}
            </Typography>
        </Stack>
    </Box>
}
export default HospitalDetail