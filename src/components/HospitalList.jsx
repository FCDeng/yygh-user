import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import classes from './HospitalList.scss'
const HospitalLogo = require('@/static/images/hospitalLogo.png')

const HospitalList = ({ data }) => {
    const navigate = useNavigate()
    const goHospital = (id) => {
        navigate('./hospital')
    }

    return <Box sx={{ px: 4, width: 400 }} >
        {data.map((item, index) => (
            <NavLink to={`/hospital/${item.hoscode}`} key={item.id} className={classes.nav} >
                <Box sx={{
                    mt: 2, px: 2, display: 'flex', justifyContent: 'space-between',
                    py: 4, background: 'white', borderRadius: 2, border: 1
                }}>
                    <Box>
                        <Typography sx={{ pb: 4 }}>{item.hosname}</Typography>
                        <Stack flexDirection={'row'} >
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} spacing={2}>
                                <AlignVerticalBottomIcon fontSize='1' sx={{ pr: 0.5, color: '#999' }} />
                                <Typography sx={{ color: '#999' }}>{item.param.hostypeString}</Typography>
                            </Box>
                            <Typography sx={{ pl: 4, color: '#999' }}>{`每天${item.bookingRule.releaseTime}放号`}</Typography>
                        </Stack>
                    </Box>
                    <Avatar src={HospitalLogo} sx={{ width: 80, height: 80 }}>{item.hosname}</Avatar>
                </Box>
            </NavLink>
        ))}
    </Box>
}
export default HospitalList