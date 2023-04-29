import { Box, Stack, Typography, Avatar, Button } from '@mui/material';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import { useState, useEffect } from 'react';
import classes from './HospitalCode.scss'
import cookie from 'js-cookie'
import LoginDialog from '@/components/LoginDialog';
import LabelIcon from '@mui/icons-material/Label';
import hospitalApi from '@/api/hosp/hospital'
import userInfoApi from '@/api/user/userInfo'
import { useNavigate, useLocation } from 'react-router-dom'
const HospitalLogo = require('@/static/images/hospitalLogo.png')
const HospitalCode = ({ hoscode, setShowHospIndex, setDepCode }) => {
    const [hospital, setHospital] = useState({ param: {} })
    const [bookingRule, setBookingRule] = useState({})
    const [departmentVoList, setDepartmentVoList] = useState([])
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [actIndex, setActIndex] = useState(0);
    const navigate = useNavigate()
    useEffect(() => {
        init()
    }, [])
    const init = () => {
        hospitalApi.findHospDetail(hoscode).then(response => {
            setHospital(response.data.hospital)
            setBookingRule(response.data.bookingRule)
        })
        hospitalApi.findDepartment(hoscode).then(response => {
            setDepartmentVoList(response.data)
        })
    }
    const schedule = (depcode) => {
        let token = cookie.get('token')
        if (!token) {
            setOpenLoginDialog(true)
            return
        }
        // //判断认证
        userInfoApi.getUserInfo().then(response => {
            let authStatus = response.data.authStatus
            // 状态为2认证通过
            if (!authStatus || authStatus != 2) {
                navigate('/patient/index', { replace: true })
                return
            }
        })

        setShowHospIndex(1)
        setDepCode(depcode)
    }

    return <Box className={classes.hospitalCode}>
        <Stack sx={{ mb: 2 }} direction={'row'} spacing={4}>
            <Typography sx={{ fontWeight: 'bold' }} >{hospital.hosname || '香港玛丽'}</Typography>
            <Stack direction={'row'} spacing={1}>
                <AlignVerticalBottomIcon className={classes.m0} />
                <Typography>{hospital.param.hostypeString}</Typography>
            </Stack>
        </Stack>
        <Stack direction="row" spacing={3}>
            <Avatar src={HospitalLogo} sx={{ width: 80, height: 80 }}>{hospital.hosname}</Avatar>
            <Stack spacing={2} sx={{ pt: 2 }} className={classes.m0}>
                <Typography>挂号规则</Typography>
                <Stack direction="row" spacing={2} alignItems={'center'} >
                    <Stack className={classes.m0} flexDirection={'row'} alignItems={'center'} spacing={2} ><Typography sx={{ color: '#999' }} className={classes.m0}>预约周期：</Typography><Typography className={classes.m0} sx={{ color: '#333' }}>{bookingRule.cycle}</Typography></Stack>
                    <Stack className={classes.m0} flexDirection={'row'} alignItems={'center'} spacing={2} ><Typography sx={{ color: '#999' }} className={classes.m0}>放号时间：</Typography><Typography className={classes.m0} sx={{ color: '#333' }}>{bookingRule.releaseTime}</Typography></Stack>
                    <Stack className={classes.m0} flexDirection={'row'} alignItems={'center'} spacing={2} ><Typography sx={{ color: '#999' }} className={classes.m0}>停挂时间：</Typography><Typography className={classes.m0} sx={{ color: '#333' }}>{bookingRule.stopTime}</Typography></Stack>
                </Stack>
                {/* <Stack flexDirection={'row'} alignItems={'center'} spacing={2}>
                    <Typography className={classes.m0} sx={{ color: '#999' }} >：</Typography>
                    <Typography className={classes.m0} component={'span'} sx={{ color: '#333', mt: 0 }}>{`就诊前一工作日${bookingRule.quitTime}前取消`}</Typography>
                </Stack> */}
            </Stack>
        </Stack>
        <Box>
            <Typography sx={{ fontWeight: 'bold', mb: 2, pt: 1 }} component={'h2'}>选择科室</Typography>
            <Stack spacing={1}>
                {departmentVoList.map((item, index) => (
                    <Stack spacing={1} key={`${item.id}${index}bb`}>
                        <Stack direction={'row'} spacing={1}>
                            <LabelIcon sx={{ color: '#3375C1' }} />
                            <Typography sx={{ fontWeight: 'bold' }}>{item.depname}</Typography>
                        </Stack>
                        {item.children.map((it, index) => (
                            <Typography onClick={() => schedule(it.depcode)} key={`${it.id}${index}aa`} sx={{ color: '#999', pl: 3.8, pb: 2, cursor: 'pointer' }}>{it.depname}</Typography>
                        ))}
                    </Stack>
                ))}

            </Stack>
        </Box>

        <LoginDialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)} />
    </Box>
}
export default HospitalCode